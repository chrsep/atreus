import "tailwindcss/tailwind.css"
import { FC } from "react"
import { AppProps } from "next/app"
import { UserProvider } from "@auth0/nextjs-auth0"

const Atreus: FC<AppProps> = ({ Component, pageProps }) => (
  <UserProvider>
    <Component {...pageProps} />
  </UserProvider>
)

export default Atreus
