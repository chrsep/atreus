import React, { FC, useState } from "react"
import Button from "@components/Button"
import { useForm } from "react-hook-form"
import { mutate } from "swr"
import Dialog from "@components/Dialog"

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
    <Dialog open={open} setOpen={setOpen}>
      <h1 className="!mb-2 m-4">New company</h1>

      <form className="" onSubmit={onSubmit}>
        <div className="px-2">
          <input
            {...register("name")}
            className="bg-dark-bg-800 w-full text-xl font-bold p-2 !outline-none"
            placeholder="Company name"
          />
        </div>

        <h2 className="mt-6 mb-4 mx-4">Domain scopes</h2>

        <div className="mx-4">
          {scopes.map((domain) => (
            <div key={domain} className="pb-4 flex items-center">
              <Button
                variant="outline"
                className="mr-4 !text-red-500 font-bold"
                onClick={() => {
                  setScopes(
                    scopes.filter((testedDomain) => testedDomain !== domain)
                  )
                }}
              >
                Delete
              </Button>
              <p>{domain}</p>
            </div>
          ))}
        </div>

        <div className="flex items-end mb-6 mx-4 items-center border border-opacity-10 rounded-xl p-3">
          <input
            name="domain"
            onChange={(e) => setScope(e.target.value)}
            value={scope}
            className="bg-dark-bg-800 w-full !outline-none"
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
    </Dialog>
  )
}

export default NewCompanyDialog
