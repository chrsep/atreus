import useSWR, { mutate } from "swr"
import { CompanyWithRootDomains } from "@lib/model"

export const useGetCompanies = () => {
  return useSWR<Array<CompanyWithRootDomains>>("/api/companies")
}

export const useGetCompanyById = (
  id: number,
  company: CompanyWithRootDomains
) => {
  return useSWR<CompanyWithRootDomains>(`/api/companies/${id}`, {
    initialData: company,
  })
}

export const mutateApi = async (
  url: string,
  data?: unknown,
  shouldRevalidate?: boolean
) => {
  await mutate(`/api${url}`, data, shouldRevalidate)
}
