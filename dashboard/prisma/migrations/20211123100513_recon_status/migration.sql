-- CreateEnum
CREATE TYPE "ReconStatus" AS ENUM ('SCANNING', 'IDLE');

-- AlterTable
ALTER TABLE "Domain" ADD COLUMN     "domainEnumerationStatus" "ReconStatus" NOT NULL DEFAULT E'IDLE',
ADD COLUMN     "portScanStatus" "ReconStatus" NOT NULL DEFAULT E'IDLE';
