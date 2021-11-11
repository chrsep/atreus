import React, { FC } from "react"
import { withPageAuthRequired } from "@auth0/nextjs-auth0"
import { InferGetServerSidePropsType } from "next"
import { findCompanyById, findUnconfirmedRootDomainsByCompanyId } from "@lib/db"
import Button from "@components/Button"
import Icon from "@components/Icon"
import { CompanyWithRootDomains } from "@lib/model"
import { patch } from "@lib/api"
import CompanyLayout from "../../../layout/company-layout"

const CompanyProfile: FC<
  InferGetServerSidePropsType<typeof getServerSideProps> & {
    company: CompanyWithRootDomains
  }
> = ({ rootDomains, company }) => {
  const handleConfirm = async (domain: string) => {
    await patch(`/root-domains/${encodeURIComponent(domain)}`, {
      confirmed: true,
    })
  }

  return (
    <CompanyLayout companyId={company.id} company={company}>
      {rootDomains.map((rootDomain) => (
        <div key={rootDomain.domain}>
          <div className="flex items-center py-2 px-6 border-b border-opacity-5">
            <p className="mr-auto">{rootDomain.domain}</p>

            <Button
              variant="outline"
              onClick={() => handleConfirm(rootDomain.domain)}
            >
              <Icon src="/icons/Check-light.svg" className="mr-1" />
              Confirm
            </Button>
          </div>
        </div>
      ))}
    </CompanyLayout>
  )
}

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(ctx) {
    const companyId = parseInt(ctx.query.companyId as string, 10)
    const company = await findCompanyById(companyId)

    if (company === null) {
      return { notFound: true }
    }

    const rootDomains = await findUnconfirmedRootDomainsByCompanyId(companyId)

    return {
      props: {
        company,
        rootDomains: rootDomains.map((domain) => ({
          domain: domain.domain,
        })),
      },
    }
  },
})

export default CompanyProfile
