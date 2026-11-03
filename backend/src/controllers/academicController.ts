import { Request, Response } from 'express';
import { dbStore } from '../db/store.js';

export class AcademicController {
  public static getDepartments(req: Request, res: Response) {
    res.json({ success: true, data: dbStore.departments });
  }

  public static getCourses(req: Request, res: Response) {
    const { departmentId } = req.query;
    let list = dbStore.courses;
    if (departmentId && departmentId !== 'ALL') {
      list = list.filter(c => c.departmentId === departmentId);
    }
    res.json({ success: true, data: list });
  }

  public static getSections(req: Request, res: Response) {
    const { courseId } = req.query;
    let list = dbStore.sections;
    if (courseId && courseId !== 'ALL') {
      list = list.filter(s => s.courseId === courseId);
    }
    res.json({ success: true, data: list });
  }

  public static getUsers(req: Request, res: Response) {
    const { role } = req.query;
    let list = dbStore.users;
    if (role) {
      list = list.filter(u => u.role === role);
    }
    res.json({ success: true, data: list });
  }

  public static getLectures(req: Request, res: Response) {
    const { status, date } = req.query;
    let list = dbStore.lectures;
    if (status) {
      list = list.filter(l => l.status === status);
    }
    if (date) {
      list = list.filter(l => l.date === date);
    }
    res.json({ success: true, data: list });
  }
}

