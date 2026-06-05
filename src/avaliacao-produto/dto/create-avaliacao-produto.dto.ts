import { IsInt, Min, Max, IsString } from 'class-validator';

export class CreateAvaliacaoProdutoDto {

  @IsInt()
  userId!: number;

  @IsInt()
  produtoId!: number;

  @IsInt()
  @Min(1)
  @Max(5)
  nota!: number;

  @IsString()
  comentario!: string;
}