import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from '../database/prisma.service';
import { UpdateUserDto } from './dto/update.user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {

  constructor (private prisma : PrismaService){}

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.senha_hash, 10);

    const user = await this.prisma.user.create({
      data: {
        ...createUserDto,
        senha_hash: hashedPassword,
      },
    });

    const{senha_hash, ...userWithoutPassword}= user;
    return userWithoutPassword;
  }

  async findAll() {
    return await this.prisma.user.findMany({
      select: {
        id: true,
        username: true,
        nome: true,
        email: true,
        foto_perfil_url: true,
        createdAt: true,
        updatedAt: true,
      },
      
    });
  }

  async update(id: number, data: UpdateUserDto) {
    const UserExists = await this.prisma.user.findUnique({
      where: {
        id,
      }
    });
    if (!UserExists){
      throw new Error('User não encontrado');
    }

    if (data.senha_hash) {
      data.senha_hash = await bcrypt.hash(data.senha_hash, 10);
    }

    return await this.prisma.user.update({
      data,
      where: {
        id,
      },
      select: {
        id: true,
        username: true,
        nome: true,
        email: true,
        foto_perfil_url: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async delete(id: number) {
    const UserExists = await this.prisma.user.findUnique({
      where: {
        id,
      }
    });

    if (!UserExists){
      throw new Error('User não encontrado, não foi possível deletar');
    }
    return await this.prisma.user.delete({
      where: {
        id,
      }
    });   
  }

  async getById(id: number){
    const UserExists = await this.prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        username: true,
        nome: true,
        email: true,
        foto_perfil_url: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!UserExists){
      throw new Error('User não encontrado');
    }
    return UserExists;

  }




}

