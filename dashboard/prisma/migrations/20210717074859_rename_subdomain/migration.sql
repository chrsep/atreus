/*
  Warnings:

  - You are about to drop the `Subdomain` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Subdomain" DROP CONSTRAINT "Subdomain_companyId_fkey";

-- DropTable
DROP TABLE "Subdomain";

-- CreateTable
CREATE TABLE "SubDomain" (
    "name" TEXT NOT NULL,
    "companyId" INTEGER NOT NULL,

    PRIMARY KEY ("name")
);

-- AddForeignKey
ALTER TABLE "SubDomain" ADD FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
