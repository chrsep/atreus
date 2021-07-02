import useSWR from "swr"

const useGetCompanies = () => {
  return useSWR<Array<{ id: number; name: string }>>("/api/companies")
}

export default useGetCompanies
