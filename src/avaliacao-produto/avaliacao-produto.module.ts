import { Module } from '@nestjs/common';

import { PrismaService } from '../database/prisma.service';

import { AvaliacaoProdutoController } from './avaliacao-produto.controller';
import { AvaliacaoProdutoService } from './avaliacao-produto.service';

@Module({
  controllers: [
    AvaliacaoProdutoController
  ],
  providers: [
    AvaliacaoProdutoService,
    PrismaService,
  ],
})
export class AvaliacaoProdutoModule {}