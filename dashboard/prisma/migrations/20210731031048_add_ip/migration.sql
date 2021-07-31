/*
  Warnings:

  - Added the required column `amassTag` to the `SubDomain` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SubDomain" ADD COLUMN     "amassTag" TEXT NOT NULL,
ADD COLUMN     "sources" TEXT[],
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "IpAddress" (
    "subDomainDomain" TEXT NOT NULL,
    "ip" TEXT NOT NULL,
    "cidr" TEXT NOT NULL,
    "asn" INTEGER NOT NULL,
    "desc" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("ip","subDomainDomain")
);

-- AddForeignKey
ALTER TABLE "IpAddress" ADD FOREIGN KEY ("subDomainDomain") REFERENCES "SubDomain"("domain") ON DELETE RESTRICT ON UPDATE CASCADE;
