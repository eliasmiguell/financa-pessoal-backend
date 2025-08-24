import { PrismaClient } from './generated/prisma/index.js';

const prisma = new PrismaClient();


async function testConnection() {
  try {
    await prisma.$connect();
    console.log('Conexão ao banco de dados bem-sucedida via Prisma!');
  } catch (error) {
    console.error('Erro ao conectar ao banco de dados:', error);
  }
}

testConnection();

export { prisma };
