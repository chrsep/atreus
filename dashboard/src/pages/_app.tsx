import "tailwindcss/tailwind.css"
import { FC, useState } from "react"
import { AppProps } from "next/app"
import { UserProvider } from "@auth0/nextjs-auth0"
import Button from "@components/Button"
import useGetCompanies from "@lib/companies/useGetCompanies"
import NewCompanyDialog from "@components/NewCompanyDialog"
import Link from "next/link"

const Atreus: FC<AppProps> = ({ Component, pageProps }) => (
  <UserProvider>
    <div className="dark">
      <div className="flex h-screen dark:bg-dark-bg-900 dark:text-white">
        <SideBar />

        <div className="col-span-4 sm:col-span-2 xl:col-span-3">
          <Component {...pageProps} />
        </div>
      </div>
    </div>
  </UserProvider>
)

const SideBar = () => {
  const [showNewCompany, setShowNewCompany] = useState(false)
  const companies = useGetCompanies()

  return (
    <>
      <nav className="border border-opacity-10 w-full h-full w-80 xl:col-span-1 p-4 dark:bg-dark-bg-900">
        <Button
          variant="outline"
          className="ml-auto w-full mb-4 !justify-start"
          onClick={() => setShowNewCompany(true)}
        >
          New company
        </Button>

        {companies.data?.map(({ id, name }) => (
          <Link href={`/companies/${{ id }}`}>
            <a className="block rounded-lg px-4 py-2 dark:hover:bg-dark-bg-800 my-2">
              {name}
            </a>
          </Link>
        ))}
      </nav>
      <NewCompanyDialog open={showNewCompany} setOpen={setShowNewCompany} />
    </>
  )
}

export default Atreus
