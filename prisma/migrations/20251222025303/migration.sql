-- CreateTable
CREATE TABLE "Stored" (
    "id" SERIAL NOT NULL,
    "product_id" TEXT NOT NULL,
    "product_name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "current_stored" INTEGER NOT NULL,
    "minimum_stored" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Stored_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Stored_product_id_key" ON "Stored"("product_id");

-- CreateIndex
CREATE UNIQUE INDEX "Stored_category_key" ON "Stored"("category");
