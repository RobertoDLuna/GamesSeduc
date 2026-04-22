import { Router } from 'express';
import { SchoolController } from '../controllers/SchoolController';
import { authMiddleware } from '../middlewares/auth';

const router = Router();

router.use(authMiddleware);

router.post('/', SchoolController.create);
router.get('/', SchoolController.getAll);
router.get('/:id', SchoolController.getById);
router.patch('/:id', SchoolController.update);
router.delete('/:id', SchoolController.delete);

export default router;
