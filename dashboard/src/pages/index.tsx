import { withPageAuthRequired } from "@auth0/nextjs-auth0"
import { SSRPage } from "@lib/next"
import {
  findActiveDomainEnumerationCount,
  findActivePortScanCount,
  findCompanyCount,
  findDomainCount,
} from "@lib/db"

const Home: SSRPage<typeof getServerSideProps> = ({
  companyCount,
  domainCount,
  activePortScanCount,
  domainEnumerationCount,
}) => {
  return (
    <div>
      <div className="py-6 px-8 border-b border-opacity-10">
        <h1 className="text-lg font-black text-white ">Welcome Back</h1>
      </div>

      <div className="flex border-b border-opacity-10">
        <div className="py-6 px-8 w-1/2 border-r border-opacity-10">
          <h2 className="text-lg font-bold">Monitoring</h2>
          <p className="my-2 text-gray-400">{companyCount} Companies</p>
          <p className="my-2 text-gray-400">{domainCount} Domains</p>
        </div>

        <div className="py-6 px-8 w-1/2">
          <h2 className="text-lg font-bold">Active Scans</h2>
          <p className="my-2 text-gray-400">
            {domainEnumerationCount || "No active"} enumeration
          </p>
          <p className="my-2 text-gray-400">
            {activePortScanCount || "No active"} port scans
          </p>
        </div>
      </div>
    </div>
  )
}

export default Home

export const getServerSideProps = withPageAuthRequired({
  getServerSideProps: async () => {
    const domainCount = await findDomainCount()
    const companyCount = await findCompanyCount()
    const domainEnumerationCount = await findActiveDomainEnumerationCount()
    const activePortScanCount = await findActivePortScanCount()

    return {
      props: {
        domainCount,
        companyCount,
        domainEnumerationCount,
        activePortScanCount,
      },
    }
  },
})
