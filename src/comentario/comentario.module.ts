import { Module } from '@nestjs/common';
import { ComentarioController } from './comentario.controller';
import { ComentarioService } from './comentario.service';
import { PrismaService } from '../database/prisma.service';

@Module({
  controllers: [ComentarioController],
  providers: [ComentarioService, PrismaService],
})
export class ComentariosModule {}