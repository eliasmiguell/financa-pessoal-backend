import { prisma } from '../connect.js';

export const getGraphicData = async (req, res) => {
  try {
    const userId = req.user.id;
    const { month, year } = req.query;
    const currentMonth = month ? parseInt(month) : new Date().getMonth() + 1;
    const currentYear = year ? parseInt(year) : new Date().getFullYear();

    const startDate = new Date(currentYear, currentMonth - 1, 1);
    const endDate = new Date(currentYear, currentMonth, 0);

    // Buscar despesas por categoria
    const expensesByCategory = await prisma.personalExpense.groupBy({
      by: ['categoryId'],
      where: {
        userId,
        createdAt: {
          gte: startDate,
          lte: endDate
        }
      },
      _sum: { amount: true }
    });

    // Buscar categorias com nomes
    const categories = await prisma.expenseCategory.findMany({
      where: { userId }
    });

    // Dados de categoria para gráfico de pizza
    const categoryData = expensesByCategory.map(expense => {
      const category = categories.find(cat => cat.id === expense.categoryId);
      return {
        name: category ? category.name : 'Sem categoria',
        amount: expense._sum.amount || 0,
        color: category ? category.color : '#000000'
      };
    });

    // Dados mensais para gráficos de linha e barras
    const monthlyData = [];
    for (let i = 0; i < 6; i++) {
      const monthDate = new Date(currentYear, currentMonth - 1 - i, 1);
      const monthEnd = new Date(currentYear, currentMonth - i, 0);
      
      const [monthExpenses, monthIncomes] = await Promise.all([
        prisma.personalExpense.aggregate({
          where: {
            userId,
            createdAt: {
              gte: monthDate,
              lte: monthEnd
            }
          },
          _sum: { amount: true }
        }),
        prisma.personalIncome.aggregate({
          where: {
            userId,
            receivedDate: {
              gte: monthDate,
              lte: monthEnd
            }
          },
          _sum: { amount: true }
        })
      ]);

      monthlyData.unshift({
        month: monthDate.toLocaleDateString('pt-BR', { month: 'short' }),
        receitas: monthIncomes._sum.amount || 0,
        despesas: monthExpenses._sum.amount || 0
      });
    }

    res.json({
      categoryData,
      monthlyData
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao buscar dados dos gráficos" });
  }
};
