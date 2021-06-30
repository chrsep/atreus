import prisma from "@lib/prisma"

export const findAllCompanies = async () => {
  return prisma.company.findMany()
}
