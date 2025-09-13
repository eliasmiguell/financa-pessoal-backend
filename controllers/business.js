import { prisma } from '../connect.js';


export const createBusiness = async (req, res) => {
  try {
    const { name, description, type } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Usuário não autenticado" });
    }

    const business = await prisma.business.create({
      data: {
        name,
        description,
        type: type || 'OUTRO',
        userId
      }
    });

    res.status(201).json(business);
  } catch (error) {
    console.error('Erro ao criar negócio:', error);
    res.status(500).json({ message: "Erro ao criar negócio" });
  }
};

export const getBusinesses = async (req, res) => {
  try {
    const userId = req.user.id;

    const businesses = await prisma.business.findMany({
      where: { userId },
      include: {
        materials: true,
        services: true,
        expenses: true,
        incomes: true,
        clients: true
      }
    });

    res.json(businesses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao buscar negócios" });
  }
};

export const getBusinessById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const business = await prisma.business.findFirst({
      where: { id, userId },
      include: {
        materials: true,
        services: true,
        expenses: true,
        incomes: true,
        clients: true
      }
    });

    if (!business) {
      return res.status(404).json({ message: "Negócio não encontrado" });
    }

    res.json(business);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao buscar negócio" });
  }
};

export const updateBusiness = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const userId = req.user.id;

    const business = await prisma.business.update({
      where: { id, userId },
      data: { name, description }
    });

    res.json(business);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao atualizar negócio" });
  }
};

export const deleteBusiness = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    await prisma.business.delete({
      where: { id, userId }
    });

    res.json({ message: "Negócio deletado com sucesso" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao deletar negócio" });
  }
};

// ===== MATERIAIS DO NEGÓCIO =====

export const createBusinessMaterial = async (req, res) => {
  try {
    const { name, description, cost, quantity, unit, usagePerClient } = req.body;
    const { businessId } = req.params;
    const userId = req.user.id;

    // Verificar se o negócio pertence ao usuário
    const business = await prisma.business.findFirst({
      where: { id: businessId, userId }
    });

    if (!business) {
      return res.status(404).json({ message: "Negócio não encontrado" });
    }

    const material = await prisma.businessMaterial.create({
      data: {
        name,
        description,
        cost: parseFloat(cost),
        quantity: parseFloat(quantity),
        unit,
        usagePerClient: usagePerClient ? parseFloat(usagePerClient) : null,
        businessId
      }
    });

    res.status(201).json(material);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao criar material" });
  }
};

export const getBusinessMaterials = async (req, res) => {
  try {
    const { businessId } = req.params;
    const userId = req.user.id;

    // Verificar se o negócio pertence ao usuário
    const business = await prisma.business.findFirst({
      where: { id: businessId, userId }
    });

    if (!business) {
      return res.status(404).json({ message: "Negócio não encontrado" });
    }

    const materials = await prisma.businessMaterial.findMany({
      where: { businessId },
      orderBy: { name: 'asc' }
    });

    res.json(materials);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao buscar materiais" });
  }
};

export const updateBusinessMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, cost, quantity, unit, usagePerClient } = req.body;
    const userId = req.user.id;

    // Verificar se o material pertence a um negócio do usuário
    const material = await prisma.businessMaterial.findFirst({
      where: { id },
      include: { business: true }
    });

    if (!material || material.business.userId !== userId) {
      return res.status(404).json({ message: "Material não encontrado" });
    }

    const updatedMaterial = await prisma.businessMaterial.update({
      where: { id },
      data: {
        name,
        description,
        cost: parseFloat(cost),
        quantity: parseFloat(quantity),
        unit,
        usagePerClient: usagePerClient ? parseFloat(usagePerClient) : null
      }
    });

    res.json(updatedMaterial);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao atualizar material" });
  }
};

export const deleteBusinessMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Verificar se o material pertence a um negócio do usuário
    const material = await prisma.businessMaterial.findFirst({
      where: { id },
      include: { business: true }
    });

    if (!material || material.business.userId !== userId) {
      return res.status(404).json({ message: "Material não encontrado" });
    }

    await prisma.businessMaterial.delete({
      where: { id }
    });

    res.json({ message: "Material deletado com sucesso" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao deletar material" });
  }
};

// ===== SERVIÇOS DO NEGÓCIO =====

export const createBusinessService = async (req, res) => {
  try {
    const { 
      name, 
      description, 
      price, 
      materials, 
      laborCost, 
      laborHours,
      foodCost, 
      transportCost,
      materialCost
    } = req.body;
    const { businessId } = req.params;
    const userId = req.user.id;

    console.log('Dados recebidos para criar serviço:', req.body);

    // Verificar se o negócio pertence ao usuário
    const business = await prisma.business.findFirst({
      where: { id: businessId, userId }
    });

    if (!business) {
      return res.status(404).json({ message: "Negócio não encontrado" });
    }

    // Calcular custo total dos materiais
    let materialsCost = 0;
    if (materials) {
      try {
        const materialsArray = typeof materials === 'string' ? JSON.parse(materials) : materials;
        if (Array.isArray(materialsArray)) {
          for (const material of materialsArray) {
            if (material.materialId) {
              const materialData = await prisma.businessMaterial.findUnique({
                where: { id: material.materialId }
              });
              if (materialData) {
                materialsCost += (materialData.cost * material.quantity);
              }
            }
          }
        }
      } catch (e) {
        console.error('Erro ao processar materiais:', e);
        materialsCost = materialCost || 0;
      }
    }

    const totalCost = materialsCost + parseFloat(laborCost) + parseFloat(foodCost || 0) + parseFloat(transportCost || 0);
    const profit = parseFloat(price) - totalCost;
    const profitMargin = totalCost > 0 ? (profit / parseFloat(price)) * 100 : 0;

    const service = await prisma.businessService.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        materials: materials || '[]',
        laborCost: parseFloat(laborCost),
        laborHours: parseFloat(laborHours || 1),
        foodCost: parseFloat(foodCost || 0),
        transportCost: parseFloat(transportCost || 0),
        materialCost: materialsCost,
        totalCost,
        profit,
        profitMargin,
        businessId
      }
    });

    res.status(201).json(service);
  } catch (error) {
    console.error('Erro ao criar serviço:', error);
    res.status(500).json({ message: "Erro ao criar serviço" });
  }
};

export const getBusinessServices = async (req, res) => {
  try {
    const { businessId } = req.params;
    const userId = req.user.id;

    // Verificar se o negócio pertence ao usuário
    const business = await prisma.business.findFirst({
      where: { id: businessId, userId }
    });

    if (!business) {
      return res.status(404).json({ message: "Negócio não encontrado" });
    }

    const services = await prisma.businessService.findMany({
      where: { businessId },
      orderBy: { name: 'asc' }
    });

    res.json(services);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao buscar serviços" });
  }
};

export const updateBusinessService = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      name, 
      description, 
      price, 
      materials, 
      laborCost, 
      foodCost, 
      transportCost 
    } = req.body;
    const userId = req.user.id;

    // Verificar se o serviço pertence a um negócio do usuário
    const service = await prisma.businessService.findFirst({
      where: { id },
      include: { business: true }
    });

    if (!service || service.business.userId !== userId) {
      return res.status(404).json({ message: "Serviço não encontrado" });
    }

    // Calcular custo total dos materiais
    let materialsCost = 0;
    if (materials && Array.isArray(materials)) {
      for (const material of materials) {
        const materialData = await prisma.businessMaterial.findUnique({
          where: { id: material.materialId }
        });
        if (materialData) {
          materialsCost += (materialData.cost * material.quantity);
        }
      }
    }

    const totalCost = materialsCost + parseFloat(laborCost) + parseFloat(foodCost || 0) + parseFloat(transportCost || 0);
    const profit = parseFloat(price) - totalCost;

    const updatedService = await prisma.businessService.update({
      where: { id },
      data: {
        name,
        description,
        price: parseFloat(price),
        materials: materials || [],
        laborCost: parseFloat(laborCost),
        foodCost: parseFloat(foodCost || 0),
        transportCost: parseFloat(transportCost || 0),
        totalCost,
        profit
      }
    });

    res.json(updatedService);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao atualizar serviço" });
  }
};

export const deleteBusinessService = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Verificar se o serviço pertence a um negócio do usuário
    const service = await prisma.businessService.findFirst({
      where: { id },
      include: { business: true }
    });

    if (!service || service.business.userId !== userId) {
      return res.status(404).json({ message: "Serviço não encontrado" });
    }

    await prisma.businessService.delete({
      where: { id }
    });

    res.json({ message: "Serviço deletado com sucesso" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao deletar serviço" });
  }
};

// ===== CLIENTES DO NEGÓCIO =====

export const createBusinessClient = async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    const { businessId } = req.params;
    const userId = req.user.id;

    // Verificar se o negócio pertence ao usuário
    const business = await prisma.business.findFirst({
      where: { id: businessId, userId }
    });

    if (!business) {
      return res.status(404).json({ message: "Negócio não encontrado" });
    }

    const client = await prisma.businessClient.create({
      data: {
        name,
        email,
        phone,
        businessId
      }
    });

    res.status(201).json(client);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao criar cliente" });
  }
};

export const getBusinessClients = async (req, res) => {
  try {
    const { businessId } = req.params;
    const userId = req.user.id;

    // Verificar se o negócio pertence ao usuário
    const business = await prisma.business.findFirst({
      where: { id: businessId, userId }
    });

    if (!business) {
      return res.status(404).json({ message: "Negócio não encontrado" });
    }

    const clients = await prisma.businessClient.findMany({
      where: { businessId },
      include: {
        incomes: true
      },
      orderBy: { name: 'asc' }
    });

    res.json(clients);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao buscar clientes" });
  }
};

export const updateBusinessClient = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, address, notes } = req.body;
    const userId = req.user.id;

    // Verificar se o cliente pertence ao usuário
    const client = await prisma.businessClient.findFirst({
      where: { 
        id,
        business: { userId }
      }
    });

    if (!client) {
      return res.status(404).json({ message: "Cliente não encontrado" });
    }

    const updatedClient = await prisma.businessClient.update({
      where: { id },
      data: {
        name,
        email,
        phone,
        address,
        notes
      }
    });

    res.json(updatedClient);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao atualizar cliente" });
  }
};

// ===== RECEITAS DO NEGÓCIO =====

export const createBusinessIncome = async (req, res) => {
  try {
    const { description, amount, serviceId, clientId, date } = req.body;
    const { businessId } = req.params;
    const userId = req.user.id;

    // Verificar se o negócio pertence ao usuário
    const business = await prisma.business.findFirst({
      where: { id: businessId, userId }
    });

    if (!business) {
      return res.status(404).json({ message: "Negócio não encontrado" });
    }

    const income = await prisma.businessIncome.create({
      data: {
        description,
        amount: parseFloat(amount),
        serviceId,
        businessId,
        clientId,
        date: date ? new Date(date) : new Date()
      },
      include: {
        service: true,
        client: true
      }
    });

    res.status(201).json(income);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao criar receita" });
  }
};

export const getBusinessIncomes = async (req, res) => {
  try {
    const { businessId } = req.params;
    const { month, year, clientId } = req.query;
    const userId = req.user.id;

    // Verificar se o negócio pertence ao usuário
    const business = await prisma.business.findFirst({
      where: { id: businessId, userId }
    });

    if (!business) {
      return res.status(404).json({ message: "Negócio não encontrado" });
    }

    const where = { businessId };

    if (clientId) where.clientId = clientId;
    if (month && year) {
      where.date = {
        gte: new Date(parseInt(year), parseInt(month) - 1, 1),
        lt: new Date(parseInt(year), parseInt(month), 1)
      };
    }

    const incomes = await prisma.businessIncome.findMany({
      where,
      include: {
        service: true,
        client: true
      },
      orderBy: { date: 'desc' }
    });

    res.json(incomes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao buscar receitas" });
  }
};

export const updateBusinessIncome = async (req, res) => {
  try {
    const { id } = req.params;
    const { description, amount, serviceId, clientId, date, paymentMethod } = req.body;
    const userId = req.user.id;

    // Verificar se a receita pertence ao usuário
    const income = await prisma.businessIncome.findFirst({
      where: { 
        id,
        business: { userId }
      }
    });

    if (!income) {
      return res.status(404).json({ message: "Receita não encontrada" });
    }

    const updatedIncome = await prisma.businessIncome.update({
      where: { id },
      data: {
        description,
        amount: parseFloat(amount),
        serviceId,
        clientId,
        date: date ? new Date(date) : new Date(),
        paymentMethod
      },
      include: {
        service: true,
        client: true
      }
    });

    res.json(updatedIncome);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao atualizar receita" });
  }
};

// ===== DESPESAS DO NEGÓCIO =====

export const createBusinessExpense = async (req, res) => {
  try {
    const { description, amount, type, date } = req.body;
    const { businessId } = req.params;
    const userId = req.user.id;

    // Verificar se o negócio pertence ao usuário
    const business = await prisma.business.findFirst({
      where: { id: businessId, userId }
    });

    if (!business) {
      return res.status(404).json({ message: "Negócio não encontrado" });
    }

    const expense = await prisma.businessExpense.create({
      data: {
        description,
        amount: parseFloat(amount),
        type,
        businessId,
        date: date ? new Date(date) : new Date()
      }
    });

    res.status(201).json(expense);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao criar despesa" });
  }
};

export const getBusinessExpenses = async (req, res) => {
  try {
    const { businessId } = req.params;
    const { type, month, year } = req.query;
    const userId = req.user.id;

    // Verificar se o negócio pertence ao usuário
    const business = await prisma.business.findFirst({
      where: { id: businessId, userId }
    });

    if (!business) {
      return res.status(404).json({ message: "Negócio não encontrado" });
    }

    const where = { businessId };

    if (type) where.type = type;
    if (month && year) {
      where.date = {
        gte: new Date(parseInt(year), parseInt(month) - 1, 1),
        lt: new Date(parseInt(year), parseInt(month), 1)
      };
    }

    const expenses = await prisma.businessExpense.findMany({
      where,
      orderBy: { date: 'desc' }
    });

    res.json(expenses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao buscar despesas" });
  }
};

export const updateBusinessExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const { description, amount, type, category, date, isRecurring, recurringInterval } = req.body;
    const userId = req.user.id;

    // Verificar se a despesa pertence ao usuário
    const expense = await prisma.businessExpense.findFirst({
      where: { 
        id,
        business: { userId }
      }
    });

    if (!expense) {
      return res.status(404).json({ message: "Despesa não encontrada" });
    }

    const updatedExpense = await prisma.businessExpense.update({
      where: { id },
      data: {
        description,
        amount: parseFloat(amount),
        type,
        category,
        date: date ? new Date(date) : new Date(),
        isRecurring: isRecurring || false,
        recurringInterval
      }
    });

    res.json(updatedExpense);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao atualizar despesa" });
  }
};

// ===== RELATÓRIOS DO NEGÓCIO =====

export const getBusinessAnalytics = async (req, res) => {
  try {
    const { businessId } = req.params;
    const { month, year } = req.query;
    const userId = req.user.id;

    // Verificar se o negócio pertence ao usuário
    const business = await prisma.business.findFirst({
      where: { id: businessId, userId }
    });

    if (!business) {
      return res.status(404).json({ message: "Negócio não encontrado" });
    }

    const currentMonth = month ? parseInt(month) : new Date().getMonth() + 1;
    const currentYear = year ? parseInt(year) : new Date().getFullYear();

    const startDate = new Date(currentYear, currentMonth - 1, 1);
    const endDate = new Date(currentYear, currentMonth, 0);

    // Receitas por serviço
    const incomesByService = await prisma.businessIncome.groupBy({
      by: ['serviceId'],
      where: {
        businessId,
        date: {
          gte: startDate,
          lte: endDate
        }
      },
      _sum: { amount: true },
      _count: true
    });

    // Despesas por tipo
    const expensesByType = await prisma.businessExpense.groupBy({
      by: ['type'],
      where: {
        businessId,
        date: {
          gte: startDate,
          lte: endDate
        }
      },
      _sum: { amount: true }
    });

    // Total de receitas e despesas
    const totalIncome = await prisma.businessIncome.aggregate({
      where: {
        businessId,
        date: {
          gte: startDate,
          lte: endDate
        }
      },
      _sum: { amount: true }
    });

    const totalExpenses = await prisma.businessExpense.aggregate({
      where: {
        businessId,
        date: {
          gte: startDate,
          lte: endDate
        }
      },
      _sum: { amount: true }
    });

    const incomeTotal = totalIncome._sum.amount || 0;
    const expenseTotal = totalExpenses._sum.amount || 0;
    const profit = incomeTotal - expenseTotal;

    res.json({
      incomesByService,
      expensesByType,
      totalIncome: incomeTotal,
      totalExpenses: expenseTotal,
      profit
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao gerar relatório" });
  }
};

// ===== PAGAMENTOS DE CLIENTES =====

export const createBusinessPayment = async (req, res) => {
  try {
    const { businessId } = req.params;
    const { 
      amount, 
      description, 
      clientId, 
      serviceId, 
      dueDate, 
      paymentMethod = 'DINHEIRO',
      notes 
    } = req.body;
    const userId = req.user.id;

    // Verificar se o negócio pertence ao usuário
    const business = await prisma.business.findFirst({
      where: { id: businessId, userId }
    });

    if (!business) {
      return res.status(404).json({ message: "Negócio não encontrado" });
    }

    // Verificar se o cliente pertence ao negócio
    if (clientId) {
      const client = await prisma.businessClient.findFirst({
        where: { id: clientId, businessId }
      });

      if (!client) {
        return res.status(404).json({ message: "Cliente não encontrado" });
      }
    }

    // Verificar se o serviço pertence ao negócio
    if (serviceId) {
      const service = await prisma.businessService.findFirst({
        where: { id: serviceId, businessId }
      });

      if (!service) {
        return res.status(404).json({ message: "Serviço não encontrado" });
      }
    }

    const payment = await prisma.businessPayment.create({
      data: {
        amount: parseFloat(amount),
        description,
        clientId,
        serviceId,
        dueDate: dueDate ? new Date(dueDate) : null,
        paymentMethod,
        notes,
        businessId
      },
      include: {
        client: true,
        service: true
      }
    });

    res.json(payment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao criar pagamento" });
  }
};

export const getBusinessPayments = async (req, res) => {
  try {
    const { businessId } = req.params;
    const { status, clientId, serviceId } = req.query;
    const userId = req.user.id;

    // Verificar se o negócio pertence ao usuário
    const business = await prisma.business.findFirst({
      where: { id: businessId, userId }
    });

    if (!business) {
      return res.status(404).json({ message: "Negócio não encontrado" });
    }

    const where = { businessId };

    if (status) where.status = status;
    if (clientId) where.clientId = clientId;
    if (serviceId) where.serviceId = serviceId;

    const payments = await prisma.businessPayment.findMany({
      where,
      include: {
        client: true,
        service: true,
        income: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(payments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao buscar pagamentos" });
  }
};

export const updateBusinessPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      amount, 
      description, 
      status, 
      paymentDate, 
      dueDate, 
      serviceId, 
      incomeId, 
      paymentMethod, 
      notes 
    } = req.body;
    const userId = req.user.id;

    // Verificar se o pagamento pertence ao usuário
    const payment = await prisma.businessPayment.findFirst({
      where: { 
        id,
        business: { userId }
      }
    });

    if (!payment) {
      return res.status(404).json({ message: "Pagamento não encontrado" });
    }

    const updateData = {};
    if (amount !== undefined) updateData.amount = parseFloat(amount);
    if (description !== undefined) updateData.description = description;
    if (status !== undefined) updateData.status = status;
    if (paymentDate !== undefined) updateData.paymentDate = paymentDate ? new Date(paymentDate) : null;
    if (dueDate !== undefined) updateData.dueDate = dueDate ? new Date(dueDate) : null;
    if (serviceId !== undefined) updateData.serviceId = serviceId;
    if (incomeId !== undefined) updateData.incomeId = incomeId;
    if (paymentMethod !== undefined) updateData.paymentMethod = paymentMethod;
    if (notes !== undefined) updateData.notes = notes;

    const updatedPayment = await prisma.businessPayment.update({
      where: { id },
      data: updateData,
      include: {
        client: true,
        service: true,
        income: true
      }
    });

    res.json(updatedPayment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao atualizar pagamento" });
  }
};

export const markPaymentAsPaid = async (req, res) => {
  try {
    const { id } = req.params;
    const { incomeId, paymentMethod, paymentDate } = req.body;
    const userId = req.user.id;

    // Verificar se o pagamento pertence ao usuário
    const payment = await prisma.businessPayment.findFirst({
      where: { 
        id,
        business: { userId }
      }
    });

    if (!payment) {
      return res.status(404).json({ message: "Pagamento não encontrado" });
    }

    const updatedPayment = await prisma.businessPayment.update({
      where: { id },
      data: {
        status: 'PAID',
        paymentDate: paymentDate ? new Date(paymentDate) : new Date(),
        incomeId: incomeId || null,
        paymentMethod: paymentMethod || payment.paymentMethod
      },
      include: {
        client: true,
        service: true,
        income: true
      }
    });

    res.json(updatedPayment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao marcar pagamento como pago" });
  }
};

export const deleteBusinessPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Verificar se o pagamento pertence ao usuário
    const payment = await prisma.businessPayment.findFirst({
      where: { 
        id,
        business: { userId }
      }
    });

    if (!payment) {
      return res.status(404).json({ message: "Pagamento não encontrado" });
    }

    await prisma.businessPayment.delete({
      where: { id }
    });

    res.json({ message: "Pagamento deletado com sucesso" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao deletar pagamento" });
  }
};
