import { IsInt, IsNumber, IsString } from "class-validator";

export class CreateProdutoDto {

  @IsInt()
  lojaId!: number;

  @IsInt()
  categoriaId!: number;

  @IsString()
  nome!: string;

  @IsString()
  descricao!: string;

  @IsNumber()
  preco!: number;

  @IsInt()
  estoque!: number;
}