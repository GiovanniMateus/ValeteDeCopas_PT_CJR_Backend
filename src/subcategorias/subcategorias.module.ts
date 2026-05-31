import { Module } from '@nestjs/common';
import { SubcategoriasService } from './subcategorias.service';
import { SubcategoriasController } from './subcategorias.controller';
import { PrismaService } from '../database/prisma.service';

@Module({
  controllers: [SubcategoriasController],
  providers: [SubcategoriasService,PrismaService],
})
export class SubcategoriasModule {}
