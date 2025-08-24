import { prisma } from '../connect.js';

export const getSaldoAtual = async (req, res) => {
  try {
    const userId = req.user.id;
    const { month, year } = req.query;
    const currentMonth = month ? parseInt(month) : new Date().getMonth() + 1;
    const currentYear = year ? parseInt(year) : new Date().getFullYear();

    const startDate = new Date(currentYear, currentMonth - 1, 1);
    const endDate = new Date(currentYear, currentMonth, 0);

    // Calcular total de receitas
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

    // Calcular total de despesas
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
    const saldo = incomeTotal - expenseTotal;

    res.json({ saldo });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao buscar saldo" });
  }
};

export const getUltimasTransacoes = async (req, res) => {
  try {
    const userId = req.user.id;

    // Buscar últimas receitas
    const ultimasReceitas = await prisma.personalIncome.findMany({
      where: { userId },
      take: 5,
      orderBy: { receivedDate: 'desc' }
    });

    // Buscar últimas despesas
    const ultimasDespesas = await prisma.personalExpense.findMany({
      where: { userId },
      take: 5,
      include: {
        category: true
      },
      orderBy: { createdAt: 'desc' }
    });

    // Combinar e ordenar por data
    const todasTransacoes = [
      ...ultimasReceitas.map(r => ({
        ...r,
        tipo: 'receita',
        data: r.receivedDate
      })),
      ...ultimasDespesas.map(d => ({
        ...d,
        tipo: 'despesa',
        data: d.createdAt
      }))
    ].sort((a, b) => new Date(b.data) - new Date(a.data)).slice(0, 10);

    res.json(todasTransacoes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao buscar transações" });
  }
};

export const adicionarReceita = async (req, res) => {
  try {
    const { categoria_id, conta_id, user_id, descricao, valor, tipo } = req.body;
    const userId = req.user.id;

    // Verificar se o usuário está tentando adicionar receita para outro usuário
    if (user_id !== userId) {
      return res.status(403).json({ message: "Não autorizado" });
    }

    const receita = await prisma.personalIncome.create({
      data: {
        description: descricao,
        amount: parseFloat(valor),
        type: tipo || 'OUTRO',
        userId,
        receivedDate: new Date()
      }
    });

    res.status(201).json(receita);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao adicionar receita" });
  }
};
