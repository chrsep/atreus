import { FC } from "react"

interface Props {
  src: string
  className?: string
}
const Icon: FC<Props> = ({ className, src }) => (
  // eslint-disable-next-line @next/next/no-img-element
  <div
    role="img"
    aria-hidden="true"
    className={`w-4 h-4 bg-black dark:bg-white ${className}`}
    style={{
      maskImage: `url(${src})`,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      "-webkit-mask-image": `url(${src})`,

      maskSize: "100%",
      "-webkit-mask-size": "100%",

      maskRepeat: "no-repeat",
      "-webkit-mask-repeat": "no-repeat",
    }}
  />
)

export default Icon
