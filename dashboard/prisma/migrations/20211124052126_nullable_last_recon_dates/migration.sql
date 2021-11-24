-- AlterTable
ALTER TABLE "Domain" ALTER COLUMN "lastPortScan" DROP NOT NULL,
ALTER COLUMN "lastPortScan" DROP DEFAULT,
ALTER COLUMN "lastDomainEnumeration" DROP NOT NULL,
ALTER COLUMN "lastDomainEnumeration" DROP DEFAULT;
UPDATE "Domain" SET "lastPortScan" = NULL, "lastDomainEnumeration" = NULL;

