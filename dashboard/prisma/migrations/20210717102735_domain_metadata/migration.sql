/*
  Warnings:

  - The primary key for the `SubDomain` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `companyId` on the `SubDomain` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `SubDomain` table. All the data in the column will be lost.
  - Added the required column `domain` to the `SubDomain` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rootDomainDomain` to the `SubDomain` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "SubDomain" DROP CONSTRAINT "SubDomain_companyId_fkey";

-- AlterTable
ALTER TABLE "RootDomain" ADD COLUMN     "confirmed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "SubDomain" DROP CONSTRAINT "SubDomain_pkey",
DROP COLUMN "companyId",
DROP COLUMN "name",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "domain" TEXT NOT NULL,
ADD COLUMN     "rootDomainDomain" TEXT NOT NULL,
ADD PRIMARY KEY ("domain");

-- AddForeignKey
ALTER TABLE "SubDomain" ADD FOREIGN KEY ("rootDomainDomain") REFERENCES "RootDomain"("domain") ON DELETE CASCADE ON UPDATE CASCADE;
