import { Body, Controller, Get, Param, Post, Put, Delete } from '@nestjs/common';
import { CreateLojasDto } from '../lojas/dto/create-lojas.dto';
import { UpdateLojaDto } from './dto/update-lojas.dto';
import { LojasService } from './lojas.service';

@Controller('lojas')
export class LojasController {

  constructor(
    private readonly lojasService: LojasService
  ) {}

  @Post()
  async create(@Body() data: CreateLojasDto) {
    return this.lojasService.create(data);
  }

  @Get()
  async findAll() {
    return this.lojasService.findAll();
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.lojasService.getById(Number(id));
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() data: UpdateLojaDto
  ) {
    return this.lojasService.update(Number(id), data);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.lojasService.delete(Number(id));
  }
}
