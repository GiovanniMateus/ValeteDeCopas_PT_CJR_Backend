import { Body, Controller, Get, Param, Post, Put, Delete, UseInterceptors, 
  UploadedFiles, BadRequestException, UseGuards, Req,
  UnauthorizedException, Query } from '@nestjs/common'; 
import { CreateLojasDto } from '../lojas/dto/create-lojas.dto';
import { UpdateLojaDto } from './dto/update-lojas.dto';
import { LojasService } from './lojas.service';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { Request } from 'express';

@Controller('lojas')
export class LojasController {

  constructor(
    private readonly lojasService: LojasService
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'logo', maxCount: 1 },
    { name: 'banner', maxCount: 1 },
    { name: 'sticker', maxCount: 1 },
  ], {
    storage: diskStorage({
      destination: './uploads/lojas',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`);
      }
    })
  }))
  async create(
    @Req() req: Request,
    @Body() body: any,
    @UploadedFiles() files: {
      logo?: Express.Multer.File[],
      banner?: Express.Multer.File[],
      sticker?: Express.Multer.File[]
    }
  ) {
    const userId = (req as any).user?.id;

    if (!userId) {
      throw new UnauthorizedException("Usuário não está autenticado. Token ausente ou inválido");
    }

    if (!body.categoriaId || !body.nome) {
      throw new BadRequestException('Campos obrigatórios ausentes: categoriaId ou nome');
    }

    const lojaData: Partial<CreateLojasDto> = {
      userId: userId,
      categoriaId: Number(body.categoriaId),
      nome: body.nome,
      descricao: body.descricao || '',
    };

    if (files?.logo?.[0]) {
      lojaData.logoUrl = `/uploads/lojas/${files.logo[0].filename}`;
    }
    if (files?.banner?.[0]) {
      lojaData.bannerUrl = `/uploads/lojas/${files.banner[0].filename}`;
    }
    if (files?.sticker?.[0]) {
      lojaData.stickerUrl = `/uploads/lojas/${files.sticker[0].filename}`;
    }

    return this.lojasService.create(lojaData as CreateLojasDto);
  }

 
  @Get()
  async findAll(
    @Query('categoriaId') categoriaId?: string,
    @Query('userId') userId?: string,
  ) {
    return this.lojasService.findAll(
      categoriaId ? Number(categoriaId) : undefined,
      userId ? Number(userId) : undefined,
    );
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