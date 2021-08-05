import { FC } from "react"

const FaviconImage: FC<{
  altIcon?: string
  className: string
  domain: string
}> = ({ domain, className, altIcon }) => (
  // eslint-disable-next-line @next/next/no-img-element
  <img
    src={altIcon || `https://${domain}/favicon.ico`}
    className={className}
    referrerPolicy="no-referrer"
    alt=""
  />
)

export default FaviconImage
