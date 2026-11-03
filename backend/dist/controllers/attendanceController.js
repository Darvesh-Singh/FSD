"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttendanceController = void 0;
const attendanceService_js_1 = require("../services/attendanceService.js");
const store_js_1 = require("../db/store.js");
class AttendanceController {
    // 1. RFID Scan Check-In
    static rfidScan(req, res) {
        try {
            const { rfidBadgeId, lectureId } = req.body;
            if (!rfidBadgeId) {
                return res.status(400).json({ success: false, error: 'rfidBadgeId is required' });
            }
            const result = attendanceService_js_1.AttendanceService.processRfidScan(rfidBadgeId, lectureId);
            res.json(result);
        }
        catch (err) {
            res.status(400).json({ success: false, error: err.message });
        }
    }
    // 2. Dynamic QR Check-In
    static dynamicQrScan(req, res) {
        try {
            const { qrToken, studentId, lectureId } = req.body;
            if (!qrToken || !studentId || !lectureId) {
                return res.status(400).json({
                    success: false,
                    error: 'qrToken, studentId, and lectureId are required'
                });
            }
            const result = attendanceService_js_1.AttendanceService.processDynamicQrScan(qrToken, studentId, lectureId);
            res.json(result);
        }
        catch (err) {
            res.status(400).json({ success: false, error: err.message });
        }
    }
    // 3. Geofenced GPS Check-In
    static geofenceCheckIn(req, res) {
        try {
            const { studentId, lectureId, lat, lng } = req.body;
            if (!studentId || !lectureId || lat === undefined || lng === undefined) {
                return res.status(400).json({
                    success: false,
                    error: 'studentId, lectureId, lat, and lng are required'
                });
            }
            const result = attendanceService_js_1.AttendanceService.processGeofenceCheckIn(studentId, lectureId, Number(lat), Number(lng));
            res.json(result);
        }
        catch (err) {
            res.status(400).json({ success: false, error: err.message });
        }
    }
    // 4. Manual Override
    static manualOverride(req, res) {
        try {
            const { lectureId, studentId, status, notes } = req.body;
            if (!lectureId || !studentId || !status) {
                return res.status(400).json({
                    success: false,
                    error: 'lectureId, studentId, and status are required'
                });
            }
            const result = attendanceService_js_1.AttendanceService.manualOverride(lectureId, studentId, status, notes);
            res.json(result);
        }
        catch (err) {
            res.status(400).json({ success: false, error: err.message });
        }
    }
    // 5. Dynamic QR Rotate / Fetch
    static rotateQr(req, res) {
        try {
            const { lectureId } = req.params;
            const result = attendanceService_js_1.AttendanceService.rotateDynamicQr(lectureId);
            res.json({ success: true, data: result });
        }
        catch (err) {
            res.status(400).json({ success: false, error: err.message });
        }
    }
    // 6. Submit Appeal
    static submitAppeal(req, res) {
        try {
            const { studentId, attendanceLogId, reasonCategory, explanation, documentUrl } = req.body;
            if (!studentId || !attendanceLogId || !reasonCategory || !explanation) {
                return res.status(400).json({
                    success: false,
                    error: 'studentId, attendanceLogId, reasonCategory, and explanation are required'
                });
            }
            const result = attendanceService_js_1.AttendanceService.submitAppeal({
                studentId,
                attendanceLogId,
                reasonCategory,
                explanation,
                documentUrl
            });
            res.json(result);
        }
        catch (err) {
            res.status(400).json({ success: false, error: err.message });
        }
    }
    // 7. Reset mock data store (for clean demo testing)
    static resetData(req, res) {
        try {
            store_js_1.dbStore.reset();
            res.json({ success: true, message: 'Dataset re-seeded to pristine demo state!' });
        }
        catch (err) {
            res.status(500).json({ success: false, error: err.message });
        }
    }
}
exports.AttendanceController = AttendanceController;
