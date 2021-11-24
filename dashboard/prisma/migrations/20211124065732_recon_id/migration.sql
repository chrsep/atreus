/*
  Warnings:

  - You are about to drop the column `domainEnumerationStatus` on the `Domain` table. All the data in the column will be lost.
  - You are about to drop the column `portScanStatus` on the `Domain` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Domain" DROP COLUMN "domainEnumerationStatus",
DROP COLUMN "portScanStatus",
ADD COLUMN     "domainEnumerationID" TEXT,
ADD COLUMN     "portScanID" TEXT;

-- DropEnum
DROP TYPE "ReconStatus";
