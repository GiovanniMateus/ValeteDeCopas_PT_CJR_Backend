import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateProdutoDto } from './dto/create-produto.dto';

@Injectable()
export class ProdutosService {

  constructor(private prisma: PrismaService) {}

  async create(data: CreateProdutoDto) {
    const{ imagens = [], ...dadosProduto } = data;

    return await this.prisma.produto.create({
      data:{
        ...dadosProduto,
        imagens:{
          create: imagens.map((url, index) =>({
            urlImagem: url,
            ordem: index + 1,
          })),
        }
      }
    });
  }



  
  async findAll(categoriaId?: number, userId?: number,subcategoriaId?: number, page = 1, size = 15) {
  const skip = (page - 1) * size;

  const where: any = {};
  if (categoriaId) where.subcategoria = { categoriaId };
  if (userId) where.loja = { userId }; 

  if (subcategoriaId) where.subcategoriaId = subcategoriaId;

  const [produtos, total] = await this.prisma.$transaction([
    this.prisma.produto.findMany({
      where,
      include: { imagens: true, loja: true, subcategoria: true },
      skip,
      take: size,
    }),
    this.prisma.produto.count({ where }),
  ]);

  return {
    content: produtos,
    totalItems: total,
    totalPages: Math.ceil(total / size),
    page,
  };
}

  async getById(id: number) {
    const produto = await this.prisma.produto.findUnique({
      where: { id },
      include: {
        imagens: true,
        loja: true,
        subcategoria: true,
      },
    });

    if (!produto) {
      throw new NotFoundException('Produto não encontrado');
    }

    return produto;
  }

  async delete(id: number) {
    await this.getById(id);
    return await this.prisma.produto.delete({ where: { id } });
  }

  async update(id: number, data: any) {
    await this.getById(id);
    return await this.prisma.produto.update({ where: { id }, data });
  }

  async melhoresAvaliados(categoriaId?: number) {
    return await this.prisma.produto.findMany({
      where: categoriaId
        ? { subcategoria: { categoriaId } }
        : undefined,
      orderBy: {
        avaliacoes: { _count: 'desc' },
      },
      take: 10,
      include: { imagens: true, loja: true, subcategoria: true },
    });
  }

  async maisBaratos(categoriaId?: number) {
    return await this.prisma.produto.findMany({
      where: categoriaId
        ? { subcategoria: { categoriaId } }
        : undefined,
      orderBy: { preco: 'asc' },
      take: 10,
      include: { imagens: true, loja: true, subcategoria: true },
    });
  }

  async recemAdicionados(categoriaId?: number) {
    return await this.prisma.produto.findMany({
      where: categoriaId
        ? { subcategoria: { categoriaId } }
        : undefined,
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: { imagens: true, loja: true, subcategoria: true },
    });
  }
}