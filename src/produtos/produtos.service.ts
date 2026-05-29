import {
  Injectable,
  NotFoundException
} from '@nestjs/common';

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
    categoriaId?: number
  ) {

    return await this.prisma.produto.findMany({

      where: {

        ...(search && {
          nome: {
            contains: search,
            mode: 'insensitive',
          },
        }),

        ...(categoriaId && {
          subcategoria: {
            categoriaId,
          },
        }),
      },

      include: {
        imagens: true,
        loja: true,
        subcategoria: true,
      },
    });
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
      throw new NotFoundException(
        'Produto não encontrado'
      );
    }

    return produto;
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
}