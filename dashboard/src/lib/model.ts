import { Company, Domain } from "@prisma/client"

export type CompanyWithRootDomains = Company & { domains: Domain[] }

export type RootDomainWithSubdomainsAndIp = Domain & {
  subDomains: Domain
}
