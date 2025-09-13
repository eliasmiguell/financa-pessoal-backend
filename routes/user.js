import express from 'express';
import { authenticateToken } from '../midalwares/authMiddleware.js';
import { 
  getUserProfile, 
  updateUserProfile, 
  changePassword, 
  getUserStats 
} from '../controllers/user.js';

const router = express.Router();

// Aplicar middleware de autenticação
router.use(authenticateToken);

// Rotas para usuário
router.get('/profile', getUserProfile);
router.put('/profile', updateUserProfile);
router.put('/change-password', changePassword);
router.get('/stats', getUserStats);

export default router;