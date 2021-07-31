import { FC } from "react"

const FaviconImage: FC<{ className: string; domain: string }> = ({
  domain,
  className,
}) => (
  <img
    src={`https://${domain}/favicon.ico`}
    className={className}
    referrerPolicy="no-referrer"
    alt=""
  />
)

export default FaviconImage
