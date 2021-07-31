import useSWR from "swr"
import { CompanyWithRootDomains } from "@lib/model"

export const useGetCompanies = () => {
  return useSWR<Array<{ id: number; name: string }>>("/api/companies")
}

export const useGetCompanyById = (
  id: number,
  company: CompanyWithRootDomains
) =>
  useSWR<CompanyWithRootDomains>(`/api/companies/${id}`, {
    initialData: company,
  })
