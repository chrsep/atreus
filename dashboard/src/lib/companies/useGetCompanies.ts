import useSWR from "swr"

const useGetCompanies = () => {
  return useSWR<Array<{ id: string; name: string }>>("/api/companies")
}

export default useGetCompanies
