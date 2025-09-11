import express from 'express';
import cors from 'cors';
import cookieParse from 'cookie-parser';
import dotenv from 'dotenv';
import './connect.js'; // Importar para estabelecer conexão com banco
import authRoute from './routes/auth.js';
import userRoute from './routes/user.js';
import personalFinanceRoute from './routes/personalFinance.js';
import businessRoute from './routes/business.js';
import graphicRoute from './routes/graphic.js';
import receitaRoute from './routes/receita.js';


dotenv.config();
const app = express()
const port = process.env.PORT || 8004;

const corsOptions = {
  origin: [
    'https://front-end-financa-pessoal-ycvr.vercel.app', 
    'https://front-end-financa-pessoal-gwve.vercel.app',
    'http://localhost:3000'
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Access-Control-Allow-Credentials",
    "Access-Control-Allow-Origin",
    "Access-Control-Allow-Methods",
    "Access-Control-Allow-Headers"
  ]
};

app.use(express.json());
app.use(cors(corsOptions));

// Middleware adicional para CORS
app.use((req, res, next) => {
  const allowedOrigins = [
    'https://front-end-financa-pessoal-ycvr.vercel.app', 
    'https://front-end-financa-pessoal-gwve.vercel.app',
    'http://localhost:3000'
  ];
  
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use(express.urlencoded({ extended: false }));
app.use(cookieParse());

// Rotas
app.use('/api', authRoute);
app.use('/api', userRoute);
app.use('/api/personal-finance', personalFinanceRoute);
app.use('/api/business', businessRoute);
app.use('/api', graphicRoute);
app.use('/api', receitaRoute);

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});