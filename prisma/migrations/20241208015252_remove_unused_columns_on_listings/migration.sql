/*
  Warnings:

  - You are about to drop the column `file_path` on the `Listing` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Listing` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Listing" DROP COLUMN "file_path",
DROP COLUMN "status";
