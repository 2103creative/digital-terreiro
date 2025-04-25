import express from 'express';
import { registrarUsuario, loginUsuario, listarUsuarios, atualizarUsuario, deletarUsuario } from '../controllers/userController';
import authMiddleware from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/register', registrarUsuario);
router.post('/login', loginUsuario);
router.get('/', authMiddleware, listarUsuarios);
router.put('/:id', authMiddleware, atualizarUsuario);
router.delete('/:id', authMiddleware, deletarUsuario);

export default router;
