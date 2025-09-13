import jwt from 'jsonwebtoken';

export const checkToken = (req, res, next) => {
  const authHeader = req.headers.cookie?.split("; ")[0];
  const token = authHeader && authHeader.split('=')[1];

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.userId = decoded.id; // Adicionar o ID do usuário ao request
      next();
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: "Token inválido" });
    }
  } else {
    return res.status(401).json({ message: "Acesso negado." });
  }
};
