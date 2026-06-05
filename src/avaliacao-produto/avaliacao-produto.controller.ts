import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';

import { AvaliacaoProdutoService } from './avaliacao-produto.service';

import { CreateAvaliacaoProdutoDto } from './dto/create-avaliacao-produto.dto';
import { UpdateAvaliacaoProdutoDto } from './dto/update-avaliacao-produto.dto';

@Controller('avaliacoes-produto')
export class AvaliacaoProdutoController {

  constructor(
    private readonly avaliacaoProdutoService: AvaliacaoProdutoService
  ) {}

  @Post()
  async create(
    @Body() dto: CreateAvaliacaoProdutoDto
  ) {
    return this.avaliacaoProdutoService.create(dto);
  }

  @Get()
  async findAll() {
    return this.avaliacaoProdutoService.findAll();
  }

  @Get('produto/:produtoId')
  async findByProduto(
    @Param('produtoId') produtoId: string
  ) {
    return this.avaliacaoProdutoService.findByProduto(
      Number(produtoId)
    );
  }

  @Get(':id')
  async getById(
    @Param('id') id: string
  ) {
    return this.avaliacaoProdutoService.getById(
      Number(id)
    );
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateAvaliacaoProdutoDto
  ) {
    return this.avaliacaoProdutoService.update(
      Number(id),
      dto
    );
  }

  @Delete(':id')
  async delete(
    @Param('id') id: string
  ) {
    return this.avaliacaoProdutoService.delete(
      Number(id)
    );
  }
}