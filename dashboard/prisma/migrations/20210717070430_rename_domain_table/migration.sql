/*
  Warnings:

  - You are about to drop the `Domain` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Scope` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Domain" DROP CONSTRAINT "Domain_companyId_fkey";

-- DropForeignKey
ALTER TABLE "Scope" DROP CONSTRAINT "Scope_companyId_fkey";

-- DropTable
DROP TABLE "Domain";

-- DropTable
DROP TABLE "Scope";

-- CreateTable
CREATE TABLE "RootDomain" (
    "domain" TEXT NOT NULL,
    "companyId" INTEGER NOT NULL,

    PRIMARY KEY ("domain")
);

-- CreateTable
CREATE TABLE "Subdomain" (
    "name" TEXT NOT NULL,
    "companyId" INTEGER NOT NULL,

    PRIMARY KEY ("name")
);

-- AddForeignKey
ALTER TABLE "RootDomain" ADD FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subdomain" ADD FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
