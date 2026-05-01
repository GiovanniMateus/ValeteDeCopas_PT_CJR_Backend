import { IsEmail, IsOptional, IsString, MinLength} from 'class-validator';
export class CreateUserDto {

    @IsString()     // rodrigo: coloquei "!"" depois de nome,email,senha etc , diz pro typescript "confirar q essa propriedade sera dada antes do uso", estava dando erro por isso coloquei.
    username!: string;

    @IsString()
    nome!: string;

    @IsEmail()
    email!: string;

    @IsString()
    @MinLength(6)
    senha_hash!: string; 

    @IsOptional()
    @IsString()
    foto_perfil_url?: string;
}


