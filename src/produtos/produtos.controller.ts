import { Body, Controller, Get, Param, Post, Delete, Put, UploadedFiles, UseInterceptors, 
  UseGuards,Req,BadRequestException, UnauthorizedException} from '@nestjs/common';
import { ProdutosService } from './produtos.service';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {diskStorage} from 'multer';
import { extname } from 'path';



@Controller('produtos')
export class ProdutosController {

  constructor(
    private readonly produtosService: ProdutosService
  ) {}

 @Post()
  @UseGuards(JwtAuthGuard) 
  @UseInterceptors(FilesInterceptor('imagens', 4, {
    storage: diskStorage({
      destination: './uploads/produtos', 
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`);
      }
    })
  }))
  async create(
    @Req() req: Request,
    @Body() body: any,
    @UploadedFiles() files: Express.Multer.File[]
  ) {

    // verificando auth
    const userId = (req as any).user?.id; 
    if(!userId){
      throw new UnauthorizedException("Usuário não está autenticado."); 
    }

    if (!files || files.length === 0) {
      throw new BadRequestException('É obrigatório enviar pelo menos uma imagem do produto.');
    }

    const dto: CreateProdutoDto = {
      lojaId: Number(body.lojaId),
      categoriaId: Number(body.categoriaId),
      nome: body.nome,
      descricao: body.descricao,
      preco: parseFloat(body.preco),
      estoque: Number(body.estoque),
      
      imagens: files.map(file => `/uploads/produtos/${file.filename}`)
    };

    return this.produtosService.create(dto);
  }


  @Get()
  async findAll() {
    return this.produtosService.findAll();
  }

  @Get('melhores-avaliados')
  async melhoresAvaliados() {
    return this.produtosService.melhoresAvaliados();
  }

  @Get('mais-baratos')
  async maisBaratos() {
    return this.produtosService.maisBaratos();
  }

  @Get('recem-adicionados')
  async recemAdicionados() {
    return this.produtosService.recemAdicionados();
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.produtosService.getById(Number(id));
  }

  @Delete(':id')
  async delete(@Param('id') id:string){
    return this.produtosService.delete(Number(id));
  }

  @Put(':id')
  async update(@Param('id') id:string, @Body() data:any){
    return this.produtosService.update(Number(id), data);
  }
}