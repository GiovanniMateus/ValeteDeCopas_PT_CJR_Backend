

 //  vai receber o token e a nova senha do userr

 import { IsString, MinLength } from 'class-validator';

export class RedefinirSenhaDto {
  @IsString()
  token!: string;
 
  
  @IsString()
  @MinLength(6)
  novaSenha!: string;
}