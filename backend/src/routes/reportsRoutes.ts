import { Router } from 'express';
import { ReportsController } from '../controllers/reportsController.js';

const router = Router();

router.get('/course-summaries', ReportsController.getCourseSummaries);
router.get('/at-risk-students', ReportsController.getAtRiskStudents);
router.post('/warning-letter', ReportsController.issueWarningLetter);
router.get('/warning-letter/:letterId', ReportsController.getWarningLetter);
router.get('/student-drilldown/:studentId', ReportsController.getStudentDrillDown);

export default router;

