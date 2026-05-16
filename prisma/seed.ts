import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL as string,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  const categorias = [
    { nome: 'Mercado' },
    { nome: 'Farmácia' },
    { nome: 'Beleza' },
    { nome: 'Moda' },
    { nome: 'Eletrônicos' },
    { nome: 'Jogos' },
    { nome: 'Brinquedos' },
    { nome: 'Casa' },
  ];

  await prisma.categoria.createMany({
    data: categorias,
    skipDuplicates: true,
  });

  console.log('Categorias criadas com sucesso!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());