import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { PrismaService } from '../database/prisma.service';

import { CreateAvaliacaoLojaDto } from './dto/create-avaliacao-loja.dto';
import { UpdateAvaliacaoLojaDto } from './dto/update-avaliacao-loja.dto';

@Injectable()
export class AvaliacaoLojaService {

  constructor(
    private prisma: PrismaService
  ) {}

  async create(dto: CreateAvaliacaoLojaDto) {

    const avaliacaoExistente =
      await this.prisma.avaliacaoLoja.findFirst({

        where: {
          userId: dto.userId,
          lojaId: dto.lojaId,
        },
      });

    if (avaliacaoExistente) {
      throw new BadRequestException(
        'Você já avaliou esta loja'
      );
    }

    return await this.prisma.avaliacaoLoja.create({

      data: {
        userId: dto.userId,
        lojaId: dto.lojaId,
        nota: dto.nota,
        comentario: dto.comentario,
      },

      include: {
        user: true,
        loja: true,
      },
    });
  }

  async findAll() {

    return await this.prisma.avaliacaoLoja.findMany({

      include: {
        user: true,
        loja: true,
        comentarios: true,
      },

      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findByLoja(lojaId: number) {

    return await this.prisma.avaliacaoLoja.findMany({

      where: {
        lojaId,
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
      await this.prisma.avaliacaoLoja.findUnique({

        where: {
          id,
        },

        include: {
          user: true,
          loja: true,
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
    dto: UpdateAvaliacaoLojaDto
  ) {

    await this.getById(id);

    return await this.prisma.avaliacaoLoja.update({

      where: {
        id,
      },

      data: dto,

      include: {
        user: true,
        loja: true,
        comentarios: true,
      },
    });
  }

  async delete(id: number) {

    await this.getById(id);

    return await this.prisma.avaliacaoLoja.delete({

      where: {
        id,
      },
    });
  }
}