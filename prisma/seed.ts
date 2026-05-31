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

  const subcategorias = [
    { nome: 'Hortifruti', categoriaId: 1 },
    { nome: 'Açougue e Frios', categoriaId: 1 },

    { nome: 'Medicamentos', categoriaId: 2 },
    { nome: 'Higiene Pessoal', categoriaId: 2 },

    { nome: 'Maquiagem', categoriaId: 3 },
    { nome: 'Cuidados com a Pele ', categoriaId: 3 },

    { nome: 'Roupas Masculinas e Femininas', categoriaId: 4 },
    { nome: 'Calçados', categoriaId: 4 },

    { nome: 'Smartphones e Celulares', categoriaId: 5 },
    { nome: 'Computadores e Notebooks', categoriaId: 5 },

    { nome: 'Jogos de Tabuleiro', categoriaId: 6 },
    { nome: 'Videogames e Consoles', categoriaId: 6 },

    { nome: 'Blocos de Montar', categoriaId: 7 },
    { nome: 'Bonecos e Pelúcias', categoriaId: 7 },

    { nome: 'Cama, Mesa e Banho', categoriaId: 8 },
    { nome: 'Móveis e Decoração', categoriaId: 8 },
  ];

  await prisma.categoria.createMany({
    data: categorias,
    skipDuplicates: true,
  });

  await prisma.subcategoria.createMany({
    data: subcategorias,
    skipDuplicates: true,
  });

  console.log('Categorias e Subcategorias criadas com sucesso criadas com sucesso!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());