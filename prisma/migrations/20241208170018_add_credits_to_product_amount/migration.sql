-- AlterTable
ALTER TABLE "ProductAmount" ADD COLUMN     "credits" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "listingAmount" SET DEFAULT 0,
ALTER COLUMN "ruleAmount" SET DEFAULT 0;