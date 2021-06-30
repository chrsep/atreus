import useSWR from "swr"

const useGetCompanies = () => {
  return useSWR("/api/companies")
}

export default useGetCompanies
