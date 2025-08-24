import jwt from "jsonwebtoken";

export const checkRefreshToken = (req, res, next) => {
  const refresh = req.cookies.refreshToken; // cookie-parser já parseia pra você

  if (!refresh) {
    return res.status(401).json({ message: "Refresh token não fornecido" });
  }

  try {
    const decoded = jwt.verify(refresh, process.env.REFRESH);
    req.userId = decoded.id; // guarda o ID do usuário no request
    next();
  } catch (err) {
    console.error("Erro ao verificar refresh token:", err);
    return res.status(400).json({ message: "Refresh token inválido" });
  }
};
