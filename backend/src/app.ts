import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import terreiroRoutes from './routes/terreiroRoutes';
import userRoutes from './routes/userRoutes';
import frenteRoutes from './routes/frenteRoutes';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API Digital Terreiro - Multi-Tenant');
});

app.use('/api/terreiros', terreiroRoutes);
app.use('/api/users', userRoutes);
app.use('/api/frentes', frenteRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
