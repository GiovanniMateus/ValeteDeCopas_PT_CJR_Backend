/*
  Warnings:

  - You are about to drop the column `categoriaPaiId` on the `Categoria` table. All the data in the column will be lost.
  - You are about to drop the column `categoriaId` on the `Produto` table. All the data in the column will be lost.
  - Added the required column `subcategoriaId` to the `Produto` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Categoria" DROP CONSTRAINT "Categoria_categoriaPaiId_fkey";

-- DropForeignKey
ALTER TABLE "Produto" DROP CONSTRAINT "Produto_categoriaId_fkey";

-- AlterTable
ALTER TABLE "Categoria" DROP COLUMN "categoriaPaiId";

-- AlterTable
ALTER TABLE "Produto" DROP COLUMN "categoriaId",
ADD COLUMN     "subcategoriaId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Subcategoria" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "categoriaId" INTEGER NOT NULL,

    CONSTRAINT "Subcategoria_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Subcategoria" ADD CONSTRAINT "Subcategoria_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "Categoria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Produto" ADD CONSTRAINT "Produto_subcategoriaId_fkey" FOREIGN KEY ("subcategoriaId") REFERENCES "Subcategoria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
