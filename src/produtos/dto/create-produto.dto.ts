import { IsArray, IsInt, IsNumber, IsOptional, IsString } from "class-validator";
import { execArgv } from "process";

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

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  imagens?: string[];

}