import jwt from 'jsonwebtoken';

export const ckeckToken =(req,res, next)=>{
  const authHeader = req.headers.cookie?.split("; ")[0]
  const token = authHeader && authHeader.split('=')[1]

  if(token){
    try {
      jwt.verify(token, process.env.TOKEN)
      next()
    } catch (err) {
      console.log(err)
      res.status(400).json({message: "Token invalido"})
    }
  }else{
    return res.status(401).json({masseg:"Acesso negado."})
  }
}
