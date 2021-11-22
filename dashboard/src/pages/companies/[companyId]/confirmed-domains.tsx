import React, { FC, Fragment } from "react"
import { withPageAuthRequired } from "@auth0/nextjs-auth0"
import { InferGetServerSidePropsType } from "next"
import { findCompanyById, findConfirmedRootDomainsByCompanyId } from "@lib/db"
import Button from "@components/Button"
import Icon from "@components/Icon"
import { Menu, Transition } from "@headlessui/react"
import { mutateApi } from "@lib/api-hooks"
import { del } from "@lib/api"
import dayjs from "dayjs"
import CompanyLayout from "../../../layout/company-layout"

const ConfirmedDomain: FC<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ company, rootDomains }) => {
  return (
    <CompanyLayout companyId={company.id} company={company}>
      {rootDomains.map((rootDomain) => (
        <div key={rootDomain.name}>
          <div className="flex items-center py-2 px-6 dark:bg-dark-bg-800 border-b border-opacity-5">
            <p>{rootDomain.name}</p>

            <RootDomainMoreMenu
              domain={rootDomain.name}
              companyId={company.id}
            />
          </div>

          {rootDomain?.subDomains?.length === 0 && (
            <p className="py-3 px-6 border-b border-opacity-10">
              no domain found
            </p>
          )}

          <table className="w-full">
            {rootDomain.subDomains &&
              rootDomain.subDomains.length > 0 &&
              rootDomain.subDomains.map((subDomain) => (
                <tr className="flex items-center border-b border-opacity-10 ">
                  <td className="py-3 px-6 w-1/6">
                    <span className="font-bold">
                      {subDomain.name.replace(rootDomain.name, "")}
                    </span>
                    <span className="opacity-30">{rootDomain.name}</span>
                  </td>
                  {/* <td className="w-1/2 text-xs"> */}
                  {/*  {ipAddresses?.map((address) => ( */}
                  {/*    <p className="py-1 w-[90px] flex-shrink-0">{address.ip}</p> */}
                  {/*  ))} */}
                  {/* </td> */}
                  {/* <td className="w-1/6 text-xs">{subDomain.ip}</td> */}
                  {/* <td className="w-1/6 text-xs">{subDomain.ip}</td> */}
                  <td className="mr-3 ml-auto text-xs">
                    {dayjs(subDomain.updatedAt).format("DD MMM YYYY")}
                    <span className="ml-2 opacity-30">
                      {dayjs(subDomain.updatedAt).format("HH:mm")}
                    </span>
                  </td>
                </tr>
              ))}
          </table>
        </div>
      ))}
    </CompanyLayout>
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
      <Menu as="div" className="inline-block relative text-left">
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
          <Menu.Items className="absolute right-0 mt-2 w-40 dark:bg-dark-bg-700 rounded-md divide-y divide-gray-100 ring-1 ring-black ring-opacity-5 shadow-lg origin-top-right focus:outline-none">
            <div className="py-1 px-1">
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

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(ctx) {
    const companyId = parseInt(ctx.query.companyId as string, 10)
    const company = await findCompanyById(companyId)

    if (company === null) {
      return { notFound: true }
    }

    const rootDomains = await findConfirmedRootDomainsByCompanyId(companyId)

    return {
      props: {
        company,
        rootDomains: rootDomains.map((domain) => ({
          name: domain.name,
          createdAt: domain.createdAt.toString(),
          subDomains: domain.subDomains.map((subDomain) => ({
            name: subDomain.name,
            createdAt: subDomain.createdAt.toISOString(),
            updatedAt: subDomain.updatedAt.toISOString(),
            // ip: subDomain.ip,
          })),
        })),
      },
    }
  },
})

export default ConfirmedDomain
