/*
  Warnings:

  - Added the required column `categoriaId` to the `Loja` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Loja" ADD COLUMN     "categoriaId" INTEGER NOT NULL,
ALTER COLUMN "descricao" DROP NOT NULL,
ALTER COLUMN "logoUrl" DROP NOT NULL,
ALTER COLUMN "bannerUrl" DROP NOT NULL,
ALTER COLUMN "stickerUrl" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Loja" ADD CONSTRAINT "Loja_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "Categoria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
