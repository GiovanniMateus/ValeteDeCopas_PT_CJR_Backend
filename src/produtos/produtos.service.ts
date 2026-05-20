import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateProdutoDto } from './dto/create-produto.dto';



@Injectable()
export class ProdutosService {

  constructor(private prisma: PrismaService) {}

  //  metodo create reformulado para que seja possivel criar um produto sem passar ou passando a url das imagens
  async create(data: CreateProdutoDto) {
    const{ imagens = [], ... dadosProduto } = data;

    return await this.prisma.produto.create({
      data:{
        ...dadosProduto,
        imagens:{
          create: imagens.map((url,index ) =>({
            urlImagem: url,
            ordem : index + 1,
          })),
        }
      }
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