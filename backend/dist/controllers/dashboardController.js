"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardController = void 0;
const store_js_1 = require("../db/store.js");
class DashboardController {
    static getDashboard(req, res) {
        try {
            const kpis = store_js_1.dbStore.getDashboardKPIs();
            res.json({
                success: true,
                data: kpis
            });
        }
        catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    }
    static getLiveLecture(req, res) {
        try {
            const { lectureId } = req.params;
            const lecture = store_js_1.dbStore.lectures.find(l => l.id === lectureId);
            if (!lecture) {
                return res.status(404).json({ success: false, error: 'Lecture not found' });
            }
            const sec = store_js_1.dbStore.sections.find(s => s.id === lecture.sectionId);
            const course = store_js_1.dbStore.courses.find(c => c.id === sec.courseId);
            const instructor = store_js_1.dbStore.users.find(u => u.id === sec.instructorId);
            const enrollments = store_js_1.dbStore.enrollments.filter(e => e.sectionId === sec.id);
            const enrolledStudents = enrollments.map(enr => {
                const student = store_js_1.dbStore.users.find(u => u.id === enr.studentId);
                const log = store_js_1.dbStore.attendanceLogs.find(l => l.lectureId === lecture.id && l.studentId === student.id);
                return {
                    id: student.id,
                    universityId: student.universityId,
                    name: student.name,
                    email: student.email,
                    avatarUrl: student.avatarUrl,
                    rfidBadgeId: student.rfidBadgeId,
                    status: log?.status || 'ABSENT',
                    checkInTime: log?.checkInTime,
                    checkInMethod: log?.checkInMethod || 'SYSTEM_AUTO',
                    distance: log?.distanceFromHallMeters
                };
            });
            res.json({
                success: true,
                data: {
                    lecture,
                    section: sec,
                    course,
                    instructor,
                    enrolledCount: enrollments.length,
                    checkedInCount: enrolledStudents.filter(s => s.status === 'PRESENT' || s.status === 'LATE').length,
                    students: enrolledStudents
                }
            });
        }
        catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    }
}
exports.DashboardController = DashboardController;
