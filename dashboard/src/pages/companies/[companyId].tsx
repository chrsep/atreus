import React, { FC, Fragment, useState } from "react"
import { withPageAuthRequired } from "@auth0/nextjs-auth0"
import { InferGetServerSidePropsType } from "next"
import { findCompanyById } from "@lib/db"
import type { Company, Scope } from "@prisma/client"
import Button from "@components/Button"
import Icon from "@components/Icon"
import EditCompanyDialog from "@components/EditCompanyDialog"
import useGetCompanyById from "@lib/companies/useGetCompany"
import AddScopeDialog from "@components/AddScopeDialog"
import { Transition, Menu } from "@headlessui/react"
import axios from "redaxios"
import { mutate } from "swr"

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
          <div className="flex items-center px-6 py-1 dark:bg-dark-bg-800 border-b border-opacity-5">
            <p>{scope.domain}</p>

            <ScopeMoreMenu domain={scope.domain} companyId={company.id} />
          </div>

          <p className="px-6 py-3 border-b border-opacity-10">
            no domain found
          </p>
        </div>
      ))}
    </div>
  )
}

const ScopeMoreMenu: FC<{
  domain: string
  companyId: number
}> = ({ companyId, domain }) => {
  const handleDelete = async () => {
    const result = await axios.delete(`/api/scopes/${domain}`)

    if (result.status === 200) {
      await mutate(`/api/companies/${companyId}`)
    }
  }

  return (
    <div className="ml-auto">
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button>
            <Button variant="icon" className="!p-0  ml-auto">
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
