/*
  Warnings:

  - You are about to drop the column `ip` on the `Domain` table. All the data in the column will be lost.
  - The primary key for the `Service` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Service` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Domain" DROP COLUMN "ip";

-- AlterTable
ALTER TABLE "Service" DROP CONSTRAINT "Service_pkey",
DROP COLUMN "id",
ADD COLUMN     "aRecords" TEXT[],
ADD COLUMN     "cnameRecords" TEXT[],
ADD CONSTRAINT "Service_pkey" PRIMARY KEY ("port", "domainName");

-- CreateTable
CREATE TABLE "ProbeResponse" (
    "bodySHA" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "host" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "scheme" TEXT NOT NULL,
    "webserver" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "header" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "statusCode" INTEGER NOT NULL,
    "contentType" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "responseTime" TEXT NOT NULL,
    "servicePort" INTEGER NOT NULL,
    "serviceDomainName" TEXT NOT NULL,

    CONSTRAINT "ProbeResponse_pkey" PRIMARY KEY ("bodySHA")
);

-- CreateTable
CREATE TABLE "Tech" (
    "name" TEXT NOT NULL,
    "probeResponseBodySHA" TEXT,

    CONSTRAINT "Tech_pkey" PRIMARY KEY ("name")
);

-- AddForeignKey
ALTER TABLE "ProbeResponse" ADD CONSTRAINT "ProbeResponse_servicePort_serviceDomainName_fkey" FOREIGN KEY ("servicePort", "serviceDomainName") REFERENCES "Service"("port", "domainName") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tech" ADD CONSTRAINT "Tech_probeResponseBodySHA_fkey" FOREIGN KEY ("probeResponseBodySHA") REFERENCES "ProbeResponse"("bodySHA") ON DELETE SET NULL ON UPDATE CASCADE;
