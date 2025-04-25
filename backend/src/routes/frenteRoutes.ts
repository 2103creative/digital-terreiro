import express from 'express';
import { criarFrente, listarFrentes, editarFrente, removerFrente } from '../controllers/frenteController';
import authMiddleware from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/', authMiddleware, criarFrente);
router.get('/', authMiddleware, listarFrentes);
router.put('/:id', authMiddleware, editarFrente);
router.delete('/:id', authMiddleware, removerFrente);

export default router;
