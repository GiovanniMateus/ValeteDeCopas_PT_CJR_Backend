import {
  IsInt,
  IsString,
  Min,
  Max,
} from 'class-validator';

export class CreateAvaliacaoLojaDto {

  @IsInt()
  userId!: number;

  @IsInt()
  lojaId!: number;

  @IsInt()
  @Min(1)
  @Max(5)
  nota!: number;

  @IsString()
  comentario!: string;
}