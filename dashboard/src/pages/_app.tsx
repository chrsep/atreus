import "tailwindcss/tailwind.css"
import "../styles/globals.css"
import { FC } from "react"
import { AppProps } from "next/app"

const MyApp: FC<AppProps> = ({ Component, pageProps }) => (
  <Component {...pageProps} />
)

export default MyApp
