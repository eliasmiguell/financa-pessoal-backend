import { prisma } from '../connect.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
 
  if (!name) {
    return res.status(422).json({ message: "O nome é Obrigatório" })
  }
  if (!email) {
    return res.status(422).json({ message: "O email é Obrigatório" })
  }
  if (!password) {
    return res.status(422).json({ message: "O senha é obrigatório" })
  }

  if (password !== confirmPassword) {
    return res.status(422).json({ message: "As senhas precisam ser iguais." })
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(500).json({ message: 'Este email já está sendo utilizado!' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name: name,
        email,
        password: passwordHash
      }
    });

    return res.status(200).json({ message: "Usuário cadastrado com sucesso." });

  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    return res.status(500).json({ message: 'Erro ao criar usuário' });
  }
}

export const logout = (req, res) => {
  return res
    .clearCookie("accessToken", { secure: true, sameSite: "none" })
    .clearCookie("refreshToken", { secure: true, sameSite: "none" })
    .status(200).json({ message: "Logout efetuado com sucesso" })
}

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(422).json({ message: "Usuário não encontrado." })
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(200).json({ message: "Usuário não encontrado!" });
    }

    const checkPassword = await bcrypt.compare(password, user.password)

    if (email !== user.email || checkPassword === false) {
      return res.status(404).json({ message: 'A senha ou o email é inválido!' });
    }

    const refreshToken = jwt.sign({
      exp: Math.floor(Date.now() / 1000) + 25 * 60 * 60,
      id: user.id
    },
      process.env.REFRESH,
      { algorithm: "HS256" }
    );

    const token = jwt.sign({
      exp: Math.floor(Date.now() / 1000) + 3600,
      id: user.id
    },
      process.env.TOKEN,
      { algorithm: "HS256" }
    );

    const { password: _, ...userWithoutPassword } = user;

    return res
      .cookie('accessToken', token, { httpOnly: true })
      .cookie('refreshToken', refreshToken, { httpOnly: true })
      .status(200).json({ message: "Usuário logado com sucesso!", user: userWithoutPassword, accessToken: token, refreshToken: refreshToken })

  } catch (error) {
    console.error('Erro ao fazer o login:', error);
    return res.status(500).json({ message: "Ocorreu algum erro ao fazer login, tente novamente mais tarde!" });
  }
}

export const refresh = async (req, res) => {
  try {
    const userId = req.userId;
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true
      }
    });

    if (!user) {
      return res.status(401).json({ message: "Usuário não encontrado" });
    }

    const newToken = jwt.sign({
      exp: Math.floor(Date.now() / 1000) + 3600,
      id: user.id
    },
      process.env.TOKEN,
      { algorithm: "HS256" }
    );

    return res
      .cookie('accessToken', newToken, { httpOnly: true })
      .status(200).json({ message: "Token renovado com sucesso!" });

  } catch (error) {
    console.error('Erro ao renovar token:', error);
    return res.status(500).json({ message: "Erro ao renovar token" });
  }
}