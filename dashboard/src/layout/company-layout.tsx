import FaviconImage from "@components/FaviconImage"
import Button from "@components/Button"
import Icon from "@components/Icon"
import EditCompanyDialog from "@components/EditCompanyDialog"
import AddRootDomainDialog from "@components/AddRootDomainDialog"
import React, { FC, useState } from "react"
import { useGetCompanyById } from "@lib/api-hooks"
import clsx from "clsx"
import Link from "next/link"
import { Company } from "@prisma/client"
import { useRouter } from "next/router"

const tabs = (companyId: number) => [
  {
    label: "Confirmed",
    href: `/companies/${companyId}/confirmed-domains`,
  },
  {
    label: "Other",
    href: `/companies/${companyId}/other-domains`,
  },
]

const CompanyLayout: FC<{
  companyId: number
  company?: Company
}> = ({ companyId, company, children }) => {
  const { data } = useGetCompanyById(companyId)
  const [editCompany, setEditCompany] = useState(false)
  const [addRootDomain, setAddRootDomain] = useState(false)

  const showAddDomainDialog = () => setAddRootDomain(true)
  const showEditCompanyDialog = () => setEditCompany(true)

  return (
    <div>
      <div className="flex items-center py-4 pl-6 w-full border-b border-opacity-10">
        {data?.rootDomains && data?.rootDomains?.length > 0 ? (
          <FaviconImage
            altIcon={data.icon}
            domain={data.rootDomains[0].domain}
            className="p-1 mr-4 w-8 h-8 bg-white rounded-lg"
          />
        ) : (
          <div className="mr-4 w-8 h-8 bg-gray-700 rounded-lg" />
        )}
        <h1 className="mr-auto font-bold">{data?.name}</h1>

        {company?.bountyLink && (
          <a href={company.bountyLink} target="_blank" rel="noreferrer">
            <Button variant="secondary" className="!p-2 mr-3">
              <Icon src="/icons/Link.svg" className="mr-2" />
              Bounty
            </Button>
          </a>
        )}

        <Button
          variant="outline"
          className="!p-2 mr-3"
          onClick={showAddDomainDialog}
        >
          <Icon src="/icons/Streaming-White.svg" className="mr-2" />
          Add root domains
        </Button>

        <Button
          variant="outline"
          className="!p-2 mr-6"
          onClick={showEditCompanyDialog}
        >
          <Icon src="/icons/Edit-White.svg" />
        </Button>

        {data && (
          <EditCompanyDialog
            key={data.id}
            open={editCompany}
            setOpen={setEditCompany}
            company={data}
          />
        )}

        {data && (
          <AddRootDomainDialog
            open={addRootDomain}
            setOpen={setAddRootDomain}
            companyId={companyId}
          />
        )}
      </div>

      <Tabs companyId={companyId} />

      {children}
    </div>
  )
}

const Tabs: FC<{ companyId: number }> = ({ companyId }) => {
  const router = useRouter()

  return (
    <div className="w-full ">
      <div className="p-2 border-b border-opacity-10">
        <div className="flex p-1 space-x-1 max-w-[200px] bg-primary-100 dark:bg-dark-bg-800 rounded-xl">
          {tabs(companyId).map(({ href, label }) => {
            const selected = router.asPath === href

            return (
              <Link key={label} href={href}>
                <a
                  className={clsx(
                    "py-2 w-full text-xs !font-bold leading-5 text-center text-primary-200 rounded-lg",
                    "focus:ring-2 ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none",
                    selected
                      ? "bg-white dark:bg-dark-bg-700 shadow "
                      : "!text-blue-100 hover:text-white hover:bg-white hover:bg-opacity-10"
                  )}
                >
                  {label}
                </a>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default CompanyLayout
