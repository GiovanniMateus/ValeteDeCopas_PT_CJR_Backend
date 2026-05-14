import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateProdutoDto } from './dto/create-produto.dto';

@Injectable()
export class ProdutosService {

  constructor(private prisma: PrismaService) {}

  async create(data: CreateProdutoDto) {

    return await this.prisma.produto.create({
      data,
    });
  }

  async findAll() {

    return await this.prisma.produto.findMany({
      include: {
        imagens: true,
        loja: true,
        categoria: true,
      },
    });
  }

  async getById(id: number) {

    const produto = await this.prisma.produto.findUnique({
      where: {
        id,
      },
      include: {
        imagens: true,
        loja: true,
        categoria: true,
      },
    });

    if (!produto) {
      throw new Error('Produto não encontrado');
    }

    return produto;
  }
}