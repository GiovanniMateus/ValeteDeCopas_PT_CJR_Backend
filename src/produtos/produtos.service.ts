import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';


import { PrismaService } from '../database/prisma.service';
import { CreateProdutoDto } from './dto/create-produto.dto';

@Injectable()
export class ProdutosService {

  constructor(
    private prisma: PrismaService
  ) {}

  async create(data: CreateProdutoDto) {

    const { imagens = [], ...dadosProduto } = data;

    return await this.prisma.produto.create({
      data: {
        ...dadosProduto,

        imagens: {
          create: imagens.map((url, index) => ({
            urlImagem: url,
            ordem: index + 1,
          })),
        },
      },
    });
  }

  async findAll(
    search?: string,
    categoriaId?: number,
    userId?: number,
    subcategoriaId?: number,
    ordenacao?: string,
    page = 1,
    size = 15,
  ) {
    const skip = (page - 1) * size;
    const where: any = {};

    if (search) {
      where.nome = { contains: search, mode: 'insensitive' };
    }
    if (categoriaId) where.subcategoria = { categoriaId };
    if (userId) where.loja = { userId };
    if (subcategoriaId) where.subcategoriaId = subcategoriaId;

    let prismaOrderBy: any = { createdAt: 'desc' };
    if (ordenacao === 'Menor preço') prismaOrderBy = { preco: 'asc' };
    else if (ordenacao === 'Maior preço') prismaOrderBy = { preco: 'desc' };

    const [produtos, total] = await this.prisma.$transaction([
      this.prisma.produto.findMany({
        where,
        include: { imagens: true, loja: true, subcategoria: true },
        skip,
        take: size,
        orderBy: prismaOrderBy,
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



  async delete(id: number) {

    await this.getById(id);

    return await this.prisma.produto.delete({
      where: { id },
    });
  }

  async update(id: number, data: any) {

    await this.getById(id);

    return await this.prisma.produto.update({
      where: { id },
      data,
    });
  }

  async melhoresAvaliados() {

    return await this.prisma.produto.findMany({

      orderBy: {
        avaliacoes: {
          _count: 'desc',
        },
      },

      take: 10,

      include: {
        imagens: true,
        loja: true,
        subcategoria: true,
      },
    });
  }

  async maisBaratos() {

    return await this.prisma.produto.findMany({

      orderBy: {
        preco: 'asc',
      },

      take: 10,

      include: {
        imagens: true,
        loja: true,
        subcategoria: true,
      },
    });
  }

  async recemAdicionados() {

    return await this.prisma.produto.findMany({

      orderBy: {
        createdAt: 'desc',
      },

      take: 10,

      include: {
        imagens: true,
        loja: true,
        subcategoria: true,
      },
    });
  }


   async getById(id: number) {
    if (!id || isNaN(id)) {
      throw new BadRequestException('ID inválido');
     }

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

}