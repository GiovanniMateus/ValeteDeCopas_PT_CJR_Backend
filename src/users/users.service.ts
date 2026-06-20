import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from '../database/prisma.service';
import { UpdateUserDto } from './dto/update.user.dto';
import { AlterarSenhaDto } from './dto/alterar-senha.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {

  async alterarSenha(
    id: number,
    dto: AlterarSenhaDto,
  ) {

  const user = 
    await this.prisma.user.findUnique({
      where: {id},
    });

  if (!user) {
    throw new NotFoundException(
      'Usuário não encontrado'
    );
  }

  const senhaCorreta = 
    await bcrypt.compare(
      dto.senhaAtual,
      user.senhaHash,
    );

  if (!senhaCorreta) {
    throw new BadRequestException(
      'Senha atual incorreta'
    );
  }

  if (dto.novaSenha === dto.senhaAtual) {
    throw new BadRequestException(
      'A nova senha deve ser diferente da senha atual'
    );
  }

  if (
    dto.novaSenha !== dto.confirmarSenha
  ) {
    throw new BadRequestException(
      'As senhas não coincidem'
    );
  }

  const novaSenhaHash = 
    await bcrypt.hash(
      dto.novaSenha,
      10,
    );

  await this.prisma.user.update({
    where: {
      id,
    },
    data: {
      senhaHash: novaSenhaHash,
    },
  });

  return {
    message: 'Senha alterada com sucesso',
    };
  }

  constructor (private prisma : PrismaService){}

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.senhaHash, 10);

    const user = await this.prisma.user.create({
      data: {
        ...createUserDto,
        senhaHash: hashedPassword,
      },
    });

    const{senhaHash, ...userWithoutPassword}= user;
    return userWithoutPassword;
  }

  async findAll() {
    return await this.prisma.user.findMany({
      select: {
        id: true,
        username: true,
        nome: true,
        email: true,
        fotoPerfilUrl: true,
        createdAt: true,
        updatedAt: true,
      },
      
    });
  }

  async update(
    id: number, 
    data: UpdateUserDto
  ) {

    const UserExists = 
      await this.prisma.user.findUnique({
        where: {id},
      });

    if (!UserExists){
      throw new NotFoundException('Usuário não encontrado');
    }

    delete data.senhaHash;

    return await this.prisma.user.update({
      data,
      where: {id},
      select: {
        id: true,
        username: true,
        nome: true,
        email: true,
        fotoPerfilUrl: true,
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
      throw new NotFoundException('Usuário não encontrado, não foi possível deletar');
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
        fotoPerfilUrl: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!UserExists){
      throw new NotFoundException('Usuário não encontrado');
    }
    return UserExists;

  }
}