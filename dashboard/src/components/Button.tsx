/* eslint-disable react/button-has-type */
import { FC } from "react"
import { tw } from "@lib/ui"

export type ButtonVariant = "primary" | "secondary" | "outline" | "icon"

interface Props {
  type?: "submit" | "reset" | "button"
  onClick?: () => void
  className?: string
  variant?: ButtonVariant
  disabled?: boolean
}

const Button: FC<Props> = ({
  variant = "primary",
  type = "button",
  className = "",
  children,
  onClick,
  disabled,
}) => {
  let baseClassName: string
  switch (variant) {
    case "icon":
      baseClassName =
        "!p-3 text-gray-200 hover:text-gray-500  hover:bg-dark-bg-700 hover:bg-opacity-70"
      break
    case "secondary":
      baseClassName = "text-gray-200 hover:text-gray-500"
      break
    case "outline":
      baseClassName =
        "bg-white border border-gray-300 shadow-sm text-gray-700 hover:bg-gray-50 dark:bg-dark-bg-700 dark:hover:bg-dark-bg-800  border-opacity-20 dark:text-white"
      break
    default:
      baseClassName =
        "border border-opacity-20 border-transparent shadow-sm text-white bg-primary-400 hover:bg-primary-500"
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={tw(
        className,
        baseClassName,
        "!text-xs flex items-center rounded-md py-2 px-4 justify-center",
        "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-300",
        "disabled:opacity-40",
        "transition-color"
      )}
    >
      {children}
    </button>
  )
}

export default Button
