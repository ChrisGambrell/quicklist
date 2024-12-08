-- CreateEnum
CREATE TYPE "ListingStatus" AS ENUM ('draft', 'published');

-- CreateTable
CREATE TABLE "Listing" (
    "id" TEXT NOT NULL,
    "file_path" TEXT,
    "title" TEXT,
    "desc" TEXT,
    "price" DOUBLE PRECISION,
    "status" "ListingStatus" NOT NULL DEFAULT 'draft',

    CONSTRAINT "Listing_pkey" PRIMARY KEY ("id")
);
