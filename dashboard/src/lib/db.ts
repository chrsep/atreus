import prisma from "@lib/prisma"
import { Company } from "@prisma/client"

export const findAllCompanies = async () => {
  return prisma.company.findMany({
    orderBy: {
      name: "asc",
    },
    include: {
      domains: {
        where: {
          confirmed: true,
        },
      },
    },
  })
}

export const findConfirmedRootDomainsByCompanyId = async (
  companyId: number
) => {
  return prisma.domain.findMany({
    where: {
      companyId,
      confirmed: true,
    },
    include: {
      subDomains: true,
    },
  })
}

export const findUnconfirmedRootDomainsByCompanyId = (companyId: number) => {
  return prisma.domain.findMany({
    where: {
      companyId,
      confirmed: false,
    },
    include: {
      subDomains: true,
    },
  })
}

export const insertNewCompany = async (
  name: string,
  rootDomains: string[],
  bountyLink: string,
  icon: string
) => {
  return prisma.company.create({
    data: {
      name,
      bountyLink,
      icon,
      domains:
        rootDomains.length === 0
          ? undefined
          : {
              createMany: {
                data: rootDomains.map((domain) => ({
                  name: domain,
                  confirmed: true,
                })),
              },
            },
    },
  })
}

export const findCompanyById = async (id: number) => {
  return prisma.company.findUnique({
    where: { id },
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
  return prisma.domain.createMany({
    data: rootDomains.map((domain) => ({
      name: domain,
      confirmed: true,
      companyId,
    })),
  })
}

export const deleteRootDomain = async (domain: string) => {
  return prisma.domain.delete({
    where: { name: domain },
  })
}

export const findRootDomainById = async (domain: string) => {
  return prisma.domain.findUnique({
    where: { name: domain },
    include: {
      subDomains: {
        orderBy: {
          updatedAt: "desc",
        },
      },
    },
  })
}

export const updateRootDomain = async (domain: string, confirmed: boolean) => {
  return prisma.domain.update({
    where: { name: domain },
    data: { confirmed },
  })
}
