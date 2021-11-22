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
      <nav className="sticky top-0 flex-shrink-0 xl:col-span-1 py-4 w-60 h-screen dark:bg-dark-bg-900 border border-opacity-10">
        <div className="mx-4 mb-8">
          <NavigationLink href="/" iconSrc="/icons/Home.svg" text="Home" />
        </div>

        <div className="flex relative items-center py-4 px-4 pl-6 border-b border-opacity-10">
          <p className="font-bold ">Companies</p>
          <Button
            variant="outline"
            className="absolute right-4 bottom-0 !p-2 -mb-4 ml-auto !rounded-full"
            onClick={() => setShowNewCompany(true)}
          >
            <Icon src="/icons/Add-Stroke.svg" className="!bg-white" />
          </Button>
        </div>

        <div className="p-4">
          {companies.data?.map(({ id, name, icon }) => (
            <CompanyLink companyId={id} name={name} icon={icon} />
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
          "flex items-center py-2 px-2 mb-2 font-bold dark:hover:bg-dark-bg-800 rounded-lg",
          asPath === href &&
            "dark:bg-primary-300 dark:hover:bg-primary-400 !bg-opacity-20 ring-1 ring-primary-400 ring-opacity-30"
        )}
      >
        <div className="p-1 mr-4 bg-primary-600 rounded-[6px]">
          <Icon src={iconSrc} className="!bg-white" />
        </div>
        {text}
      </a>
    </Link>
  )
}

const CompanyLink: FC<{
  companyId: number
  name: string
  icon: string
}> = ({ companyId, name, icon }) => {
  const { asPath } = useRouter()
  const href = `/companies/${companyId}/confirmed-domains`

  return (
    <Link href={href}>
      <a
        className={clsx(
          "flex items-center p-2 my-2 text-xs dark:hover:bg-dark-bg-800 rounded-xl",
          asPath === href &&
            "dark:bg-primary-300 dark:hover:bg-primary-400 !bg-opacity-20 ring-1 ring-primary-400 ring-opacity-30"
        )}
      >
        {icon ? (
          <img
            src={icon}
            referrerPolicy="no-referrer"
            className="p-1 mr-4 w-6 h-6 bg-gray-700 rounded-lg"
            alt=""
          />
        ) : (
          <div className="mr-4 w-6 h-6 bg-gray-700 rounded-lg" />
        )}
        <p className="truncate">{name}</p>
      </a>
    </Link>
  )
}

export default Atreus
