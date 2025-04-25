import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import terreiroRoutes from './routes/terreiroRoutes';
import userRoutes from './routes/userRoutes';
import frenteRoutes from './routes/frenteRoutes';
import { tenantPrismaMiddleware } from './middlewares/tenantSchema';
import http from 'http';
import { setupSocket } from './socket';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Middleware multi-tenant: injeta Prisma Client com schema do terreiro
app.use(tenantPrismaMiddleware);

app.get('/', (req, res) => {
  res.send('API Digital Terreiro - Multi-Tenant');
});

app.use('/api/terreiros', terreiroRoutes);
app.use('/api/users', userRoutes);
app.use('/api/frentes', frenteRoutes);

const PORT = process.env.PORT || 4000;
const server = http.createServer(app);
setupSocket(server);
server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
