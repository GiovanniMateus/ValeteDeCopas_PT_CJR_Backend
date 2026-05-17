import { Module } from "@nestjs/common";
import { LojasController } from "./lojas.controller";
import { LojasService } from "./lojas.service";
import { PrismaService } from "../database/prisma.service";

@Module({
  controllers: [LojasController],
  providers: [LojasService, PrismaService],
})

export class LojasModule {}