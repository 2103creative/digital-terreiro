import express from 'express';
import { registrarUsuario, loginUsuario, listarUsuarios } from '../controllers/userController';
import authMiddleware from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/register', registrarUsuario);
router.post('/login', loginUsuario);
router.get('/', authMiddleware, listarUsuarios);

export default router;
