import { withPageAuthRequired } from "@auth0/nextjs-auth0"
import { SSRPage } from "@lib/next"
import {
  findActiveDomainEnumerationCount,
  findActivePortScanCount,
  findCompanyCount,
  findDomainCount,
  findRecentProbes,
} from "@lib/db"
import StatusCode from "@components/StatusCode"

const Home: SSRPage<typeof getServerSideProps> = ({
  companyCount,
  domainCount,
  activePortScanCount,
  domainEnumerationCount,
  recentProbes,
}) => {
  return (
    <div>
      <div className="py-6 px-8 border-b border-opacity-10">
        <h1 className="text-lg font-black">Welcome Back</h1>
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

      <div>
        <h2 className="py-4 px-8 font-bold bg-gray-800 bg-opacity-30">
          Recent Probes
        </h2>
        <div className="w-full border-t border-opacity-10">
          {recentProbes.map(
            ({ bodySHA, title, serviceDomainName, statusCode, techs }) => (
              <div
                key={bodySHA}
                className="py-4 px-8 w-full border-b border-opacity-10"
              >
                <div className="flex">
                  <StatusCode code={statusCode.toString()} className="mr-2" />
                  <p>{title}</p>
                  {!title && <i className="text-gray-500">No Title</i>}
                  <p className="ml-auto text-gray-500">{serviceDomainName}</p>
                </div>

                <div className="flex flex-wrap mt-2 -ml-2">
                  {techs.map(({ name }) => (
                    <p
                      key={name}
                      className="py-1 px-2 mr-1 text-xs text-primary-200 bg-primary-500 bg-opacity-10 rounded-lg"
                    >
                      {name}
                    </p>
                  ))}

                  {techs.length === 0 && (
                    <p className="py-1 px-2 mr-1 text-xs text-gray-400 bg-gray-700 bg-opacity-10 rounded-lg">
                      No techs detected
                    </p>
                  )}
                </div>
              </div>
            )
          )}
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
    const recentProbes = await findRecentProbes()

    return {
      props: {
        domainCount,
        companyCount,
        domainEnumerationCount,
        activePortScanCount,
        recentProbes: recentProbes.map(
          ({ title, statusCode, serviceDomainName, techs, bodySHA }) => {
            return { title, statusCode, serviceDomainName, techs, bodySHA }
          }
        ),
      },
    }
  },
})
