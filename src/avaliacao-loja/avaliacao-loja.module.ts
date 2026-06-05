import { Module } from '@nestjs/common';

import { PrismaService } from '../database/prisma.service';

import { AvaliacaoLojaController } from './avaliacao-loja.controller';
import { AvaliacaoLojaService } from './avaliacao-loja.service';

@Module({
  controllers: [
    AvaliacaoLojaController
  ],
  providers: [
    AvaliacaoLojaService,
    PrismaService,
  ],
})
export class AvaliacaoLojaModule {}