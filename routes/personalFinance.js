import express from 'express';
import { authenticateToken } from '../midalwares/authMiddleware.js';
import {
  // Categorias
  createExpenseCategory,
  getExpenseCategories,
  updateExpenseCategory,
  deleteExpenseCategory,
  
  // Despesas
  createPersonalExpense,
  getPersonalExpenses,
  updatePersonalExpense,
  deletePersonalExpense,
  
  // Receitas
  createPersonalIncome,
  getPersonalIncomes,
  updatePersonalIncome,
  deletePersonalIncome,
  
  // Orçamentos
  getPersonalBudget,
  
  // Relatórios
  getExpenseAnalytics
} from '../controllers/personalFinance.js';

const router = express.Router();

// Aplicar middleware de autenticação em todas as rotas
router.use(authenticateToken);

// ===== ROTAS DE CATEGORIAS =====
router.post('/categories', createExpenseCategory);
router.get('/categories', getExpenseCategories);
router.put('/categories/:id', updateExpenseCategory);
router.delete('/categories/:id', deleteExpenseCategory);

// ===== ROTAS DE DESPESAS =====
router.post('/expenses', createPersonalExpense);
router.get('/expenses', getPersonalExpenses);
router.put('/expenses/:id', updatePersonalExpense);
router.delete('/expenses/:id', deletePersonalExpense);

// ===== ROTAS DE RECEITAS =====
router.post('/incomes', createPersonalIncome);
router.get('/incomes', getPersonalIncomes);
router.put('/incomes/:id', updatePersonalIncome);
router.delete('/incomes/:id', deletePersonalIncome);

// ===== ROTAS DE ORÇAMENTOS =====
router.get('/budget', getPersonalBudget);

// ===== ROTAS DE RELATÓRIOS =====
router.get('/analytics', getExpenseAnalytics);

export default router;
