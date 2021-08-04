import "tailwindcss/tailwind.css"
import { FC, useState } from "react"
import { AppProps } from "next/app"
import { UserProvider } from "@auth0/nextjs-auth0"
import Button from "@components/Button"
import NewCompanyDialog from "@components/NewCompanyDialog"
import Link from "next/link"
import { useRouter } from "next/router"
import Icon from "@components/Icon"
import clsx from "clsx"
import { useGetCompanies } from "@lib/api-hooks"
import FaviconImage from "@components/FaviconImage"

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
  const [showNewCompany, setShowNewCompany] = useState(false)
  const companies = useGetCompanies()

  return (
    <>
      <nav className="border border-opacity-10 w-full w-80 xl:col-span-1 py-4 dark:bg-dark-bg-900 sticky top-0 h-screen">
        <div className="mx-4 mb-8">
          <NavigationLink href="/" iconSrc="/icons/Home.svg" text="Home" />
        </div>

        <div className="flex items-center pl-6 py-4 border-b border-opacity-10 px-4 relative">
          <p className="font-bold ">Companies</p>
          <Button
            variant="outline"
            className="ml-auto !p-2 !rounded-full absolute bottom-0 -mb-4 right-4"
            onClick={() => setShowNewCompany(true)}
          >
            <Icon src="/icons/Add-Stroke.svg" className="!bg-white" />
          </Button>
        </div>

        <div className="p-4">
          {companies.data?.map(({ id, name, rootDomains }) => (
            <CompanyLink
              companyId={id}
              name={name}
              domain={rootDomains[0]?.domain}
            />
          ))}
        </div>
      </nav>

      <NewCompanyDialog open={showNewCompany} setOpen={setShowNewCompany} />
    </>
  )
}

const NavigationLink: FC<{
  href: string
  iconSrc: string
  text: string
}> = ({ href, iconSrc, text }) => {
  const { asPath } = useRouter()

  return (
    <Link href={href}>
      <a
        className={clsx(
          "flex items-center px-3 py-2 mb-2 dark:hover:bg-dark-bg-800 rounded-lg font-bold",
          asPath === href &&
            "dark:bg-primary-300 !bg-opacity-20 dark:hover:bg-primary-400 ring-primary-400 ring-1 ring-opacity-30"
        )}
      >
        <Icon src={iconSrc} className="mr-5 !bg-white" />
        {text}
      </a>
    </Link>
  )
}

const CompanyLink: FC<{
  companyId: number
  domain?: string
  name: string
}> = ({ companyId, domain, name }) => {
  const { asPath } = useRouter()
  const href = `/companies/${companyId}`

  return (
    <Link href={href}>
      <a
        className={clsx(
          "flex items-center rounded-xl p-2 dark:hover:bg-dark-bg-800 my-2 text-xs",
          asPath === href &&
            "dark:bg-primary-300 !bg-opacity-20 dark:hover:bg-primary-400 ring-primary-400 ring-1 ring-opacity-30"
        )}
      >
        {domain ? (
          <FaviconImage
            domain={domain}
            className="w-6 h-6 mr-4 rounded-lg bg-gray-700 p-1"
          />
        ) : (
          <div className="w-6 h-6 mr-4 rounded-lg bg-gray-700" />
        )}
        <p className="truncate">{name}</p>
      </a>
    </Link>
  )
}

export default Atreus
