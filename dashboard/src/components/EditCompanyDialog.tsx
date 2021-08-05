import React, { FC, MutableRefObject, useRef } from "react"
import Button from "@components/Button"
import { useForm } from "react-hook-form"
import { Company, RootDomain } from "@prisma/client"
import Icon from "@components/Icon"
import Dialog from "@components/Dialog"
import { useRouter } from "next/router"
import TextField from "@components/TextField"
import { del, patch } from "@lib/api"
import { mutateApi } from "@lib/api-hooks"

interface Props {
  open: boolean
  setOpen: (value: boolean) => void
  company: Company & { rootDomains: RootDomain[] }
}

const EditCompanyDialog: FC<Props> = ({ company, open, setOpen }) => {
  const router = useRouter()
  const { register, handleSubmit } = useForm<{
    name: string
    bountyLink: string
  }>({
    defaultValues: {
      name: company.name,
      bountyLink: company.bountyLink,
    },
  })

  const nameField: MutableRefObject<HTMLInputElement | null> = useRef(null)
  const { ref: nameRef, ...name } = register("name")

  const onSubmit = handleSubmit(async (data) => {
    const result = await patch(`/companies/${company.id}`, data)
    if (result.ok) {
      await mutateApi("/companies")
      await mutateApi(`/companies/${company.id}`)
      setOpen(false)
    }
  })

  const onDelete = async () => {
    const result = await del(`/companies/${company.id}`)

    if (result.ok) {
      await mutateApi("/companies")
      await router.push("/")
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} setOpen={setOpen} initialFocus={nameField}>
      <div className="flex items-center p-4">
        <Icon src="/icons/Shop-White.svg" className="mr-3 w-6 h-6 opacity-40" />
        <h2 className="text-xs">Edit company</h2>

        <Button
          className="ml-auto !p-1"
          type="submit"
          variant="icon"
          onClick={() => setOpen(false)}
        >
          <Icon src="/icons/Close-White.svg" className="opacity-60 !w-6 !h-6" />
        </Button>
      </div>

      <form onSubmit={onSubmit}>
        <div className="px-4 pb-2">
          <TextField
            label="Name"
            ref={(e) => {
              nameRef(e)
              nameField.current = e
            }}
            {...name}
          />

          <TextField
            label="Bounty Link"
            containerClassName="mt-4"
            type="url"
            {...register("bountyLink")}
          />
        </div>

        <div className="flex items-center">
          <Button className="ml-auto !p-2" variant="outline" onClick={onDelete}>
            <Icon src="/icons/Trash-Red.svg" />
          </Button>
          <Button className="ml-2 m-4" type="submit">
            Save
          </Button>
        </div>
      </form>
    </Dialog>
  )
}

export default EditCompanyDialog
