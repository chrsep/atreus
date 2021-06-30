import "tailwindcss/tailwind.css"
import { FC } from "react"
import { AppProps } from "next/app"
import { UserProvider } from "@auth0/nextjs-auth0"
import Button from "@components/Button"
import useGetCompanies from "@lib/companies/useGetCompanies"

const Atreus: FC<AppProps> = ({ Component, pageProps }) => (
  <UserProvider>
    <div className="dark">
      <div className="grid grid-cols-4 gap-8 p-8 h-screen dark:bg-dark-bg-900 dark:text-white">
        <SideBar />
        <Component {...pageProps} />
      </div>
    </div>
  </UserProvider>
)

const SideBar = () => {
  const companies = useGetCompanies()

  return (
    <nav className="shadow-lg border border-opacity-10 rounded-xl col-span-4 sm:col-span-2 lg:col-span-2 xl:col-span-1 p-4 dark:bg-dark-bg-800">
      <div className="flex items-center">
        <h1 className="text-xl font-bold">Companies</h1>
        <Button className="ml-auto">Add Company</Button>
      </div>

      {companies.data?.map(() => (
        <div>test</div>
      ))}
    </nav>
  )
}

export default Atreus
