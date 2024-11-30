import express from 'express';
import postgres from 'postgres';
import dotenv from 'dotenv';

dotenv.config();

export const db = postgres({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
});

// Teste de conexão usando o método correto
async function testConnection() {
  try {
    const result = await db`SELECT 1`;
    console.log('Conexão ao banco de dados bem-sucedida!', result);
  } catch (error) {
    console.error('Erro ao conectar ao banco de dados:', error);
  }
}

testConnection();
