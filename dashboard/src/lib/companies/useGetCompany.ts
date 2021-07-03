import useSWR from "swr"
import { Company, Scope } from "@prisma/client"

const useGetCompanyById = (
  id: number,
  company: Company & { scopes: Scope[] }
) =>
  useSWR<Company & { scopes: Scope[] }>(`/api/companies/${id}`, {
    initialData: company,
  })

export default useGetCompanyById
