import {
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateComentarioDto {

  @IsInt()
  userId!: number;

  @IsOptional()
  @IsInt()
  avaliacaoLojaId?: number;

  @IsOptional()
  @IsInt()
  avaliacaoProdutoId?: number;

  @IsString()
  conteudo!: string;
}