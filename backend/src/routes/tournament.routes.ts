import { Router } from 'express';
import { TournamentController } from '../controllers/TournamentController';
import { authMiddleware } from '../middlewares/auth';

const router = Router();

router.use(authMiddleware);

router.post('/', TournamentController.create);
router.get('/', TournamentController.getAll);
router.get('/:id', TournamentController.getById);

// Rotas específicas do "Motor" de Torneios
router.post('/:id/rounds/generate', TournamentController.generateRound);
router.patch('/matches/:matchId/result', TournamentController.updateMatchResult);

export default router;
