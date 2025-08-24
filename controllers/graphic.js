import { prisma } from '../connect.js';

export const getGraphicData = async (req, res) => {
  try {
    const userId = req.user.id;
    const { month, year } = req.query;
    const currentMonth = month ? parseInt(month) : new Date().getMonth() + 1;
    const currentYear = year ? parseInt(year) : new Date().getFullYear();

    const startDate = new Date(currentYear, currentMonth - 1, 1);
    const endDate = new Date(currentYear, currentMonth, 0);

    // Buscar dados para gráficos
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

    // Combinar dados
    const graphicData = expensesByCategory.map(expense => {
      const category = categories.find(cat => cat.id === expense.categoryId);
      return {
        category: category ? category.name : 'Sem categoria',
        amount: expense._sum.amount || 0,
        color: category ? category.color : '#000000'
      };
    });

    res.json(graphicData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao buscar dados dos gráficos" });
  }
};
