/*
  Warnings:

  - You are about to drop the column `lastDomainRecon` on the `Domain` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Domain" DROP COLUMN "lastDomainRecon",
ADD COLUMN     "lastDomainEnumeration" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
