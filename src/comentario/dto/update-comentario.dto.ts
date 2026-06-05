import { IsString } from 'class-validator';

export class UpdateComentarioDto {

  @IsString()
  conteudo!: string;
}