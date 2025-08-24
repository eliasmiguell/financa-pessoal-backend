import express from 'express';
import { authenticateToken } from '../midalwares/authMiddleware.js';
import { getGraphicData } from '../controllers/graphic.js';

const router = express.Router();

// Aplicar middleware de autenticação
router.use(authenticateToken);

// Rota para dados dos gráficos
router.get('/graphic', getGraphicData);

export default router;
