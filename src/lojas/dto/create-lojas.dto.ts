import {IsInt, IsString} from "class-validator";

export class CreateLojasDto {
    @IsInt()
    userId!: number;

    @IsString()
    nome!: string;

    @IsString()
    descricao!: string;

    @IsString()
    logoUrl!: string;

    @IsString()
    bannerUrl!: string;

    @IsString()
    stickerUrl!: string;

}
