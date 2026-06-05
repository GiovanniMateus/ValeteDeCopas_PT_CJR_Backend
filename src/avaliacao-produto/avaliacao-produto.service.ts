import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { PrismaService } from '../database/prisma.service';

import { CreateAvaliacaoProdutoDto} from './dto/create-avaliacao-produto.dto';
import { UpdateAvaliacaoProdutoDto} from './dto/update-avaliacao-produto.dto';

@Injectable()
export class AvaliacaoProdutoService {

  constructor(
    private prisma: PrismaService
  ) {}

  async create(dto: CreateAvaliacaoProdutoDto) {

    return await this.prisma.avaliacaoProduto.create({
      data: dto,

      include: {
        user: true,
        produto: true,
      },
    });
  }

  async findAll() {

    return await this.prisma.avaliacaoProduto.findMany({

      include: {
        user: true,
        produto: true,
        comentarios: true,
      },

      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findByProduto(produtoId: number) {

    return await this.prisma.avaliacaoProduto.findMany({

      where: {
        produtoId,
      },

      include: {
        user: true,
        comentarios: true,
      },

      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getById(id: number) {

    if (!id || isNaN(id)) {
      throw new BadRequestException(
        'ID inválido'
      );
    }

    const avaliacao =
      await this.prisma.avaliacaoProduto.findUnique({

        where: {
          id,
        },

        include: {
          user: true,
          produto: true,
          comentarios: true,
        },
      });

    if (!avaliacao) {
      throw new NotFoundException(
        'Avaliação não encontrada'
      );
    }

    return avaliacao;
  }

  async update(
    id: number,
    dto: UpdateAvaliacaoProdutoDto
  ) {

    await this.getById(id);

    return await this.prisma.avaliacaoProduto.update({

      where: {
        id,
      },

      data: dto,

      include: {
        user: true,
        produto: true,
        comentarios: true,
      },
    });
  }

  async delete(id: number) {

    await this.getById(id);

    return await this.prisma.avaliacaoProduto.delete({
      where: {
        id,
      },
    });
  }
}