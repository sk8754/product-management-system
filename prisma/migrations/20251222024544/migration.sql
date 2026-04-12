/*
  Warnings:

  - Added the required column `productName` to the `Stored` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Stored" ADD COLUMN     "productName" TEXT NOT NULL;
