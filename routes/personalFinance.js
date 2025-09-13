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
  getPersonalExpensesById,
  deletePersonalExpense,
  
  // Receitas
  createPersonalIncome,
  getPersonalIncomes,
  getPersonalIncomesById,
  updatePersonalIncome,
  deletePersonalIncome,
  
  // Metas Financeiras
  createFinancialGoal,
  getFinancialGoals,
  updateFinancialGoal,
  deleteFinancialGoal,
  
  // Orçamentos
  getPersonalBudget,
  
  // Relatórios
  getExpenseAnalytics
} from '../controllers/personalFinance.js';

const router = express.Router();

// Rota de teste sem middleware (deve vir ANTES do middleware)
router.get('/test', (req, res) => {
  res.json({ message: 'Teste funcionando!' });
});

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
router.get('/expenses/:id', getPersonalExpensesById);

// ===== ROTAS DE RECEITAS =====
router.post('/incomes', createPersonalIncome);
router.get('/incomes', getPersonalIncomes);
router.get('/incomes/:id', getPersonalIncomesById);
router.put('/incomes/:id', updatePersonalIncome);
router.delete('/incomes/:id', deletePersonalIncome);

// ===== ROTAS DE METAS FINANCEIRAS =====
router.post('/goals', createFinancialGoal);
router.get('/goals', getFinancialGoals);
router.put('/goals/:id', updateFinancialGoal);
router.delete('/goals/:id', deleteFinancialGoal);

// ===== ROTAS DE ORÇAMENTOS =====
router.get('/budget', getPersonalBudget);

// ===== ROTAS DE RELATÓRIOS =====
router.get('/analytics', getExpenseAnalytics);

export default router;
