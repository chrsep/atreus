import prisma from "@lib/prisma"
import { Company } from "@prisma/client"

export const findAllCompanies = async () => {
  return prisma.company.findMany({
    orderBy: {
      name: "asc",
    },
    include: {
      rootDomains: {
        where: {
          confirmed: true,
        },
      },
    },
  })
}

export const insertNewCompany = async (name: string, rootDomains: string[]) => {
  return prisma.company.create({
    data: {
      name,
      rootDomains: {
        createMany: {
          data: rootDomains.map((domain) => ({ domain, confirmed: true })),
        },
      },
    },
  })
}

export const findCompanyById = async (id: number) => {
  return prisma.company.findUnique({
    where: { id },
    include: {
      rootDomains: true,
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

export const addRootDomainsByCompanyId = async (
  companyId: number,
  rootDomains: string[]
) => {
  return prisma.company.update({
    where: { id: companyId },
    include: {
      rootDomains: true,
    },
    data: {
      rootDomains: {
        createMany: {
          data: rootDomains.map((domain) => ({ domain, confirmed: true })),
        },
      },
    },
  })
}

export const deleteRootDomain = async (domain: string) => {
  return prisma.rootDomain.delete({
    where: { domain },
  })
}

export const findRootDomainById = async (domain: string) => {
  return prisma.rootDomain.findUnique({
    where: { domain },
    include: {
      subDomains: {
        include: {
          ipAddresses: true,
        },
      },
    },
  })
}

export const updateRootDomain = async (domain: string, confirmed: boolean) => {
  return prisma.rootDomain.update({
    where: { domain },
    data: { confirmed },
  })
}
