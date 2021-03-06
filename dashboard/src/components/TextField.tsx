import { ChangeEventHandler, forwardRef, ForwardRefRenderFunction } from "react"

interface Props {
  name: string
  label?: string
  onChange?: ChangeEventHandler<HTMLInputElement>
  type?: string
  value?: string
  autocomplete?: string
  containerClassName?: string
  required?: boolean
  iconSrc?: string
  placeholder?: string
  hideLabel?: boolean
  inputClassName?: string
}

const TextField: ForwardRefRenderFunction<HTMLInputElement, Props> = (
  {
    containerClassName,
    label,
    required,
    onChange,
    autocomplete,
    value,
    name,
    iconSrc,
    placeholder,
    inputClassName,
    type = "text",
    hideLabel = false,
  },
  ref
) => {
  return (
    <div className={`${containerClassName}`}>
      <label
        htmlFor={name}
        className="block text-sm text-gray-700 dark:text-gray-200 font-bold"
      >
        {!hideLabel && <span className="mb-1 block">{label}</span>}
        <div className="rounded-md relative">
          {iconSrc && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={iconSrc}
                className="h-5 w-5 text-gray-400 opacity-70"
                aria-hidden="true"
                alt=""
              />
            </div>
          )}
          <input
            id={name}
            name={name}
            type={type}
            autoComplete={autocomplete}
            required={required}
            onChange={onChange}
            value={value}
            placeholder={placeholder}
            ref={ref}
            className={`${inputClassName} focus:ring-primary-500 focus:border-primary-500 block w-full ${
              iconSrc ? "pl-10" : ""
            } sm:text-sm border-gray-300 border-opacity-20 rounded-md shadow-sm dark:bg-dark-bg-700`}
          />
        </div>
      </label>
    </div>
  )
}

export default forwardRef(TextField)
