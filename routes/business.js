import express from 'express';
import { authenticateToken } from '../midalwares/authMiddleware.js';
import {
  // Negócios
  createBusiness,
  getBusinesses,
  getBusinessById,
  updateBusiness,
  deleteBusiness,
  
  // Materiais
  createBusinessMaterial,
  getBusinessMaterials,
  updateBusinessMaterial,
  deleteBusinessMaterial,
  
  // Serviços
  createBusinessService,
  getBusinessServices,
  updateBusinessService,
  deleteBusinessService,
  
  // Clientes
  createBusinessClient,
  getBusinessClients,
  updateBusinessClient,
  
  // Receitas
  createBusinessIncome,
  getBusinessIncomes,
  updateBusinessIncome,
  
  // Despesas
  createBusinessExpense,
  getBusinessExpenses,
  updateBusinessExpense,
  
  // Relatórios
  getBusinessAnalytics,
  
  // Pagamentos
  createBusinessPayment,
  getBusinessPayments,
  updateBusinessPayment,
  markPaymentAsPaid,
  deleteBusinessPayment
} from '../controllers/business.js';

const router = express.Router();

// Aplicar middleware de autenticação em todas as rotas
router.use(authenticateToken);

// ===== ROTAS DE NEGÓCIOS =====
router.post('/businesses', createBusiness);
router.get('/businesses', getBusinesses);
router.get('/businesses/:id', getBusinessById);
router.put('/businesses/:id', updateBusiness);
router.delete('/businesses/:id', deleteBusiness);

// ===== ROTAS DE MATERIAIS =====
router.post('/businesses/:businessId/materials', createBusinessMaterial);
router.get('/businesses/:businessId/materials', getBusinessMaterials);
router.put('/materials/:id', updateBusinessMaterial);
router.delete('/materials/:id', deleteBusinessMaterial);

// ===== ROTAS DE SERVIÇOS =====
router.post('/businesses/:businessId/services', createBusinessService);
router.get('/businesses/:businessId/services', getBusinessServices);
router.put('/services/:id', updateBusinessService);
router.delete('/services/:id', deleteBusinessService);

// ===== ROTAS DE CLIENTES =====
router.post('/businesses/:businessId/clients', createBusinessClient);
router.get('/businesses/:businessId/clients', getBusinessClients);
router.put('/clients/:id', updateBusinessClient);

// ===== ROTAS DE RECEITAS =====
router.post('/businesses/:businessId/incomes', createBusinessIncome);
router.get('/businesses/:businessId/incomes', getBusinessIncomes);
router.put('/incomes/:id', updateBusinessIncome);

// ===== ROTAS DE DESPESAS =====
router.post('/businesses/:businessId/expenses', createBusinessExpense);
router.get('/businesses/:businessId/expenses', getBusinessExpenses);
router.put('/expenses/:id', updateBusinessExpense);

// ===== ROTAS DE RELATÓRIOS =====
router.get('/businesses/:businessId/analytics', getBusinessAnalytics);

// ===== ROTAS DE PAGAMENTOS =====
router.post('/businesses/:businessId/payments', createBusinessPayment);
router.get('/businesses/:businessId/payments', getBusinessPayments);
router.put('/payments/:id', updateBusinessPayment);
router.put('/payments/:id/mark-paid', markPaymentAsPaid);
router.delete('/payments/:id', deleteBusinessPayment);

export default router;
