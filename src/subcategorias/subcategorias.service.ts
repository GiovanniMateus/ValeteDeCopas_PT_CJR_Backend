// src/subcategorias/subcategorias.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class SubcategoriasService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.subcategoria.findMany({
    select: {
        id: true, nome: true,},
      orderBy: { nome: 'asc',},
    });
  }

}
