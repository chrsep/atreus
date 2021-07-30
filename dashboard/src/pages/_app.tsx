import "tailwindcss/tailwind.css"
import { FC, useState } from "react"
import { AppProps } from "next/app"
import { UserProvider } from "@auth0/nextjs-auth0"
import Button from "@components/Button"
import useGetCompanies from "@lib/companies/useGetCompanies"
import NewCompanyDialog from "@components/NewCompanyDialog"
import Link from "next/link"
import { useRouter } from "next/router"
import Icon from "@components/Icon"
import clsx from "clsx"

const Atreus: FC<AppProps> = ({ Component, pageProps }) => (
  <UserProvider>
    <div className="flex dark:bg-dark-bg-900">
      <SideBar />

      <div className="w-full">
        <Component {...pageProps} />
      </div>
    </div>
  </UserProvider>
)

const SideBar = () => {
  const router = useRouter()
  const [showNewCompany, setShowNewCompany] = useState(false)
  const companies = useGetCompanies()

  return (
    <>
      <nav className="border border-opacity-10 w-full w-80 xl:col-span-1 p-4 dark:bg-dark-bg-900 sticky top-0 h-screen">
        <Button
          variant="outline"
          className="ml-auto w-full mb-4 !justify-start leading-tight"
          onClick={() => setShowNewCompany(true)}
        >
          <Icon src="/icons/Add-Stroke.svg" className="mr-2" />
          Create company
        </Button>

        {companies.data?.map(({ id, name }) => {
          const href = `/companies/${id}`
          return (
            <Link href={href}>
              <a
                className={clsx(
                  "block rounded-lg px-4 py-2 dark:hover:bg-dark-bg-800 my-1 text-xs",
                  router.asPath === href &&
                    "dark:bg-primary-300 !bg-opacity-20 dark:hover:bg-primary-400 ring-primary-400 ring-1 ring-opacity-30"
                )}
              >
                {name}
              </a>
            </Link>
          )
        })}
      </nav>
      <NewCompanyDialog open={showNewCompany} setOpen={setShowNewCompany} />
    </>
  )
}

export default Atreus
