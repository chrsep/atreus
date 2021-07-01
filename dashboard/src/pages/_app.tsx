import "tailwindcss/tailwind.css"
import { FC } from "react"
import { AppProps } from "next/app"
import { UserProvider } from "@auth0/nextjs-auth0"
import Button from "@components/Button"
import useGetCompanies from "@lib/companies/useGetCompanies"
import Link from "next/link"

const Atreus: FC<AppProps> = ({ Component, pageProps }) => (
  <UserProvider>
    <div className="dark">
      <div className="h-screen dark:bg-dark-bg-900 dark:text-white">
        <SideBar />

        <div className="col-span-4 sm:col-span-2 xl:col-span-3">
          <Component {...pageProps} />
        </div>
      </div>
    </div>
  </UserProvider>
)

const SideBar = () => {
  const companies = useGetCompanies()

  return (
    <nav className="border border-opacity-10 w-full h-full w-80 xl:col-span-1 p-4 dark:bg-dark-bg-900">
      <Link href="/companies/new">
        <Button className="ml-auto w-full">New company</Button>
      </Link>

      {companies.data?.map(() => (
        <div>test</div>
      ))}
    </nav>
  )
}

export default Atreus
