import { FC } from "react"

interface Props {
  src: string
  className?: string
}
const Icon: FC<Props> = ({ className, src }) => (
  // eslint-disable-next-line @next/next/no-img-element
  <img src={src} className={`w-4 h-4 ${className}`} alt="" />
)

export default Icon
