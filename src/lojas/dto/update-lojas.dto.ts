import {
  IsInt,
  IsOptional,
  IsString
} from "class-validator";

export class UpdateLojaDto {

  @IsOptional()
  @IsInt()
  userId?: number;

  @IsOptional()
  @IsString()
  nome?: string;

  @IsOptional()
  @IsString()
  descricao?: string;

  @IsOptional()
  @IsString()
  logoUrl?: string;

  @IsOptional()
  @IsString()
  bannerUrl?: string;

  @IsOptional()
  @IsString()
  stickerUrl?: string;
}