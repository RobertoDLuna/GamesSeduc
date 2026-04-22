import { Router } from 'express';
import { DashboardController } from '../controllers/DashboardController';
import { authMiddleware } from '../middlewares/auth';

const router = Router();

router.get('/stats', authMiddleware, DashboardController.getStats);

export default router;
