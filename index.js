import express from 'express';
import cors from 'cors';
import cookieParse from 'cookie-parser'
const app = express()
const port =process.env.PORT || 8001

const corsOptipns={
  origin:'http://localhost:3000',
  credential: true,
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


app.listen(port, ()=>{
  console.log(`http://localhost:${port}`)
})