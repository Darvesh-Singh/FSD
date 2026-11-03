import { Request, Response } from 'express';
import { dbStore } from '../db/store.js';

export class ReportsController {
  // Course-wide Summaries
  public static getCourseSummaries(req: Request, res: Response) {
    try {
      const { departmentId, semester } = req.query;
      const summaries = dbStore.getCourseSummaries({
        departmentId: departmentId as string,
        semester: semester as string
      });

      res.json({
        success: true,
        data: summaries
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  // At-Risk Students Report
  public static getAtRiskStudents(req: Request, res: Response) {
    try {
      const { departmentId, courseId, threshold } = req.query;
      const minThreshold = threshold ? Number(threshold) : 75.0;

      const atRiskStudents = dbStore.getAtRiskStudentsReport({
        departmentId: departmentId as string,
        courseId: courseId as string,
        minThreshold
      });

      res.json({
        success: true,
        data: atRiskStudents
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  // Generate / Issue Academic Warning Letter
  public static issueWarningLetter(req: Request, res: Response) {
    try {
      const { studentId, courseId } = req.body;
      if (!studentId || !courseId) {
        return res.status(400).json({ success: false, error: 'studentId and courseId are required' });
      }

      const letter = dbStore.issueWarningLetter(studentId, courseId);
      res.json({
        success: true,
        message: 'Academic Warning Letter generated and issued.',
        data: letter
      });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  }

  // Get Warning Letter details
  public static getWarningLetter(req: Request, res: Response) {
    try {
      const { letterId } = req.params;
      const letter = dbStore.warningLetters.find(l => l.id === letterId);
      if (!letter) {
        return res.status(404).json({ success: false, error: 'Warning letter not found' });
      }

      const student = dbStore.users.find(u => u.id === letter.studentId);
      const course = dbStore.courses.find(c => c.id === letter.courseId);

      res.json({
        success: true,
        data: {
          ...letter,
          student,
          course
        }
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }

  // Individual Student Drill-Down
  public static getStudentDrillDown(req: Request, res: Response) {
    try {
      const { studentId } = req.params;
      const drillDown = dbStore.getStudentDrillDown(studentId);
      if (!drillDown) {
        return res.status(404).json({ success: false, error: 'Student not found' });
      }

      res.json({
        success: true,
        data: drillDown
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  }
}

