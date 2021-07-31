import { Company, IpAddress, RootDomain, SubDomain } from "@prisma/client"

export type CompanyWithRootDomains = Company & { rootDomains: RootDomain[] }

export type SubDomainWithIpAddress = SubDomain & { addresses: IpAddress[] }

export type RootDomainWithSubdomainsAndIp = RootDomain & {
  subDomains: SubDomainWithIpAddress[]
}
