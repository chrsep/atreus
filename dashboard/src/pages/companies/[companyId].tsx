import React, { FC, Fragment, ReactNode, useState } from "react"
import { withPageAuthRequired } from "@auth0/nextjs-auth0"
import { InferGetServerSidePropsType } from "next"
import { findCompanyById } from "@lib/db"
import Button from "@components/Button"
import Icon from "@components/Icon"
import EditCompanyDialog from "@components/EditCompanyDialog"
import AddRootDomainDialog from "@components/AddRootDomainDialog"
import { Menu, Tab, Transition } from "@headlessui/react"
import { CompanyWithRootDomains } from "@lib/model"
import clsx from "clsx"
import { RootDomain } from "@prisma/client"
import { mutateApi, useGetCompanyById } from "@lib/api-hooks"
import { del, patch } from "@lib/api"
import FaviconImage from "@components/FaviconImage"

enum TabOptions {
  Confirmed = "Confirmed",
  Other = "Other",
}

const CompanyProfile: FC<
  InferGetServerSidePropsType<typeof getServerSideProps> & {
    company: CompanyWithRootDomains
  }
> = ({ company }) => {
  const { data } = useGetCompanyById(company.id, company)
  const [editCompany, setEditCompany] = useState(false)
  const [addRootDomain, setAddRootDomain] = useState(false)

  return (
    <div>
      <div className="flex items-center border-b border-opacity-10 w-full py-4 pl-6">
        {data?.rootDomains && data?.rootDomains?.length > 0 ? (
          <FaviconImage
            domain={data.rootDomains[0].domain}
            className="w-8 h-8 mr-4 rounded-lg bg-white p-1"
          />
        ) : (
          <div className="w-8 h-8 mr-4 rounded-lg bg-gray-700 " />
        )}
        <h1 className="font-bold">{data?.name}</h1>

        <Button
          variant="outline"
          className="ml-auto mr-3 !p-2"
          onClick={() => setAddRootDomain(true)}
        >
          <Icon src="/icons/Streaming-White.svg" className="mr-2" />
          Add root domains
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
          <AddRootDomainDialog
            open={addRootDomain}
            setOpen={setAddRootDomain}
            companyId={company.id}
          />
        )}
      </div>

      <Tabs
        panels={[
          <ConfirmedDomains
            companyId={company.id}
            rootDomains={data?.rootDomains.filter(({ confirmed }) => confirmed)}
          />,
          <OtherDomains
            rootDomains={data?.rootDomains.filter(
              ({ confirmed }) => !confirmed
            )}
          />,
        ]}
      />
    </div>
  )
}

const ConfirmedDomains: FC<{
  companyId: number
  rootDomains?: RootDomain[]
}> = ({ companyId, rootDomains = [] }) => (
  <>
    {rootDomains.map((rootDomain) => (
      <div key={rootDomain.domain}>
        <div className="flex items-center px-6 py-2 dark:bg-dark-bg-800 border-b border-opacity-5">
          <p>{rootDomain.domain}</p>

          <RootDomainMoreMenu
            domain={rootDomain.domain}
            companyId={companyId}
          />
        </div>

        <p className="px-6 py-3 border-b border-opacity-10">no domain found</p>
      </div>
    ))}
  </>
)

const OtherDomains: FC<{ rootDomains?: RootDomain[] }> = ({
  rootDomains = [],
}) => {
  const handleConfirm = async (domain: string) => {
    await patch(`/root-domains/${encodeURIComponent(domain)}`, {
      confirmed: true,
    })
  }

  return (
    <>
      {rootDomains.map((rootDomain) => (
        <div key={rootDomain.domain}>
          <div className="flex items-center px-6 py-2 border-b border-opacity-5">
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
    </>
  )
}

const RootDomainMoreMenu: FC<{
  domain: string
  companyId: number
}> = ({ companyId, domain }) => {
  const handleDelete = async () => {
    const result = await del(`/root-domains/${domain}`)

    if (result.ok) {
      await mutateApi(`/companies/${companyId}`)
    }
  }

  return (
    <div className="ml-auto">
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button>
            <Button variant="icon" className="ml-auto">
              <Icon src="/icons/More-White.svg" className="" />
            </Button>
          </Menu.Button>
        </div>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 w-40 mt-2 origin-top-right divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-dark-bg-700">
            <div className="px-1 py-1">
              <Menu.Item>
                {({ active }) => (
                  <button
                    type="button"
                    className={`${
                      active ? "bg-red-800" : "text-gray-300"
                    } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                    onClick={handleDelete}
                  >
                    {active ? (
                      <Icon src="/icons/Trash-White.svg" className="mr-2" />
                    ) : (
                      <Icon src="/icons/Trash-Red.svg" className="mr-2" />
                    )}
                    Delete
                  </button>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  )
}

const Tabs: FC<{
  panels: ReactNode[]
}> = ({ panels }) => (
  <div className="w-full ">
    <Tab.Group>
      <div className="border-b border-opacity-10 p-2">
        <Tab.List className="flex p-1 space-x-1 bg-primary rounded-xl dark:bg-dark-bg-800 max-w-[200px]">
          {Object.keys(TabOptions).map((option) => (
            <Tab
              key={option}
              className={({ selected }) =>
                clsx(
                  "w-full py-2 leading-5 font-medium text-primary-200 rounded-lg text-xs !font-bold",
                  "focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60",
                  selected
                    ? "bg-white dark:bg-dark-bg-700 shadow "
                    : "!text-blue-100 hover:bg-white/[0.04] hover:text-white"
                )
              }
            >
              {option}
            </Tab>
          ))}
        </Tab.List>
      </div>

      <Tab.Panels>
        {panels.map((node) => (
          <Tab.Panel>{node}</Tab.Panel>
        ))}
      </Tab.Panels>
    </Tab.Group>
  </div>
)

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(ctx) {
    const { companyId } = ctx.query
    const company = await findCompanyById(parseInt(companyId as string, 10))

    if (company === null) {
      return { notFound: true }
    }

    return {
      props: {
        company: {
          ...company,
          rootDomains: company.rootDomains.map((domain) => ({
            ...domain,
            createdAt: domain.createdAt.toString(),
          })),
        },
      },
    }
  },
})

export default CompanyProfile
