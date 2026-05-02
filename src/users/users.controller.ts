import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() data: CreateUserDto) {
    return this.usersService.create(data);
  }

  @Get()
  async findAll() {
    return this.usersService.findAll();
  }

  @Put(":id")
  async update(@Param("id") id: number, @Body() data:CreateUserDto) {
    return this.usersService.update(Number(id), data);
  }

  @Delete(":id")
  async delete(@Param("id") id: string) {
    return this.usersService.delete(Number(id));
  }
  @Get(':id')
  async getById(@Param("id") id:number){
    return this.usersService.getById(Number(id));
  }
}
