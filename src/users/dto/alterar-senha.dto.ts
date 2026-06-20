import {
  IsString,
  MinLength
} from 'class-validator';

export class AlterarSenhaDto {

  @IsString()
  senhaAtual!: string;

  @IsString()
  @MinLength(6)
  novaSenha!: string;

  @IsString()
  @MinLength(6)
  confirmarSenha!: string;
}