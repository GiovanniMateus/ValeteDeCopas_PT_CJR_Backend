import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { PrismaService } from '../database/prisma.service';
import { CreateComentarioDto } from './dto/create-comentario.dto';
import { UpdateComentarioDto } from './dto/update-comentario.dto';

@Injectable()
export class ComentarioService {

  constructor(
    private prisma: PrismaService
  ) {}

  async create(dto: CreateComentarioDto) {

    if (!dto.avaliacaoLojaId && !dto.avaliacaoProdutoId) {
      throw new BadRequestException(
        'É necessário informar uma avaliação'
      );
    }

    return await this.prisma.comentarioAvaliacao.create({

      data: {
        userId: dto.userId,
        avaliacaoLojaId: dto.avaliacaoLojaId,
        avaliacaoProdutoId: dto.avaliacaoProdutoId,
        conteudo: dto.conteudo,
      },

      include: {
        user: true,
        avaliacaoLoja: true,
        avaliacaoProduto: true,
      },
    });
  }

  async findAll() {

    return await this.prisma.comentarioAvaliacao.findMany({

      include: {
        user: true,
        avaliacaoLoja: true,
        avaliacaoProduto: true,
      },

      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findByAvaliacaoProduto(
    avaliacaoProdutoId: number
  ) {

    return await this.prisma.comentarioAvaliacao.findMany({

      where: {
        avaliacaoProdutoId,
      },

      include: {
        user: true,
      },

      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findByAvaliacaoLoja(
    avaliacaoLojaId: number
  ) {

    return await this.prisma.comentarioAvaliacao.findMany({

      where: {
        avaliacaoLojaId,
      },

      include: {
        user: true,
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

    const comentario =
      await this.prisma.comentarioAvaliacao.findUnique({

        where: {
          id,
        },

        include: {
          user: true,
          avaliacaoLoja: true,
          avaliacaoProduto: true,
        },
      });

    if (!comentario) {
      throw new NotFoundException(
        'Comentário não encontrado'
      );
    }

    return comentario;
  }

  async update(
    id: number,
    dto: UpdateComentarioDto
  ) {

    await this.getById(id);

    return await this.prisma.comentarioAvaliacao.update({

      where: {
        id,
      },

      data: {
        conteudo: dto.conteudo,
      },

      include: {
        user: true,
        avaliacaoLoja: true,
        avaliacaoProduto: true,
      },
    });
  }

  async delete(id: number) {

    await this.getById(id);

    return await this.prisma.comentarioAvaliacao.delete({
      where: {
        id,
      },
    });
  }
}