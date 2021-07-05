import prisma from "@lib/prisma"
import { Company } from "@prisma/client"

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

export const findCompanyById = async (id: number) => {
  return prisma.company.findUnique({
    where: { id },
    include: {
      scopes: true,
      domains: true,
    },
  })
}

export const deleteCompanyById = async (id: number) => {
  return prisma.company.delete({
    where: { id },
  })
}

export const patchCompanyById = async (
  companyId: number,
  company: Partial<Omit<Company, "id">>
) => {
  return prisma.company.update({
    data: company,
    where: { id: companyId },
  })
}

export const addScopesToCompanyById = async (
  companyId: number,
  scopes: string[]
) => {
  return prisma.company.update({
    where: { id: companyId },
    include: {
      scopes: true,
      domains: true,
    },
    data: {
      scopes: {
        createMany: {
          data: scopes.map((scope) => ({ domain: scope })),
        },
      },
    },
  })
}
