import { FC } from "react"
import { withPageAuthRequired } from "@auth0/nextjs-auth0"
import { InferGetServerSidePropsType } from "next"
import { findCompanyById } from "@lib/db"
import type { Company } from "@prisma/client"

const CompanyProfile: FC<
  InferGetServerSidePropsType<typeof getServerSideProps> & {
    company: Company
  }
> = ({ company }) => {
  return (
    <div className="border-b border-opacity-10 w-full">
      <h1 className="m-6 ">{company.name}</h1>
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
