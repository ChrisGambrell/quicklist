/*
  Warnings:

  - Added the required column `userId` to the `Listing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Rule` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Listing" ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Rule" ADD COLUMN     "userId" TEXT NOT NULL,
ALTER COLUMN "rule" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Subscription" ADD COLUMN     "status" "SubscriptionStatus";

-- CreateTable
CREATE TABLE "ProductAmount" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "credits" INTEGER NOT NULL DEFAULT 0,
    "listingAmount" INTEGER NOT NULL DEFAULT 0,
    "ruleAmount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ProductAmount_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Listing" ADD CONSTRAINT "Listing_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rule" ADD CONSTRAINT "Rule_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductAmount" ADD CONSTRAINT "ProductAmount_id_fkey" FOREIGN KEY ("id") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
