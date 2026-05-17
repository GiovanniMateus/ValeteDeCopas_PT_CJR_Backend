import { Body, Controller, Get, Param, Post, Delete, Put } from '@nestjs/common';
import { ProdutosService } from './produtos.service';
import { CreateProdutoDto } from './dto/create-produto.dto';

@Controller('produtos')
export class ProdutosController {

  constructor(
    private readonly produtosService: ProdutosService
  ) {}

  @Post()
  async create(@Body() data: CreateProdutoDto) {
    return this.produtosService.create(data);
  }

  @Get()
  async findAll() {
    return this.produtosService.findAll();
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.produtosService.getById(Number(id));
  }

  @Delete(':id')
  async delete(@Param('id') id:string){
    return this.produtosService.delete(Number(id));
  }

  @Put(':id')
  async update(@Param('id') id:string, @Body() data:any){
    return this.produtosService.update(Number(id), data);
  }
}