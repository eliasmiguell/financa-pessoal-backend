import express from 'express';
import { register, login} from '../controllers/auth.js';

const router = express.Router();

router.post("/authregister", register);
router.post("/authlogin", login);

export default router;





