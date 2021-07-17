import { Company, RootDomain } from "@prisma/client"

export type CompanyWithRootDomains = Company & { rootDomains: RootDomain[] }
