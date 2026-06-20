import {
  IsInt,
  IsOptional,
  IsString,
  Min,
  Max,
} from 'class-validator';

export class UpdateAvaliacaoLojaDto {

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  nota?: number;

  @IsOptional()
  @IsString()
  comentario?: string;
}