-- DropForeignKey
ALTER TABLE "Domain" DROP CONSTRAINT "Domain_companyId_fkey";

-- DropForeignKey
ALTER TABLE "Domain" DROP CONSTRAINT "Domain_rootDomainName_fkey";

-- DropForeignKey
ALTER TABLE "Service" DROP CONSTRAINT "Service_domainName_fkey";

-- AddForeignKey
ALTER TABLE "Domain" ADD CONSTRAINT "Domain_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Domain" ADD CONSTRAINT "Domain_rootDomainName_fkey" FOREIGN KEY ("rootDomainName") REFERENCES "Domain"("name") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_domainName_fkey" FOREIGN KEY ("domainName") REFERENCES "Domain"("name") ON DELETE CASCADE ON UPDATE CASCADE;
