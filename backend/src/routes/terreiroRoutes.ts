import express from 'express';
import { criarTerreiro, listarTerreiros } from '../controllers/terreiroController';

const router = express.Router();

router.post('/', criarTerreiro);
router.get('/', listarTerreiros);

export default router;
