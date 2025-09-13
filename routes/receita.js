import express from 'express';
import { authenticateToken } from '../midalwares/authMiddleware.js';
import { 
  getSaldoAtual, 
  getUltimasTransacoes, 
  adicionarReceita
} from '../controllers/receita.js';

const router = express.Router();

// Aplicar middleware de autenticação
router.use(authenticateToken);

// Rotas para receitas
router.get('/adicionarRefeita', getSaldoAtual);
router.get('/adicionarRefeita/ultimas', getUltimasTransacoes);
router.post('/adicionarRefeita', adicionarReceita);

export default router;
