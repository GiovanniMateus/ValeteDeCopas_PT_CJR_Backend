import { Injectable, UnauthorizedException, BadRequestException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../database/prisma.service';
import { LoginDto } from './dto/login.dto';
import { EsqueciSenhaDto } from './dto/esqueci-senha.dto';
import { RedefinirSenhaDto } from './dto/redefinir-senha.dto';
import { EmailService } from '../email/email.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: loginDto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Email ou senha inválidos');
    }

    const senhaCorreta = await bcrypt.compare(loginDto.senha, user.senhaHash);

    if (!senhaCorreta) {
      throw new UnauthorizedException('Email ou senha inválidos');
    }

    const payload = { sub: user.id, email: user.email };

    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        username: user.username,
      },
    };
  }

  
  // fluxo de recuperacao da senha
  async esqueciSenha(dto: EsqueciSenhaDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      return {
        message: 'se o email estiver cadastrado, um link de recuperação foi enviado',
      };
    }

    //  string aleatoria para servir de token
    const token = crypto.randomBytes(32).toString('hex');


    // tempo de expiracao de 1 hora
    const expira = new Date(Date.now() + 60 * 60 * 1000);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: token,
        resetPasswordExpires: expira,
      },
    });

    await this.emailService.enviarEmailRecuperacaoSenha(user.email, token);

    return {
      message: 'se o email existir no banco, um link de recuperação foi enviado.',
    };
  }


  
  //  fluxo redefinir uma senha
  async redefinirSenha(dto: RedefinirSenhaDto) {
    const user = await this.prisma.user.findUnique({
      where: { resetPasswordToken: dto.token },
    });

    if (!user) {
      throw new BadRequestException('Token inválido ou já utilizado');
    }


    if (!user.resetPasswordExpires || user.resetPasswordExpires < new Date()) {
      throw new BadRequestException('Token expirado. Solicite a recuperação novamente.');
    }

    const novaSenhaHash = await bcrypt.hash(dto.novaSenha, 10);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        senhaHash: novaSenhaHash,
        // vai invalidar o token para que nao seja reutilizado
        resetPasswordToken: null,
        resetPasswordExpires: null,
      },
    });

    return { message: 'Senha alterada com sucesso' };
  }
}