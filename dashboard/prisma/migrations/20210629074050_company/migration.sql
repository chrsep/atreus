-- CreateTable
CREATE TABLE "Company" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Scope" (
    "pattern" TEXT NOT NULL,
    "companyId" INTEGER NOT NULL,

    PRIMARY KEY ("pattern")
);

-- CreateTable
CREATE TABLE "Domain" (
    "name" TEXT NOT NULL,
    "companyId" INTEGER NOT NULL,

    PRIMARY KEY ("name")
);

-- AddForeignKey
ALTER TABLE "Scope" ADD FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Domain" ADD FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
