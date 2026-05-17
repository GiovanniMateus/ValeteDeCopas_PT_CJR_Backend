import { Injectable } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import { CreateLojasDto } from "./dto/create-lojas.dto";
import { UpdateLojaDto } from "./dto/update-lojas.dto";

@Injectable()
export class LojasService {
    constructor(private prisma: PrismaService) {}

    async create(data: CreateLojasDto) {
        return await this.prisma.loja.create({
            data,
        });
    }

    async findAll() {
        return await this.prisma.loja.findMany();
    }

    async getById(id: number) {
        const loja = await this.prisma.loja.findUnique({
            where: {
                id,
            },
        });
        if (!loja) {
            throw new Error("Loja not found");
        }
        return loja;
    }

    async update(id: number, data: UpdateLojaDto) {
    return this.prisma.loja.update({
        where: { id },
        data,
    });
    }

    async delete(id: number) {

    return this.prisma.loja.delete({
      where: { id },
    });
  }
}