import prisma from "@lib/prisma"

export const findAllCompanies = async () => {
  return prisma.company.findMany()
}

export const insertNewCompany = async (name: string, scopes: string[]) => {
  return prisma.company.create({
    data: {
      name,
      scopes: {
        createMany: {
          data: scopes.map((scope) => ({ domain: scope })),
        },
      },
    },
  })
}
