import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { NotFoundError } from 'rxjs';

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
      throw new NotFoundException('Produto não encontrado');
    }

    return produto;
  }

  async delete(id:number){
    await this.getById(id);

    return await this.prisma.produto.delete({
      where:{id},
    });
  }

  async update(id:number, data: any){
    await this.getById(id);

    return await this.prisma.produto.update({
      where: {id},
      data,
    });
  }  
}