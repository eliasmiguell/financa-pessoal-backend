import { PrismaClient } from '../generated/prisma/index.js';

const prisma = new PrismaClient();

// Obter perfil do usuário
export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    res.json(user);
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

// Atualizar perfil do usuário
export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, email } = req.body;

    // Verificar se email já existe em outro usuário
    if (email) {
      const existingUser = await prisma.user.findFirst({
        where: {
          email: email,
          id: { not: userId }
        }
      });

      if (existingUser) {
        return res.status(400).json({ message: 'Email já está em uso' });
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(name && { name }),
        ...(email && { email })
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true
      }
    });

    res.json(updatedUser);
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

// Alterar senha
export const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Senha atual e nova senha são obrigatórias' });
    }

    // Buscar usuário com senha
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    // Verificar senha atual (simplificado - em produção usar bcrypt)
    if (user.password !== currentPassword) {
      return res.status(400).json({ message: 'Senha atual incorreta' });
    }

    // Atualizar senha
    await prisma.user.update({
      where: { id: userId },
      data: { password: newPassword }
    });

    res.json({ message: 'Senha alterada com sucesso' });
  } catch (error) {
    console.error('Erro ao alterar senha:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

// Obter estatísticas do usuário
export const getUserStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const [
      totalExpenses,
      totalIncomes,
      totalGoals,
      totalCategories
    ] = await Promise.all([
      prisma.personalExpense.count({ where: { userId } }),
      prisma.personalIncome.count({ where: { userId } }),
      prisma.financialGoal.count({ where: { userId } }),
      prisma.expenseCategory.count({ where: { userId } })
    ]);

    res.json({
      totalExpenses,
      totalIncomes,
      totalGoals,
      totalCategories,
      memberSince: new Date().toISOString()
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
};