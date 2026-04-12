/*
  Warnings:

  - A unique constraint covering the columns `[product_name]` on the table `Stored` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Stored_product_name_key" ON "Stored"("product_name");
