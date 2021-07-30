import React, { FC, Fragment, RefObject } from "react"
import { Transition, Dialog as BaseDialog } from "@headlessui/react"

interface Props {
  className?: string
  open: boolean
  setOpen: (value: boolean) => void
  initialFocus?: RefObject<HTMLInputElement>
}
const Dialog: FC<Props> = ({
  open,
  setOpen,
  children,
  className,
  initialFocus,
}) => {
  return (
    <Transition.Root show={open} as={Fragment}>
      <BaseDialog
        as="div"
        static
        className="fixed z-10 inset-0 overflow-y-auto"
        open={open}
        onClose={setOpen}
        initialFocus={initialFocus}
      >
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <BaseDialog.Overlay className="fixed inset-0 bg-black bg-opacity-40 transition-opacity" />
          </Transition.Child>
          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="hidden sm:inline-block sm:align-top sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div
              className={`inline-block align-bottom bg-dark-bg-800 rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xl sm:w-full ${className}`}
            >
              {children}
            </div>
          </Transition.Child>
        </div>
      </BaseDialog>
    </Transition.Root>
  )
}

export default Dialog
