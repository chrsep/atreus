/*
  Warnings:

  - You are about to drop the column `probeResponseBodySHA` on the `Tech` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Tech" DROP CONSTRAINT "Tech_probeResponseBodySHA_fkey";

-- AlterTable
ALTER TABLE "Tech" DROP COLUMN "probeResponseBodySHA";

-- CreateTable
CREATE TABLE "_ProbeResponseToTech" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ProbeResponseToTech_AB_unique" ON "_ProbeResponseToTech"("A", "B");

-- CreateIndex
CREATE INDEX "_ProbeResponseToTech_B_index" ON "_ProbeResponseToTech"("B");

-- AddForeignKey
ALTER TABLE "_ProbeResponseToTech" ADD FOREIGN KEY ("A") REFERENCES "ProbeResponse"("bodySHA") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProbeResponseToTech" ADD FOREIGN KEY ("B") REFERENCES "Tech"("name") ON DELETE CASCADE ON UPDATE CASCADE;
