import { Router } from 'express';
import { AttendanceController } from '../controllers/attendanceController.js';

const router = Router();

router.post('/rfid-scan', AttendanceController.rfidScan);
router.post('/dynamic-qr', AttendanceController.dynamicQrScan);
router.post('/geofence', AttendanceController.geofenceCheckIn);
router.post('/override', AttendanceController.manualOverride);
router.get('/rotate-qr/:lectureId', AttendanceController.rotateQr);
router.post('/appeal', AttendanceController.submitAppeal);
router.post('/reset-demo', AttendanceController.resetData);

export default router;

