import jwt from 'jsonwebtoken';
import { PrismaClient } from '../generated/prisma/index.js';

const prisma = new PrismaClient();

export const authenticateToken = async (req, res, next) => {
  try {
    // Tentar extrair token de diferentes formas
    let token = null;
    
    // 1. Tentar extrair do header Authorization
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }
    
    // 2. Tentar extrair dos cookies
    if (!token && req.headers.cookie) {
      const cookies = req.headers.cookie.split(';').reduce((acc, cookie) => {
        const [key, value] = cookie.trim().split('=');
        acc[key] = value;
        return acc;
      }, {});
      
      token = cookies.accessToken;
    }

    if (!token) {
      return res.status(401).json({ message: "Token não fornecido" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        name: true
      }
    });

    if (!user) {
      return res.status(401).json({ message: "Usuário não encontrado" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.log('Erro de autenticação:', err.message);
    return res.status(401).json({ message: "Token inválido" });
  }
};

export const checkRefreshToken = (req, res, next) => {
  try {
    let refreshToken = null;
    
    // Tentar extrair refresh token dos cookies
    if (req.headers.cookie) {
      const cookies = req.headers.cookie.split(';').reduce((acc, cookie) => {
        const [key, value] = cookie.trim().split('=');
        acc[key] = value;
        return acc;
      }, {});
      
      refreshToken = cookies.refreshToken;
    }

    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token não fornecido" });
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH);
    req.userId = decoded.id;
    next();
  } catch (err) {
    console.log('Erro no refresh token:', err.message);
    res.status(400).json({ message: "Refresh token inválido" });
  }
};
