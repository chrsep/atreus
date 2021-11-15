/*
  Warnings:

  - You are about to drop the column `bountyRules` on the `Company` table. All the data in the column will be lost.
  - You are about to drop the `IpAddress` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RootDomain` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SubDomain` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "IpAddress" DROP CONSTRAINT "IpAddress_subDomainDomain_fkey";

-- DropForeignKey
ALTER TABLE "RootDomain" DROP CONSTRAINT "RootDomain_companyId_fkey";

-- DropForeignKey
ALTER TABLE "SubDomain" DROP CONSTRAINT "SubDomain_rootDomainDomain_fkey";

-- AlterTable
ALTER TABLE "Company" DROP COLUMN "bountyRules";

-- DropTable
DROP TABLE "IpAddress";

-- DropTable
DROP TABLE "RootDomain";

-- DropTable
DROP TABLE "SubDomain";

-- CreateTable
CREATE TABLE "Domain" (
    "name" TEXT NOT NULL,
    "ip" TEXT NOT NULL,
    "confirmed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "companyId" INTEGER NOT NULL,
    "rootDomainName" TEXT,

    CONSTRAINT "Domain_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "Service" (
    "id" SERIAL NOT NULL,
    "port" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "domainName" TEXT NOT NULL,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Domain" ADD CONSTRAINT "Domain_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Domain" ADD CONSTRAINT "Domain_rootDomainName_fkey" FOREIGN KEY ("rootDomainName") REFERENCES "Domain"("name") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_domainName_fkey" FOREIGN KEY ("domainName") REFERENCES "Domain"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
