-- CreateTable
CREATE TABLE "Stored" (
    "id" SERIAL NOT NULL,
    "productId" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "currentStored" INTEGER NOT NULL,
    "minimumStored" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Stored_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Stored_productId_key" ON "Stored"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "Stored_category_key" ON "Stored"("category");
