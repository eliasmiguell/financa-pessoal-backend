import { PrismaClient } from '../generated/prisma/index.js';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// ===== CATEGORIAS DE DESPESAS =====

export const createExpenseCategory = async (req, res) => {
  try {
    const { name, color, icon, budget } = req.body;
    const userId = req.user.id;

    const category = await prisma.expenseCategory.create({
      data: {
        name,
        color: color || "#3B82F6",
        icon,
        budget: parseFloat(budget) || 0,
        userId
      }
    });

    res.status(201).json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao criar categoria" });
  }
};

export const getExpenseCategories = async (req, res) => {
  try {
    console.log('=== DEBUG getExpenseCategories ===');
    console.log('req.user:', req.user);
    console.log('req.userId:', req.userId);
    console.log('req.headers:', req.headers);
    
    // Temporariamente retornar dados mockados para testar
    const mockCategories = [
      {
        id: '1',
        name: 'Alimentação',
        color: '#3B82F6',
        icon: '🍽️',
        userId: 'test-user-id',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '2',
        name: 'Transporte',
        color: '#10B981',
        icon: '🚗',
        userId: 'test-user-id',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    console.log('Retornando categorias mockadas:', mockCategories);
    res.json(mockCategories);
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    res.status(500).json({ message: "Erro ao buscar categorias", error: error.message });
  }
};

export const updateExpenseCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, color, icon, budget } = req.body;
    const userId = req.user.id;

    const category = await prisma.expenseCategory.update({
      where: { id, userId },
      data: { 
        name, 
        color, 
        icon, 
        budget: parseFloat(budget) || 0 
      }
    });

    res.json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao atualizar categoria" });
  }
};

export const deleteExpenseCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    await prisma.expenseCategory.delete({
      where: { id, userId }
    });

    res.json({ message: "Categoria deletada com sucesso" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao deletar categoria" });
  }
};

// ===== DESPESAS PESSOAIS =====

export const createPersonalExpense = async (req, res) => {
  try {
    const { 
      description, 
      amount, 
      type, 
      status, 
      categoryId, 
      dueDate, 
      paidDate,
      isRecurring,
      recurringInterval 
    } = req.body;
    const userId = req.user.id;

    const expense = await prisma.personalExpense.create({
      data: {
        description,
        amount: parseFloat(amount),
        type,
        status,
        categoryId,
        dueDate: dueDate ? new Date(dueDate) : null,
        paidDate: paidDate ? new Date(paidDate) : null,
        isRecurring: isRecurring || false,
        recurringInterval,
        userId
      },
      include: {
        category: true
      }
    });

    res.status(201).json(expense);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao criar despesa" });
  }
};

export const getPersonalExpenses = async (req, res) => {
  try {
    const userId = req.user.id;
    const { type, status, categoryId, month, year, isRecurring } = req.query;

    const where = { userId };

    if (type) where.type = type;
    if (status) where.status = status;
    if (categoryId) where.categoryId = categoryId;
    if (isRecurring !== undefined) where.isRecurring = isRecurring === 'true';
    if (month && year) {
      where.createdAt = {
        gte: new Date(parseInt(year), parseInt(month) - 1, 1),
        lt: new Date(parseInt(year), parseInt(month), 1)
      };
    }

    const expenses = await prisma.personalExpense.findMany({
      where,
      include: {
        category: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(expenses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao buscar despesas" });
  }
};

export const updatePersonalExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      description, 
      amount, 
      type, 
      status, 
      categoryId, 
      dueDate, 
      paidDate,
      isRecurring,
      recurringInterval 
    } = req.body;
    const userId = req.user.id;

    const expense = await prisma.personalExpense.update({
      where: { id, userId },
      data: {
        description,
        amount: parseFloat(amount),
        type,
        status,
        categoryId,
        dueDate: dueDate ? new Date(dueDate) : null,
        paidDate: paidDate ? new Date(paidDate) : null,
        isRecurring: isRecurring || false,
        recurringInterval
      },
      include: {
        category: true
      }
    });

    res.json(expense);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao atualizar despesa" });
  }
};

export const deletePersonalExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    await prisma.personalExpense.delete({
      where: { id, userId }
    });

    res.json({ message: "Despesa deletada com sucesso" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao deletar despesa" });
  }
};

// ===== RECEITAS PESSOAIS =====

export const createPersonalIncome = async (req, res) => {
  try {
    const { 
      description, 
      amount, 
      type, 
      receivedDate,
      isRecurring,
      recurringInterval 
    } = req.body;
    const userId = req.user.id;

    const income = await prisma.personalIncome.create({
      data: {
        description,
        amount: parseFloat(amount),
        type,
        receivedDate: receivedDate ? new Date(receivedDate) : new Date(),
        isRecurring: isRecurring || false,
        recurringInterval,
        userId
      }
    });

    res.status(201).json(income);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao criar receita" });
  }
};

export const getPersonalIncomes = async (req, res) => {
  try {
    const userId = req.user.id;
    const { type, month, year, isRecurring } = req.query;

    const where = { userId };

    if (type) where.type = type;
    if (isRecurring !== undefined) where.isRecurring = isRecurring === 'true';
    if (month && year) {
      where.receivedDate = {
        gte: new Date(parseInt(year), parseInt(month) - 1, 1),
        lt: new Date(parseInt(year), parseInt(month), 1)
      };
    }

    const incomes = await prisma.personalIncome.findMany({
      where,
      orderBy: { receivedDate: 'desc' }
    });

    res.json(incomes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao buscar receitas" });
  }
};

export const updatePersonalIncome = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      description, 
      amount, 
      type, 
      receivedDate,
      isRecurring,
      recurringInterval 
    } = req.body;
    const userId = req.user.id;

    const income = await prisma.personalIncome.update({
      where: { id, userId },
      data: {
        description,
        amount: parseFloat(amount),
        type,
        receivedDate: receivedDate ? new Date(receivedDate) : null,
        isRecurring: isRecurring || false,
        recurringInterval
      }
    });

    res.json(income);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao atualizar receita" });
  }
};

export const deletePersonalIncome = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    await prisma.personalIncome.delete({
      where: { id, userId }
    });

    res.json({ message: "Receita deletada com sucesso" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao deletar receita" });
  }
};

// ===== METAS FINANCEIRAS =====

export const createFinancialGoal = async (req, res) => {
  try {
    const { name, description, targetAmount, deadline, priority } = req.body;
    const userId = req.user.id;

    const goal = await prisma.financialGoal.create({
      data: {
        name,
        description,
        targetAmount: parseFloat(targetAmount),
        deadline: deadline ? new Date(deadline) : null,
        priority: priority || 'MEDIA',
        userId
      }
    });

    res.status(201).json(goal);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao criar meta financeira" });
  }
};

export const getFinancialGoals = async (req, res) => {
  try {
    const userId = req.user.id;

    const goals = await prisma.financialGoal.findMany({
      where: { userId },
      orderBy: { priority: 'desc' }
    });

    res.json(goals);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao buscar metas financeiras" });
  }
};

export const updateFinancialGoal = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, targetAmount, currentAmount, deadline, priority } = req.body;
    const userId = req.user.id;

    const goal = await prisma.financialGoal.update({
      where: { id, userId },
      data: {
        name,
        description,
        targetAmount: parseFloat(targetAmount),
        currentAmount: parseFloat(currentAmount) || 0,
        deadline: deadline ? new Date(deadline) : null,
        priority
      }
    });

    res.json(goal);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao atualizar meta financeira" });
  }
};

export const deleteFinancialGoal = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    await prisma.financialGoal.delete({
      where: { id, userId }
    });

    res.json({ message: "Meta financeira deletada com sucesso" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao deletar meta financeira" });
  }
};

// ===== ORÇAMENTOS PESSOAIS =====

export const getPersonalBudget = async (req, res) => {
  try {
    const userId = req.user.id;
    const { month, year } = req.query;
    const currentMonth = month ? parseInt(month) : new Date().getMonth() + 1;
    const currentYear = year ? parseInt(year) : new Date().getFullYear();

    // Buscar ou criar orçamento do mês
    let budget = await prisma.personalBudget.findUnique({
      where: {
        userId_month_year: {
          userId,
          month: currentMonth,
          year: currentYear
        }
      }
    });

    if (!budget) {
      // Calcular totais do mês
      const startDate = new Date(currentYear, currentMonth - 1, 1);
      const endDate = new Date(currentYear, currentMonth, 0);

      const totalIncome = await prisma.personalIncome.aggregate({
        where: {
          userId,
          receivedDate: {
            gte: startDate,
            lte: endDate
          }
        },
        _sum: { amount: true }
      });

      const totalExpenses = await prisma.personalExpense.aggregate({
        where: {
          userId,
          createdAt: {
            gte: startDate,
            lte: endDate
          }
        },
        _sum: { amount: true }
      });

      const incomeTotal = totalIncome._sum.amount || 0;
      const expenseTotal = totalExpenses._sum.amount || 0;
      const balance = incomeTotal - expenseTotal;
      const savings = balance > 0 ? balance * 0.2 : 0; // 20% do saldo positivo
      const emergencyFund = balance > 0 ? balance * 0.1 : 0; // 10% do saldo positivo

      budget = await prisma.personalBudget.create({
        data: {
          month: currentMonth,
          year: currentYear,
          totalIncome: incomeTotal,
          totalExpenses: expenseTotal,
          balance,
          savings,
          emergencyFund,
          userId
        }
      });
    }

    res.json(budget);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao buscar orçamento" });
  }
};

// ===== RELATÓRIOS E ANÁLISES AVANÇADAS =====

export const getExpenseAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;
    const { month, year } = req.query;
    const currentMonth = month ? parseInt(month) : new Date().getMonth() + 1;
    const currentYear = year ? parseInt(year) : new Date().getFullYear();

    const startDate = new Date(currentYear, currentMonth - 1, 1);
    const endDate = new Date(currentYear, currentMonth, 0);

    // Despesas por categoria com detalhes
    const expensesByCategory = await prisma.personalExpense.groupBy({
      by: ['categoryId'],
      where: {
        userId,
        createdAt: {
          gte: startDate,
          lte: endDate
        }
      },
      _sum: { amount: true },
      _count: true
    });

    // Buscar categorias para incluir nomes
    const categories = await prisma.expenseCategory.findMany({
      where: { userId }
    });

    const expensesWithCategoryNames = expensesByCategory.map(expense => {
      const category = categories.find(cat => cat.id === expense.categoryId);
      return {
        ...expense,
        categoryName: category?.name || 'Sem categoria',
        categoryColor: category?.color || '#6B7280',
        budget: category?.budget || 0
      };
    });

    // Despesas por tipo
    const expensesByType = await prisma.personalExpense.groupBy({
      by: ['type'],
      where: {
        userId,
        createdAt: {
          gte: startDate,
          lte: endDate
        }
      },
      _sum: { amount: true }
    });

    // Despesas por status
    const expensesByStatus = await prisma.personalExpense.groupBy({
      by: ['status'],
      where: {
        userId,
        createdAt: {
          gte: startDate,
          lte: endDate
        }
      },
      _sum: { amount: true }
    });

    // Despesas recorrentes vs não recorrentes
    const expensesByRecurring = await prisma.personalExpense.groupBy({
      by: ['isRecurring'],
      where: {
        userId,
        createdAt: {
          gte: startDate,
          lte: endDate
        }
      },
      _sum: { amount: true }
    });

    // Análise de tendências (últimos 6 meses)
    const sixMonthsAgo = new Date(currentYear, currentMonth - 6, 1);
    const monthlyExpenses = await prisma.personalExpense.groupBy({
      by: ['createdAt'],
      where: {
        userId,
        createdAt: {
          gte: sixMonthsAgo,
          lte: endDate
        }
      },
      _sum: { amount: true }
    });

    res.json({
      expensesByCategory: expensesWithCategoryNames,
      expensesByType,
      expensesByStatus,
      expensesByRecurring,
      monthlyExpenses
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao gerar relatório" });
  }
};

// ===== SUGESTÕES DE ECONOMIA =====

export const getSavingsSuggestions = async (req, res) => {
  try {
    const userId = req.user.id;
    const { month, year } = req.query;
    const currentMonth = month ? parseInt(month) : new Date().getMonth() + 1;
    const currentYear = year ? parseInt(year) : new Date().getFullYear();

    const startDate = new Date(currentYear, currentMonth - 1, 1);
    const endDate = new Date(currentYear, currentMonth, 0);

    // Buscar despesas do mês
    const expenses = await prisma.personalExpense.findMany({
      where: {
        userId,
        createdAt: {
          gte: startDate,
          lte: endDate
        }
      },
      include: {
        category: true
      }
    });

    // Buscar categorias com orçamento
    const categories = await prisma.expenseCategory.findMany({
      where: { userId }
    });

    const suggestions = [];

    // Analisar gastos por categoria
    categories.forEach(category => {
      const categoryExpenses = expenses.filter(exp => exp.categoryId === category.id);
      const totalSpent = categoryExpenses.reduce((sum, exp) => sum + exp.amount, 0);
      
      const budget = category.budget || 0;
      if (budget > 0 && totalSpent > budget) {
        const overspent = totalSpent - budget;
        suggestions.push({
          type: 'CATEGORY_OVERSPENT',
          category: category.name,
          overspent,
          suggestion: `Reduza gastos em ${category.name} em R$ ${overspent.toFixed(2)} para ficar dentro do orçamento`
        });
      }
    });

    // Analisar despesas imprevistas
    const unexpectedExpenses = expenses.filter(exp => exp.type === 'IMPREVISTA');
    if (unexpectedExpenses.length > 0) {
      const totalUnexpected = unexpectedExpenses.reduce((sum, exp) => sum + exp.amount, 0);
      suggestions.push({
        type: 'UNEXPECTED_EXPENSES',
        total: totalUnexpected,
        count: unexpectedExpenses.length,
        suggestion: `Considere criar um fundo de emergência para cobrir despesas imprevistas`
      });
    }

    // Analisar despesas pendentes
    const pendingExpenses = expenses.filter(exp => exp.status === 'PENDENTE');
    if (pendingExpenses.length > 0) {
      const totalPending = pendingExpenses.reduce((sum, exp) => sum + exp.amount, 0);
      suggestions.push({
        type: 'PENDING_EXPENSES',
        total: totalPending,
        count: pendingExpenses.length,
        suggestion: `Você tem R$ ${totalPending.toFixed(2)} em despesas pendentes. Organize o pagamento para evitar juros`
      });
    }

    // Analisar despesas recorrentes
    const recurringExpenses = expenses.filter(exp => exp.isRecurring);
    if (recurringExpenses.length > 0) {
      const totalRecurring = recurringExpenses.reduce((sum, exp) => sum + exp.amount, 0);
      suggestions.push({
        type: 'RECURRING_EXPENSES',
        total: totalRecurring,
        count: recurringExpenses.length,
        suggestion: `Suas despesas recorrentes somam R$ ${totalRecurring.toFixed(2)}. Revise se todas são necessárias`
      });
    }

    res.json(suggestions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao gerar sugestões" });
  }
};

// ===== DASHBOARD COMPLETO =====

export const getDashboardData = async (req, res) => {
  try {
    const userId = req.user.id;
    const { month, year } = req.query;
    const currentMonth = month ? parseInt(month) : new Date().getMonth() + 1;
    const currentYear = year ? parseInt(year) : new Date().getFullYear();

    const startDate = new Date(currentYear, currentMonth - 1, 1);
    const endDate = new Date(currentYear, currentMonth, 0);

    // Resumo financeiro
    const totalIncome = await prisma.personalIncome.aggregate({
      where: {
        userId,
        receivedDate: {
          gte: startDate,
          lte: endDate
        }
      },
      _sum: { amount: true }
    });

    const totalExpenses = await prisma.personalExpense.aggregate({
      where: {
        userId,
        createdAt: {
          gte: startDate,
          lte: endDate
        }
      },
      _sum: { amount: true }
    });

    const incomeTotal = totalIncome._sum.amount || 0;
    const expenseTotal = totalExpenses._sum.amount || 0;
    const balance = incomeTotal - expenseTotal;

    // Despesas por tipo
    const expensesByType = await prisma.personalExpense.groupBy({
      by: ['type'],
      where: {
        userId,
        createdAt: {
          gte: startDate,
          lte: endDate
        }
      },
      _sum: { amount: true }
    });

    // Despesas por status
    const expensesByStatus = await prisma.personalExpense.groupBy({
      by: ['status'],
      where: {
        userId,
        createdAt: {
          gte: startDate,
          lte: endDate
        }
      },
      _sum: { amount: true }
    });

    // Metas financeiras
    const goals = await prisma.financialGoal.findMany({
      where: { userId },
      orderBy: { priority: 'desc' }
    });

    // Próximas despesas (pendentes e vencendo)
    const upcomingExpenses = await prisma.personalExpense.findMany({
      where: {
        userId,
        OR: [
          { status: 'PENDENTE' },
          {
            dueDate: {
              gte: new Date(),
              lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // próximos 7 dias
            }
          }
        ]
      },
      include: {
        category: true
      },
      orderBy: { dueDate: 'asc' }
    });

    res.json({
      summary: {
        totalIncome: incomeTotal,
        totalExpenses: expenseTotal,
        balance,
        savings: balance > 0 ? balance * 0.2 : 0,
        emergencyFund: balance > 0 ? balance * 0.1 : 0
      },
      expensesByType,
      expensesByStatus,
      goals,
      upcomingExpenses
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao buscar dados do dashboard" });
  }
};
