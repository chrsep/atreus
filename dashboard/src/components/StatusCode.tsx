import { FC } from "react"

const StatusCode: FC<{
  className?: string
  code: string
}> = ({ className, code }) => {
  const color = defineColor(code)
  return <div className={`font-bold ${color} ${className}`}>{code}</div>
}

const defineColor = (statusCode: string) => {
  if (statusCode.startsWith("2")) {
    return "text-green-400"
  }
  if (statusCode.startsWith("3")) {
    return "text-yellow-300"
  }
  if (statusCode.startsWith("4")) {
    return "text-orange-400"
  }
  if (statusCode.startsWith("5")) {
    return "text-red-400"
  }
  return "text-white"
}

export default StatusCode
