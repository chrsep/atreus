-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "bountyLink" TEXT NOT NULL DEFAULT E'',
ADD COLUMN     "bountyRules" TEXT NOT NULL DEFAULT E'';
