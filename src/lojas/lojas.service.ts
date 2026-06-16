import { Injectable } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import { CreateLojasDto } from "./dto/create-lojas.dto";
import { UpdateLojaDto } from "./dto/update-lojas.dto";

import { unlink } from 'fs/promises'; 
import { join } from 'path';

@Injectable()
export class LojasService {
    constructor(private prisma: PrismaService) {}

    async create(data: CreateLojasDto) {
        return await this.prisma.loja.create({
            data,
        });
    }


    async findAll(categoriaId?: number, userId?: number) {
        return await this.prisma.loja.findMany({
            where: {
                ...(categoriaId && { categoriaId }),
                ...(userId && { userId }),
            },
            include: {
                categoria: true,
            },
        });
    }

    async getById(id: number) {
        const loja = await this.prisma.loja.findUnique({
            where: { id },
            include: {
                categoria: true,
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
        // busca loja com produtos 
        const loja = await this.prisma.loja.findUnique({
            where: { id },
            include: {
                produtos: {
                    include: { imagens: true }
                }
            }
        });

        if (!loja) {
            throw new Error("Loja not found");
        }

        const imagensLoja = [loja.logoUrl, loja.bannerUrl, loja.stickerUrl].filter(Boolean);
        const imagensProdutos = loja.produtos.flatMap(p => p.imagens.map(i => i.urlImagem));

        // deleta imagens 
        for (const url of imagensLoja) {
            if (typeof url === 'string') {
                try {
                    const nomeArquivo = url.replace('/uploads/lojas/', '');
                    const caminhoFisico = join(process.cwd(), 'uploads', 'lojas', nomeArquivo);
                    await unlink(caminhoFisico);
                } catch (error) {
                    console.warn(`[Aviso] Imagem da loja não encontrada: ${url}`);
                }
            }
        }

        //  Deleta imagens de produtos
        for (const url of imagensProdutos) {
            if (typeof url === 'string') {
                
                try {
                    const nomeArquivo = url.replace('/uploads/produtos/', '');
                    const caminhoFisico = join(process.cwd(), 'uploads', 'produtos', nomeArquivo);
                    await unlink(caminhoFisico);
                } catch (error) {
                    console.warn(`[Aviso] Imagem do produto não encontrada: ${url}`);
                }
            }
        }

        
        return await this.prisma.$transaction(async (tx) => {
            const produtoIds = loja.produtos.map(p => p.id);

            // apagando os produtos:
            if (produtoIds.length > 0) {
                

                // pega os id das avaliações dos produtos para apagar os comentários delas
                const avaliacoesProduto = await tx.avaliacaoProduto.findMany({
                    where: { produtoId: { in: produtoIds } }
                });
                const avaliacaoProdutoIds = avaliacoesProduto.map(a => a.id);


                if (avaliacaoProdutoIds.length > 0) {
                    await tx.comentarioAvaliacao.deleteMany({
                        where: { avaliacaoProdutoId: { in: avaliacaoProdutoIds } }
                    });
                }

                // deleta as avaliações dos produtos
                await tx.avaliacaoProduto.deleteMany({
                    where: { produtoId: { in: produtoIds } }
                });

                // deletaando  as urls das imagens dos produtos
                await tx.imagemProduto.deleteMany({
                    where: { produtoId: { in: produtoIds } }
                });



                //  deleta os produtos
                await tx.produto.deleteMany({
                    where: { lojaId: id }
                });
            }

           

            // id das avaliacoes de loja
            const avaliacoesLoja = await tx.avaliacaoLoja.findMany({
                where: { lojaId: id }
            });
            const avaliacaoLojaIds = avaliacoesLoja.map(a => a.id);

            if (avaliacaoLojaIds.length > 0) {
                //  Deleta comentários das avaliações da loja
                await tx.comentarioAvaliacao.deleteMany({
                    where: { avaliacaoLojaId: { in: avaliacaoLojaIds } }
                });
            }

            //  deleta avaliações da loja
            await tx.avaliacaoLoja.deleteMany({
                where: { lojaId: id }
            });


            // deleta a loja
            return await tx.loja.delete({
                where: { id },
            });
        });
    }


}