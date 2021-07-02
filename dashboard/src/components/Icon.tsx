import { FC } from "react"

interface Props {
  src: string
}
const Icon: FC<Props> = ({ src }) => (
  <img src={src} className="mr-2 w-4 h-4" alt="" />
)

export default Icon
