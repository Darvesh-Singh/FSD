import { Request, Response } from 'express';
import { dbStore } from '../db/store.js';

export class DashboardController {
  public static getDashboard(req: Request, res: Response) {
    try {
      const kpis = dbStore.getDashboardKPIs();
      res.json({
        success: true,
        data: kpis
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  public static getLiveLecture(req: Request, res: Response) {
    try {
      const { lectureId } = req.params;
      const lecture = dbStore.lectures.find(l => l.id === lectureId);
      if (!lecture) {
        return res.status(404).json({ success: false, error: 'Lecture not found' });
      }

      const sec = dbStore.sections.find(s => s.id === lecture.sectionId)!;
      const course = dbStore.courses.find(c => c.id === sec.courseId)!;
      const instructor = dbStore.users.find(u => u.id === sec.instructorId)!;
      const enrollments = dbStore.enrollments.filter(e => e.sectionId === sec.id);
      
      const enrolledStudents = enrollments.map(enr => {
        const student = dbStore.users.find(u => u.id === enr.studentId)!;
        const log = dbStore.attendanceLogs.find(l => l.lectureId === lecture.id && l.studentId === student.id);
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
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
}

