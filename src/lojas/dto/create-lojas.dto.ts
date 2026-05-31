import {IsInt, IsString, IsOptional} from "class-validator";

export class CreateLojasDto {
    @IsInt()
    userId!: number;

    @IsInt()
    categoriaId!: number;

    @IsString()
    nome!: string;

    
    @IsString()
    descricao!: string;

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
