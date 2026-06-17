
// vai receber o email do user

import { IsEmail } from 'class-validator';

export class EsqueciSenhaDto {
  @IsEmail()
  email!: string;
}