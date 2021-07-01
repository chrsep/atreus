import { Dialog, Transition } from "@headlessui/react"
import React, { FC, Fragment, useState } from "react"
import Button from "@components/Button"
import { useForm } from "react-hook-form"
import { mutate } from "swr"

interface Props {
  open: boolean
  setOpen: (value: boolean) => void
}

const NewCompanyDialog: FC<Props> = ({ open, setOpen }) => {
  const { register, handleSubmit } = useForm<{ name: string }>()

  const [scopes, setScopes] = useState<string[]>([])
  const [scope, setScope] = useState("")

  const onSubmit = handleSubmit(async (data) => {
    const result = await fetch("/api/companies", {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({
        ...data,
        scopes,
      }),
    })

    if (result.ok) {
      await mutate("/api/companies")
      setOpen(false)
    }
  })

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        static
        className="fixed z-10 inset-0 overflow-y-auto"
        open={open}
        onClose={setOpen}
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
            <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-40 transition-opacity" />
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
            <div className="inline-block align-bottom bg-dark-bg-800 rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xl sm:w-full">
              <h1 className="text-white !mb-2 m-4">New company</h1>

              <form className="" onSubmit={onSubmit}>
                <div className="px-2">
                  <input
                    {...register("name")}
                    className="bg-dark-bg-800 w-full dark:text-white text-xl font-bold p-2 !outline-none"
                    placeholder="Company name"
                  />
                </div>

                <h2 className="mt-6 text-white mb-4 mx-4">Domain scopes</h2>

                <div className="mx-4">
                  {scopes.map((domain) => (
                    <div key={domain} className="pb-4 flex items-center">
                      <Button
                        variant="outline"
                        className="mr-4 !text-red-500 font-bold"
                        onClick={() => {
                          setScopes(
                            scopes.filter(
                              (testedDomain) => testedDomain !== domain
                            )
                          )
                        }}
                      >
                        Delete
                      </Button>
                      <p className="dark:text-white">{domain}</p>
                    </div>
                  ))}
                </div>

                <div className="flex items-end mb-6 mx-4 items-center border border-opacity-10 rounded-xl p-3">
                  <input
                    name="domain"
                    onChange={(e) => setScope(e.target.value)}
                    value={scope}
                    className="bg-dark-bg-800 w-full dark:text-white !outline-none"
                    placeholder="New scope"
                  />

                  <Button
                    variant="outline"
                    className="ml-4"
                    onClick={() => {
                      setScopes([...scopes, scope])
                      setScope("")
                    }}
                  >
                    Add
                  </Button>
                </div>

                <div className="border-t border-opacity-10">
                  <Button className="ml-auto m-4" type="submit">
                    Save company
                  </Button>
                </div>
              </form>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

export default NewCompanyDialog
