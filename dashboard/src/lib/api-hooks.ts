import useSWR, { mutate } from "swr"
import {
  CompanyWithRootDomains,
  RootDomainWithSubdomainsAndIp,
} from "@lib/model"

export const useGetCompanies = () => {
  return useSWR<Array<CompanyWithRootDomains>>("/api/companies")
}

export const useGetCompanyById = (
  id: number,
  company?: CompanyWithRootDomains
) => {
  return useSWR<CompanyWithRootDomains>(`/api/companies/${id}`, {
    initialData: company,
  })
}

export const useGetRootDomain = (rootDomain: string) => {
  return useSWR<RootDomainWithSubdomainsAndIp>(
    `/api/root-domains/${rootDomain}`
  )
}

export const mutateApi = async (
  url: string,
  data?: unknown,
  shouldRevalidate?: boolean
) => {
  await mutate(`/api${url}`, data, shouldRevalidate)
}
