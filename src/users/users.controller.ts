import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  Req,
} from '@nestjs/common';

import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update.user.dto';
import { AlterarSenhaDto } from './dto/alterar-senha.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) {}

  @Post()
  async create(
    @Body() data: CreateUserDto,
  ) {
    return this.usersService.create(data);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  async update(
    @Req() req: any,
    @Body() data: UpdateUserDto,
  ) {
    return this.usersService.update(
      req.user.id,
      data,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Put('alterar-senha')
  async alterarSenha(
    @Req() req: any,
    @Body() dto: AlterarSenhaDto,
  ) {
    return this.usersService.alterarSenha(
      req.user.id,
      dto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(
    @Param('id') id: string,
  ) {
    return this.usersService.delete(
      Number(id),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getById(
    @Param('id') id: number,
  ) {
    return this.usersService.getById(
      Number(id),
    );
  }
}