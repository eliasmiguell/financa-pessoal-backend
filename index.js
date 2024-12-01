import express from 'express';
import cors from 'cors';
import cookieParse from 'cookie-parser';
import authRoute from './routes/auth.js';
import userRoute from './routes/user.js';
const app = express()
const port =process.env.PORT || 8001;

const corsOptipns={
  origin:'http://localhost:3000',
  credentials: true,
  methods:["GET", "POST", "PUT", "DELETE"],
  allowedHeaders:[
    "Content-Type",
    "Authorizantion",
    "Acess-Control-allow-Credentials"
  ]
};

app.use(express.json());
app.use(cors(corsOptipns));
app.use("*", cors(corsOptipns));
app.use(express.urlencoded({extended:false}));
app.use(cookieParse())
app.use('/', authRoute);
app.use('/', userRoute);

app.listen(port, ()=>{
  console.log(`http://localhost:${port}`)
})