import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';

import { AvaliacaoLojaService } from './avaliacao-loja.service';

import { CreateAvaliacaoLojaDto } from './dto/create-avaliacao-loja.dto';
import { UpdateAvaliacaoLojaDto } from './dto/update-avaliacao-loja.dto';

@Controller('avaliacoes-loja')
export class AvaliacaoLojaController {

  constructor(
    private readonly avaliacaoLojaService: AvaliacaoLojaService
  ) {}

  @Post()
  async create(
    @Body() dto: CreateAvaliacaoLojaDto
  ) {
    return this.avaliacaoLojaService.create(dto);
  }

  @Get()
  async findAll() {
    return this.avaliacaoLojaService.findAll();
  }

  @Get('loja/:lojaId')
  async findByLoja(
    @Param('lojaId') lojaId: string
  ) {
    return this.avaliacaoLojaService.findByLoja(
      Number(lojaId)
    );
  }

  @Get(':id')
  async getById(
    @Param('id') id: string
  ) {
    return this.avaliacaoLojaService.getById(
      Number(id)
    );
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateAvaliacaoLojaDto
  ) {
    return this.avaliacaoLojaService.update(
      Number(id),
      dto
    );
  }

  @Delete(':id')
  async delete(
    @Param('id') id: string
  ) {
    return this.avaliacaoLojaService.delete(
      Number(id)
    );
  }
}