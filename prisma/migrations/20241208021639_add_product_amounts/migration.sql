-- CreateTable
CREATE TABLE "ProductAmount" (
    "productId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "listingAmount" INTEGER NOT NULL,
    "ruleAmount" INTEGER NOT NULL,

    CONSTRAINT "ProductAmount_pkey" PRIMARY KEY ("productId")
);

-- AddForeignKey
ALTER TABLE "ProductAmount" ADD CONSTRAINT "ProductAmount_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
