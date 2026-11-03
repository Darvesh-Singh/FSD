import { Router } from 'express';
import { AcademicController } from '../controllers/academicController.js';

const router = Router();

router.get('/departments', AcademicController.getDepartments);
router.get('/courses', AcademicController.getCourses);
router.get('/sections', AcademicController.getSections);
router.get('/users', AcademicController.getUsers);
router.get('/lectures', AcademicController.getLectures);

export default router;

