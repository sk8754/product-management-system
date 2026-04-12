/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Stored` table. All the data in the column will be lost.
  - You are about to drop the column `currentStored` on the `Stored` table. All the data in the column will be lost.
  - You are about to drop the column `minimumStored` on the `Stored` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `Stored` table. All the data in the column will be lost.
  - You are about to drop the column `productName` on the `Stored` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Stored` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[product_id]` on the table `Stored` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `current_stored` to the `Stored` table without a default value. This is not possible if the table is not empty.
  - Added the required column `minimum_stored` to the `Stored` table without a default value. This is not possible if the table is not empty.
  - Added the required column `product_id` to the `Stored` table without a default value. This is not possible if the table is not empty.
  - Added the required column `product_name` to the `Stored` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Stored` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Stored_productId_key";

-- AlterTable
ALTER TABLE "Stored" DROP COLUMN "createdAt",
DROP COLUMN "currentStored",
DROP COLUMN "minimumStored",
DROP COLUMN "productId",
DROP COLUMN "productName",
DROP COLUMN "updatedAt",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "current_stored" INTEGER NOT NULL,
ADD COLUMN     "minimum_stored" INTEGER NOT NULL,
ADD COLUMN     "product_id" TEXT NOT NULL,
ADD COLUMN     "product_name" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Stored_product_id_key" ON "Stored"("product_id");
