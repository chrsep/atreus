import { FC, useState } from "react"
import { withPageAuthRequired } from "@auth0/nextjs-auth0"
import { InferGetServerSidePropsType } from "next"
import { findCompanyById } from "@lib/db"
import type { Company, Scope } from "@prisma/client"
import Button from "@components/Button"
import Icon from "@components/Icon"
import EditCompanyDialog from "@components/EditCompanyDialog"
import useGetCompanyById from "@lib/companies/useGetCompany"
import AddScopeDialog from "@components/AddScopeDialog"

const CompanyProfile: FC<
  InferGetServerSidePropsType<typeof getServerSideProps> & {
    company: Company & { scopes: Scope[] }
  }
> = ({ company }) => {
  const { data } = useGetCompanyById(company.id, company)
  const [editCompany, setEditCompany] = useState(false)
  const [addScope, setAddScope] = useState(false)

  return (
    <div>
      <div className="flex items-center border-b border-opacity-10 w-full">
        <h1 className="m-6">{data?.name}</h1>

        <Button
          variant="outline"
          className="ml-auto mr-3 !p-2"
          onClick={() => setAddScope(true)}
        >
          <Icon src="/icons/Streaming-White.svg" className="mr-2" />
          Add scopes
        </Button>

        <Button
          variant="outline"
          className="mr-6 !p-2"
          onClick={() => setEditCompany(true)}
        >
          <Icon src="/icons/Edit-White.svg" />
        </Button>

        {data && (
          <EditCompanyDialog
            open={editCompany}
            setOpen={setEditCompany}
            company={data}
          />
        )}

        {data && (
          <AddScopeDialog
            open={addScope}
            setOpen={setAddScope}
            companyId={company.id}
          />
        )}
      </div>

      {data?.scopes.map((scope) => (
        <div key={scope.domain}>
          <div className="px-6 py-3 dark:bg-dark-bg-800 border-b border-opacity-5">
            <p>{scope.domain}</p>
          </div>
          <p className="px-6 py-3 border-b border-opacity-10">
            no domain found
          </p>
        </div>
      ))}
    </div>
  )
}

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(ctx) {
    const { companyId } = ctx.query
    const company = await findCompanyById(parseInt(companyId as string, 10))

    return {
      props: {
        company,
      },
    }
  },
})

export default CompanyProfile
