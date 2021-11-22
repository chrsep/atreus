import React, { FC, MutableRefObject, useRef, useState } from "react"
import Button from "@components/Button"
import { useForm } from "react-hook-form"
import Dialog from "@components/Dialog"
import TextField from "@components/TextField"
import Icon from "@components/Icon"
import { post } from "@lib/api"
import { mutateApi } from "@lib/api-hooks"

interface Props {
  open: boolean
  setOpen: (value: boolean) => void
}

const NewCompanyDialog: FC<Props> = ({ open, setOpen }) => {
  const { reset, register, handleSubmit } = useForm<{
    name: string
    bountyLink: string
    icon: string
  }>()

  const [rootDomains, setRootDomains] = useState<string[]>([])
  const [rootDomain, setRootDomain] = useState("")

  const nameField: MutableRefObject<HTMLInputElement | null> = useRef(null)
  const { ref: nameRef, ...name } = register("name")

  const onSubmit = handleSubmit(async (data) => {
    const result = await post("/companies", { ...data, rootDomains })

    if (result.ok) {
      await mutateApi("/companies")
      setOpen(false)
      setRootDomains([])
      setRootDomain("")
      reset()
    }
  })

  return (
    <Dialog open={open} setOpen={setOpen} initialFocus={nameField}>
      <div className="flex items-center p-4">
        <Icon src="/icons/Shop-White.svg" className="mr-3 w-6 h-6 opacity-40" />
        <h2 className="text-xs">New company</h2>

        <Button
          className="!p-1 ml-auto"
          type="submit"
          variant="icon"
          onClick={() => setOpen(false)}
        >
          <Icon src="/icons/Close-White.svg" className="!w-6 !h-6 opacity-60" />
        </Button>
      </div>

      <form onSubmit={onSubmit}>
        <TextField
          label="Name"
          containerClassName="px-4 mt-2"
          ref={(e) => {
            nameRef(e)
            nameField.current = e
          }}
          {...name}
        />

        <TextField
          label="Bounty info URL"
          containerClassName="px-4 mt-4"
          type="url"
          {...register("bountyLink")}
        />

        <TextField
          label="Icon"
          containerClassName="px-4 mt-4"
          type="url"
          {...register("icon")}
        />

        <h2 className="mx-4 mt-8 mb-3 font-bold">Root domains</h2>

        <div className="mx-4">
          {rootDomains.map((domain) => (
            <div key={domain} className="flex items-center pb-4">
              <Button
                variant="outline"
                className="!p-2 mr-3 font-bold !text-red-500"
                onClick={() => {
                  setRootDomains(
                    rootDomains.filter(
                      (testedDomain) => testedDomain !== domain
                    )
                  )
                }}
              >
                <Icon src="/icons/Trash-Red.svg" />
              </Button>
              <p>{domain}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center p-4 border-t border-b border-opacity-10">
          <input
            name="domain"
            onChange={(e) => setRootDomain(e.target.value)}
            value={rootDomain}
            className="w-full bg-dark-bg-800 !outline-none"
            placeholder="New root domain"
          />

          <Button
            variant="outline"
            className="ml-4"
            onClick={() => {
              setRootDomains([...rootDomains, rootDomain])
              setRootDomain("")
            }}
          >
            Add
          </Button>
        </div>

        <Button className="m-4 ml-auto" type="submit">
          Save company
        </Button>
      </form>
    </Dialog>
  )
}

export default NewCompanyDialog
