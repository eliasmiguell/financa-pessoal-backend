import express from 'express';
import { register, login, refresh, logout} from '../controllers/auth.js';
import {checkRefreshToken} from '../midalwares/refreshValidToken.js';
import { ckeckToken} from "../midalwares/tokenValid.js"
const router = express.Router();

router.post("/authregister", register);
router.post("/authlogin", login);
router.post("/authlogout", ckeckToken,  logout);
router.get("/authRefresh", checkRefreshToken, refresh);
export default router;





