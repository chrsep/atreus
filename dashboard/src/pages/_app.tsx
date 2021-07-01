import "tailwindcss/tailwind.css"
import { FC, useState } from "react"
import { AppProps } from "next/app"
import { UserProvider } from "@auth0/nextjs-auth0"
import Button from "@components/Button"
import useGetCompanies from "@lib/companies/useGetCompanies"
import NewCompanyDialog from "@components/NewCompanyDialog"

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
          className="ml-auto w-full"
          onClick={() => setShowNewCompany(true)}
        >
          New company
        </Button>

        {companies.data?.map(() => (
          <div>test</div>
        ))}
      </nav>
      <NewCompanyDialog open={showNewCompany} setOpen={setShowNewCompany} />
    </>
  )
}

export default Atreus
