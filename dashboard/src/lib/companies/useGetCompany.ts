import useSWR from "swr"
import { CompanyWithRootDomains } from "@lib/model"

const useGetCompanyById = (id: number, company: CompanyWithRootDomains) =>
  useSWR<CompanyWithRootDomains>(`/api/companies/${id}`, {
    initialData: company,
  })

export default useGetCompanyById
