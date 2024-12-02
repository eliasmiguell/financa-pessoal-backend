import { db } from '../connect.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const register = async (req, res)=>{
  const {username, email, password, confirmPassword}=req.body;

  if(!username){
    return res.status(422).json({message: "O nome é Obrigatório"})
  }
  if( !email){
    return res.status(422).json({message: "O email é Obrigatório"})
  }
  if(!password){
    return res.status(422).json({message: "O senha é obrigatório"})
  }

  if(password !== confirmPassword){
    return res.status(422).json({message: "As senhas precisam ser iguais."})
  }

 
try {
  
  const user = await db`SELECT * FROM users WHERE email=${email}`;

  if(user.length > 0 ){
      return res.status(500).json({ message: 'Este email já está sendo utilizado!' });
    
    }else {
      const passwordHash = await bcrypt.hash(password, 10);

      await db`INSERT INTO users(username, email, password) 
      VALUES(${username}, ${email}, ${passwordHash})`;
      return res.status(200).json({message:"Usuário cadastrado com sucesso."});
    
    }
  
} catch (error) {
  console.error('Erro ao criar usuário:', error);
   return res.status(500).json({ message: 'Erro ao criar usuário' });
  
}
  
}
export const logout = (req, res)=>{
  return res
    .clearCookie("accessToken", {secure :true, samesSite:"none"})
    .clearCookie("refreshToken", {secure :true, samesSite:"none"})
    .status(200).json({message:"Logout efetuado com sucesso"})
}


export const login = async (req, res)=>{
  const {email, password}=req.body;

  if( !email || !password){
    return res.status(422).json({message: "Usuário não encontrado."})
  }
 
try {
      const user =  await db`SELECT * FROM users WHERE email=${email}`;
     

      if(user.length === 0)return res.status(200).json({ message: "Usuário não encontrado!" });

       const checkPassword = await bcrypt.compare(password, user[0].password)

      if(email !== user[0].email || checkPassword === false){
        return res.status(404).json({ message: 'A senha ou o email é inválido!' });
      }


      const refreshToken = jwt.sign( { 
        exp : Math.floor( Date.now() / 1000 ) + 25 * 60 * 60, 
        data : user[0].password 
      } , 
      process.env.REFRESH,
      { algorithm: "HS256" } 
    
    ) ;

    const token = jwt.sign( { 
      exp : Math.floor(Date.now() / 100) + 3600,
      data : user[0].password 
    } , 
    process.env.TOKEN,
    { algorithm: "HS256" } 
  
  ) ;
  delete user.password;

   return res
   .cookie('accessToken', token, {httpOnly:true} )
   .cookie('refreshToken', refreshToken, {httpOnly:true} )
   .status(200).json({ message: "Usuário logado com sucesso!", user })
  
} catch (error) {
  console.error('Erro ao fazer o login:', error);
  return res.status(500).json({ message: "Ocorreu algum erro ao fazer login, tente novamente mais tarde!" });
}
}

export const refresh = async (req, res) => {
  const authHeader = req.headers.cookie?.split("; ")[1];
  const refresh = authHeader && authHeader.split("=")[1];

  const tokenStruct = refresh.split('.')[1];
  const payload = atob(tokenStruct);

  try {
    const refreshToken = jwt.sign(
      {
        exp: Math.floor(Date.now() / 100) + 24 * 60 * 60,
        id: JSON.parse(payload).id,
      },
      process.env.REFRESH,
      { algorithm: "HS256" }
    );

    const token = jwt.sign(
      {
        exp: Math.floor(Date.now() / 100) + 3600,
        id: JSON.parse(payload).id,
      },
      process.env.TOKEN,
      { algorithm: "HS256" }
    );

    return res
      .cookie('accessToken', token, { httpOnly: true })
      .cookie('refreshToken', refreshToken, { httpOnly: true })
      .status(200)
      .json({ message: "Token atualizado com sucesso!" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Ocorreu algum erro no servidor, tente novamente mais tarde!" });
  }

}