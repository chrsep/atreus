import React, { FC } from "react"
import Button from "@components/Button"
import { useForm } from "react-hook-form"
import { mutate } from "swr"
import { Company, Scope } from "@prisma/client"
import Icon from "@components/Icon"
import Dialog from "@components/Dialog"
import { useRouter } from "next/router"

interface Props {
  open: boolean
  setOpen: (value: boolean) => void
  company: Company & { scopes: Scope[] }
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
      <div className="flex items-center p-4 !pb-2">
        <h1>Edit company</h1>
        <Button
          className="ml-auto !p-2"
          type="submit"
          variant="outline"
          onClick={() => setOpen(false)}
        >
          <Icon src="/icons/Close-White.svg" className="opacity-60" />
        </Button>
      </div>

      <form className="" onSubmit={onSubmit}>
        <div className="px-2">
          <input
            {...register("name")}
            className="bg-dark-bg-800 w-full text-xl font-bold mx-2 mb-2 !outline-none"
            placeholder="Company name"
          />
        </div>

        <div className="flex items-center">
          <Button className="ml-auto !p-2" variant="outline" onClick={onDelete}>
            <Icon src="/icons/Trash-Red.svg" />
          </Button>
          <Button className="m-4" type="submit">
            Save
          </Button>
        </div>
      </form>
    </Dialog>
  )
}

export default NewCompanyDialog
