#!/usr/bin/env node

/**
 * Script de teste para verificar se as rotas estão funcionando
 * Execute: node test-routes.js
 */

import express from 'express';
import cors from 'cors';
import cookieParse from 'cookie-parser';
import dotenv from 'dotenv';
import './connect.js';
import authRoute from './routes/auth.js';
import userRoute from './routes/user.js';
import personalFinanceRoute from './routes/personalFinance.js';
import businessRoute from './routes/business.js';
import graphicRoute from './routes/graphic.js';
import receitaRoute from './routes/receita.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 8004;

const corsOptions = {
  origin: ['https://front-end-financa-pessoal-ycvr.vercel.app', 'http://localhost:3000'],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Access-Control-Allow-Credentials"
  ]
};

app.use(express.json());
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParse());

// Rotas
app.use('/api', authRoute);
app.use('/api', userRoute);
app.use('/api/personal-finance', personalFinanceRoute);
app.use('/api/business', businessRoute);
app.use('/api', graphicRoute);
app.use('/api', receitaRoute);

// Rota de teste
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'API funcionando!', 
    timestamp: new Date().toISOString(),
    routes: {
      categories: '/api/personal-finance/categories',
      expenses: '/api/personal-finance/expenses',
      incomes: '/api/personal-finance/incomes',
      goals: '/api/personal-finance/goals'
    }
  });
});

// Listar todas as rotas registradas
app.get('/api/routes', (req, res) => {
  const routes = [];
  
  // Função para extrair rotas do app
  const extractRoutes = (stack, prefix = '') => {
    stack.forEach((layer) => {
      if (layer.route) {
        const methods = Object.keys(layer.route.methods).join(', ').toUpperCase();
        routes.push({
          method: methods,
          path: prefix + layer.route.path
        });
      } else if (layer.name === 'router') {
        extractRoutes(layer.handle.stack, prefix + (layer.regexp.source || ''));
      }
    });
  };
  
  extractRoutes(app._router.stack);
  
  res.json({
    message: 'Rotas disponíveis',
    total: routes.length,
    routes: routes
  });
});

app.listen(port, () => {
  console.log(`🚀 Servidor de teste rodando em http://localhost:${port}`);
  console.log(`📋 Teste a API em: http://localhost:${port}/api/test`);
  console.log(`📋 Lista de rotas: http://localhost:${port}/api/routes`);
  console.log(`\n🔧 Rotas principais:`);
  console.log(`   POST /api/personal-finance/categories - Criar categoria`);
  console.log(`   GET  /api/personal-finance/categories - Listar categorias`);
  console.log(`   POST /api/personal-finance/expenses - Criar despesa`);
  console.log(`   GET  /api/personal-finance/expenses - Listar despesas`);
  console.log(`   POST /api/personal-finance/incomes - Criar receita`);
  console.log(`   GET  /api/personal-finance/incomes - Listar receitas`);
  console.log(`   POST /api/personal-finance/goals - Criar meta`);
  console.log(`   GET  /api/personal-finance/goals - Listar metas`);
});
