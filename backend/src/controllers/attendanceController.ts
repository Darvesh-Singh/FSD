import { Request, Response } from 'express';
import { AttendanceService } from '../services/attendanceService.js';
import { dbStore } from '../db/store.js';

export class AttendanceController {
  // 1. RFID Scan Check-In
  public static rfidScan(req: Request, res: Response) {
    try {
      const { rfidBadgeId, lectureId } = req.body;
      if (!rfidBadgeId) {
        return res.status(400).json({ success: false, error: 'rfidBadgeId is required' });
      }

      const result = AttendanceService.processRfidScan(rfidBadgeId, lectureId);
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }

  // 2. Dynamic QR Check-In
  public static dynamicQrScan(req: Request, res: Response) {
    try {
      const { qrToken, studentId, lectureId } = req.body;
      if (!qrToken || !studentId || !lectureId) {
        return res.status(400).json({ 
          success: false, 
          error: 'qrToken, studentId, and lectureId are required' 
        });
      }

      const result = AttendanceService.processDynamicQrScan(qrToken, studentId, lectureId);
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }

  // 3. Geofenced GPS Check-In
  public static geofenceCheckIn(req: Request, res: Response) {
    try {
      const { studentId, lectureId, lat, lng } = req.body;
      if (!studentId || !lectureId || lat === undefined || lng === undefined) {
        return res.status(400).json({ 
          success: false, 
          error: 'studentId, lectureId, lat, and lng are required' 
        });
      }

      const result = AttendanceService.processGeofenceCheckIn(
        studentId, lectureId, Number(lat), Number(lng)
      );
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }

  // 4. Manual Override
  public static manualOverride(req: Request, res: Response) {
    try {
      const { lectureId, studentId, status, notes } = req.body;
      if (!lectureId || !studentId || !status) {
        return res.status(400).json({ 
          success: false, 
          error: 'lectureId, studentId, and status are required' 
        });
      }

      const result = AttendanceService.manualOverride(lectureId, studentId, status, notes);
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }

  // 5. Dynamic QR Rotate / Fetch
  public static rotateQr(req: Request, res: Response) {
    try {
      const { lectureId } = req.params;
      const result = AttendanceService.rotateDynamicQr(lectureId);
      res.json({ success: true, data: result });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }

  // 6. Submit Appeal
  public static submitAppeal(req: Request, res: Response) {
    try {
      const { studentId, attendanceLogId, reasonCategory, explanation, documentUrl } = req.body;
      if (!studentId || !attendanceLogId || !reasonCategory || !explanation) {
        return res.status(400).json({
          success: false,
          error: 'studentId, attendanceLogId, reasonCategory, and explanation are required'
        });
      }

      const result = AttendanceService.submitAppeal({
        studentId,
        attendanceLogId,
        reasonCategory,
        explanation,
        documentUrl
      });
      res.json(result);
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }

  // 7. Reset mock data store (for clean demo testing)
  public static resetData(req: Request, res: Response) {
    try {
      dbStore.reset();
      res.json({ success: true, message: 'Dataset re-seeded to pristine demo state!' });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
}

