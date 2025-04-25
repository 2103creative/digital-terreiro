import express from 'express';
import { criarTerreiro, listarTerreiros, obterTemaTerreiro, atualizarTemaTerreiro } from '../controllers/terreiroController';

const router = express.Router();

router.post('/', criarTerreiro);
router.get('/', listarTerreiros);

// Rotas de tema do terreiro
router.get('/:id/theme', obterTemaTerreiro);
router.put('/:id/theme', atualizarTemaTerreiro);

export default router;
