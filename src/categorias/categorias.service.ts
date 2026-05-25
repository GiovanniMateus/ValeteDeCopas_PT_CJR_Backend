import { Injectable } from '@nestjs/common';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class CategoriasService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.categoria.findMany({
      select: {
        id: true, nome: true,},
      orderBy: { nome: 'asc',},
    });
  }

}
