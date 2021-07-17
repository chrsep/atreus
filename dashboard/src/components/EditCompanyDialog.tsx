import React, { FC } from "react"
import Button from "@components/Button"
import { useForm } from "react-hook-form"
import { mutate } from "swr"
import { Company, RootDomain } from "@prisma/client"
import Icon from "@components/Icon"
import Dialog from "@components/Dialog"
import { useRouter } from "next/router"
import TextField from "@components/TextField"

interface Props {
  open: boolean
  setOpen: (value: boolean) => void
  company: Company & { rootDomains: RootDomain[] }
}

const NewCompanyDialog: FC<Props> = ({ company, open, setOpen }) => {
  const router = useRouter()
  const { register, handleSubmit } = useForm<{ name: string }>({
    defaultValues: {
      name: company.name,
    },
  })

  const onSubmit = handleSubmit(async (data) => {
    const result = await fetch(`/api/companies/${company.id}`, {
      method: "PATCH",
      credentials: "include",
      body: JSON.stringify(data),
    })

    if (result.ok) {
      await mutate("/api/companies")
      await mutate(`/api/companies/${company.id}`)
      setOpen(false)
    }
  })

  const onDelete = async () => {
    const result = await fetch(`/api/companies/${company.id}`, {
      method: "DELETE",
      credentials: "include",
    })

    if (result.ok) {
      await mutate("/api/companies")
      await router.push("/")
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} setOpen={setOpen}>
      <div className="flex items-center p-4">
        <Icon src="/icons/Shop-White.svg" className="mr-3 w-6 h-6 opacity-40" />
        <h2 className="text-xs">Edit company</h2>

        <Button
          className="ml-auto !p-1"
          type="submit"
          variant="icon"
          onClick={() => setOpen(false)}
        >
          <Icon src="/icons/Close-White.svg" className="opacity-60 w-6 h-6" />
        </Button>
      </div>

      <form onSubmit={onSubmit}>
        <div className="px-4 pb-2">
          <TextField label="Name" {...register("name")} />
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

export default NewCompanyDialog
