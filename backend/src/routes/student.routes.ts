import { Router } from 'express';
import multer from 'multer';
import { StudentController } from '../controllers/StudentController';
import { authMiddleware } from '../middlewares/auth';
import fs from 'fs';
import path from 'path';

const router = Router();

// Garantir que a pasta uploads existe
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuração do multer para upload de CSV
const upload = multer({ dest: 'uploads/' });

router.use(authMiddleware);

router.post('/', StudentController.create);
router.get('/', StudentController.getAll);
router.post('/import', upload.single('file'), StudentController.importCSV);

export default router;
