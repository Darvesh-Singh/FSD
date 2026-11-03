import { Router } from 'express';
import { DashboardController } from '../controllers/dashboardController.js';

const router = Router();

router.get('/kpis', DashboardController.getDashboard);
router.get('/lecture/:lectureId', DashboardController.getLiveLecture);

export default router;

