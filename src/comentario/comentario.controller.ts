import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';

import { ComentarioService } from './comentario.service';
import { CreateComentarioDto } from './dto/create-comentario.dto';
import { UpdateComentarioDto } from './dto/update-comentario.dto';

@Controller('comentarios')
export class ComentarioController {

  constructor(
    private readonly comentarioService: ComentarioService
  ) {}

  @Post()
  async create(
    @Body() dto: CreateComentarioDto
  ) {
    return this.comentarioService.create(dto);
  }

  @Get()
  async findAll() {
    return this.comentarioService.findAll();
  }

  @Get('avaliacao-produto/:avaliacaoProdutoId')
  async findByAvaliacaoProduto(
    @Param('avaliacaoProdutoId') avaliacaoProdutoId: string
  ) {
    return this.comentarioService.findByAvaliacaoProduto(
      Number(avaliacaoProdutoId)
    );
  }

  @Get('avaliacao-loja/:avaliacaoLojaId')
  async findByAvaliacaoLoja(
    @Param('avaliacaoLojaId') avaliacaoLojaId: string
  ) {
    return this.comentarioService.findByAvaliacaoLoja(
      Number(avaliacaoLojaId)
    );
  }

  @Get(':id')
  async getById(
    @Param('id') id: string
  ) {
    return this.comentarioService.getById(
      Number(id)
    );
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateComentarioDto
  ) {
    return this.comentarioService.update(
      Number(id),
      dto
    );
  }

  @Delete(':id')
  async delete(
    @Param('id') id: string
  ) {
    return this.comentarioService.delete(
      Number(id)
    );
  }
}