"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttendanceService = void 0;
exports.calculateDistanceInMeters = calculateDistanceInMeters;
const store_js_1 = require("../db/store.js");
// Calculate Great Circle distance between two lat/lng pairs in meters using Haversine Formula
function calculateDistanceInMeters(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // Earth radius in meters
    const toRad = (x) => (x * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c);
}
class AttendanceService {
    /**
     * Determine attendance status based on lecture schedule and check-in time
     */
    static determineStatus(lecture, checkInDate = new Date()) {
        // Parse lecture start time
        const [startH, startM] = lecture.startTime.split(':').map(Number);
        const lectureStart = new Date(checkInDate);
        lectureStart.setHours(startH, startM, 0, 0);
        const diffMinutes = (checkInDate.getTime() - lectureStart.getTime()) / (1000 * 60);
        if (diffMinutes <= lecture.gracePeriodMinutes) {
            return { status: 'PRESENT', notes: 'Checked in on time within grace period' };
        }
        else if (diffMinutes <= lecture.lateCutoffMinutes) {
            return { status: 'LATE', notes: `Checked in ${Math.round(diffMinutes)} mins after lecture start (Grace: ${lecture.gracePeriodMinutes}m)` };
        }
        else {
            return { status: 'LATE', notes: `Checked in beyond cutoff (${Math.round(diffMinutes)} mins late)` };
        }
    }
    /**
     * 1. RFID Badge Scanner Check-In
     */
    static processRfidScan(rfidBadgeId, lectureId) {
        const student = store_js_1.dbStore.users.find(u => u.rfidBadgeId === rfidBadgeId);
        if (!student) {
            throw new Error(`RFID Badge "${rfidBadgeId}" not recognized in university registry.`);
        }
        // Find active lecture
        let targetLecture;
        if (lectureId) {
            targetLecture = store_js_1.dbStore.lectures.find(l => l.id === lectureId);
        }
        else {
            // Auto-locate active in-progress lecture student is enrolled in
            const studentEnrollments = store_js_1.dbStore.enrollments.filter(e => e.studentId === student.id);
            const enrolledSecIds = studentEnrollments.map(e => e.sectionId);
            targetLecture = store_js_1.dbStore.lectures.find(l => l.status === 'IN_PROGRESS' && enrolledSecIds.includes(l.sectionId));
            if (!targetLecture) {
                // Fallback to any active lecture for demo convenience
                targetLecture = store_js_1.dbStore.lectures.find(l => l.status === 'IN_PROGRESS');
            }
        }
        if (!targetLecture) {
            throw new Error(`No active in-progress lecture session found for student ${student.name}.`);
        }
        const { status, notes } = this.determineStatus(targetLecture);
        const checkInTime = new Date().toISOString();
        // Upsert attendance log
        let log = store_js_1.dbStore.attendanceLogs.find(l => l.lectureId === targetLecture.id && l.studentId === student.id);
        if (log) {
            log.status = status;
            log.checkInTime = checkInTime;
            log.checkInMethod = 'RFID_SCAN';
            log.verifiedByInstructor = true;
            log.notes = notes;
        }
        else {
            log = {
                id: `log-${targetLecture.id}-${student.id}`,
                lectureId: targetLecture.id,
                studentId: student.id,
                status,
                checkInTime,
                checkInMethod: 'RFID_SCAN',
                verifiedByInstructor: true,
                notes
            };
            store_js_1.dbStore.attendanceLogs.push(log);
        }
        const section = store_js_1.dbStore.sections.find(s => s.id === targetLecture.sectionId);
        const course = store_js_1.dbStore.courses.find(c => c.id === section.courseId);
        return {
            success: true,
            message: `RFID Badge Scan Successful! Marked as ${status}.`,
            student: {
                id: student.id,
                universityId: student.universityId,
                name: student.name,
                avatarUrl: student.avatarUrl
            },
            lecture: {
                id: targetLecture.id,
                courseCode: course.code,
                courseTitle: course.title,
                hall: targetLecture.hall
            },
            attendance: {
                status,
                checkInTime,
                checkInMethod: 'RFID_SCAN'
            }
        };
    }
    /**
     * 2. Dynamic QR Code Check-In
     */
    static processDynamicQrScan(qrToken, studentId, lectureId) {
        const student = store_js_1.dbStore.users.find(u => u.id === studentId);
        if (!student)
            throw new Error('Student record not found.');
        const lecture = store_js_1.dbStore.lectures.find(l => l.id === lectureId);
        if (!lecture)
            throw new Error('Lecture session not found.');
        if (lecture.status !== 'IN_PROGRESS') {
            throw new Error(`Lecture is currently ${lecture.status}. QR check-in is only available during active sessions.`);
        }
        // Verify token against active dynamic QR code
        if (!lecture.dynamicQrCode || lecture.dynamicQrCode !== qrToken.trim().toUpperCase()) {
            throw new Error('Invalid or expired dynamic QR token. Please scan the current code displayed on the lecture screen.');
        }
        const { status, notes } = this.determineStatus(lecture);
        const checkInTime = new Date().toISOString();
        let log = store_js_1.dbStore.attendanceLogs.find(l => l.lectureId === lecture.id && l.studentId === student.id);
        if (log) {
            log.status = status;
            log.checkInTime = checkInTime;
            log.checkInMethod = 'DYNAMIC_QR';
            log.verifiedByInstructor = true;
            log.notes = notes;
        }
        else {
            log = {
                id: `log-${lecture.id}-${student.id}`,
                lectureId: lecture.id,
                studentId: student.id,
                status,
                checkInTime,
                checkInMethod: 'DYNAMIC_QR',
                verifiedByInstructor: true,
                notes
            };
            store_js_1.dbStore.attendanceLogs.push(log);
        }
        const section = store_js_1.dbStore.sections.find(s => s.id === lecture.sectionId);
        const course = store_js_1.dbStore.courses.find(c => c.id === section.courseId);
        return {
            success: true,
            message: `Dynamic QR Verified! Check-in confirmed as ${status}.`,
            student: {
                id: student.id,
                name: student.name,
                universityId: student.universityId
            },
            course: {
                code: course.code,
                title: course.title
            },
            attendance: {
                status,
                checkInTime,
                checkInMethod: 'DYNAMIC_QR'
            }
        };
    }
    /**
     * 3. Geofenced GPS Check-In
     */
    static processGeofenceCheckIn(studentId, lectureId, userLat, userLng) {
        const student = store_js_1.dbStore.users.find(u => u.id === studentId);
        if (!student)
            throw new Error('Student record not found.');
        const lecture = store_js_1.dbStore.lectures.find(l => l.id === lectureId);
        if (!lecture)
            throw new Error('Lecture session not found.');
        // Calculate distance
        const distanceMeters = calculateDistanceInMeters(userLat, userLng, lecture.geofenceLat, lecture.geofenceLng);
        const isWithinGeofence = distanceMeters <= lecture.geofenceRadiusMeters;
        if (!isWithinGeofence) {
            throw new Error(`Geofence verification failed: You are ${distanceMeters}m away from ${lecture.hall}. ` +
                `Check-in is only permitted within ${lecture.geofenceRadiusMeters}m of the lecture hall perimeter.`);
        }
        const { status, notes } = this.determineStatus(lecture);
        const checkInTime = new Date().toISOString();
        let log = store_js_1.dbStore.attendanceLogs.find(l => l.lectureId === lecture.id && l.studentId === student.id);
        if (log) {
            log.status = status;
            log.checkInTime = checkInTime;
            log.checkInMethod = 'GEOFENCE_GPS';
            log.gpsLat = userLat;
            log.gpsLng = userLng;
            log.distanceFromHallMeters = distanceMeters;
            log.verifiedByInstructor = true;
            log.notes = `${notes} (GPS Geofence: ${distanceMeters}m from center)`;
        }
        else {
            log = {
                id: `log-${lecture.id}-${student.id}`,
                lectureId: lecture.id,
                studentId: student.id,
                status,
                checkInTime,
                checkInMethod: 'GEOFENCE_GPS',
                gpsLat: userLat,
                gpsLng: userLng,
                distanceFromHallMeters: distanceMeters,
                verifiedByInstructor: true,
                notes: `GPS Geofence verified: ${distanceMeters}m from hall`
            };
            store_js_1.dbStore.attendanceLogs.push(log);
        }
        const section = store_js_1.dbStore.sections.find(s => s.id === lecture.sectionId);
        const course = store_js_1.dbStore.courses.find(c => c.id === section.courseId);
        return {
            success: true,
            message: `Geofence Verified! You are within ${distanceMeters}m of ${lecture.hall}. Marked as ${status}.`,
            distanceMeters,
            allowedRadius: lecture.geofenceRadiusMeters,
            lecture: {
                id: lecture.id,
                courseCode: course.code,
                courseTitle: course.title,
                hall: lecture.hall
            },
            attendance: {
                status,
                checkInTime,
                checkInMethod: 'GEOFENCE_GPS'
            }
        };
    }
    /**
     * 4. Manual Override by Instructor or Admin
     */
    static manualOverride(lectureId, studentId, status, notes) {
        const lecture = store_js_1.dbStore.lectures.find(l => l.id === lectureId);
        if (!lecture)
            throw new Error('Lecture session not found.');
        const student = store_js_1.dbStore.users.find(u => u.id === studentId);
        if (!student)
            throw new Error('Student record not found.');
        let log = store_js_1.dbStore.attendanceLogs.find(l => l.lectureId === lectureId && l.studentId === studentId);
        const checkInTime = (status === 'PRESENT' || status === 'LATE') ? new Date().toISOString() : undefined;
        if (log) {
            log.status = status;
            log.checkInTime = checkInTime;
            log.checkInMethod = 'MANUAL_OVERRIDE';
            log.verifiedByInstructor = true;
            log.notes = notes || 'Manual override recorded by instructor';
        }
        else {
            log = {
                id: `log-${lectureId}-${studentId}`,
                lectureId,
                studentId,
                status,
                checkInTime,
                checkInMethod: 'MANUAL_OVERRIDE',
                verifiedByInstructor: true,
                notes: notes || 'Manual override recorded by instructor'
            };
            store_js_1.dbStore.attendanceLogs.push(log);
        }
        return {
            success: true,
            message: `Attendance updated to ${status} for ${student.name}.`,
            log
        };
    }
    /**
     * 5. Rotate Dynamic QR Code for Professor Screen
     */
    static rotateDynamicQr(lectureId) {
        const lecture = store_js_1.dbStore.lectures.find(l => l.id === lectureId);
        if (!lecture)
            throw new Error('Lecture session not found.');
        // Generate random secure 6-digit dynamic token
        const newCode = `UNIV-${Math.floor(100000 + Math.random() * 900000)}`;
        const expiresAt = new Date(Date.now() + 30 * 1000).toISOString(); // 30 seconds validity
        lecture.dynamicQrCode = newCode;
        lecture.dynamicQrExpiresAt = expiresAt;
        return {
            lectureId: lecture.id,
            code: newCode,
            expiresAt,
            validitySeconds: 30
        };
    }
    /**
     * 6. Submit Absence Appeal by Student
     */
    static submitAppeal(payload) {
        const student = store_js_1.dbStore.users.find(u => u.id === payload.studentId);
        if (!student)
            throw new Error('Student not found.');
        const log = store_js_1.dbStore.attendanceLogs.find(l => l.id === payload.attendanceLogId);
        if (!log)
            throw new Error('Attendance log record not found.');
        const appeal = {
            id: `apl-${Date.now()}`,
            attendanceLogId: payload.attendanceLogId,
            studentId: payload.studentId,
            reasonCategory: payload.reasonCategory,
            explanation: payload.explanation,
            documentUrl: payload.documentUrl,
            status: 'PENDING',
            submittedAt: new Date().toISOString()
        };
        store_js_1.dbStore.absenceAppeals.push(appeal);
        return {
            success: true,
            message: 'Absence appeal submitted successfully for faculty review.',
            appeal
        };
    }
}
exports.AttendanceService = AttendanceService;
