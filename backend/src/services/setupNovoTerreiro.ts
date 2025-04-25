import prisma from '../prismaClient';

export default async function setupNovoTerreiro(terreiroId: string) {
  // Crie aqui as configurações, grupos, permissões e dados padrões
  // Exemplo: criar um grupo admin padrão
  await prisma.user.create({
    data: {
      nome: 'Administrador',
      email: `admin_${terreiroId}@terreiro.com`,
      senha: '$2a$10$hashfake', // Troque por hash real depois
      terreiroId,
      role: 'admin',
    },
  });
  // Adicione outras configurações padrão conforme necessário
}
