import React, { FC, MutableRefObject, useRef, useState } from "react"
import Dialog from "@components/Dialog"
import Button from "@components/Button"
import Icon from "@components/Icon"
import { post } from "@lib/api"
import { mutateApi } from "@lib/api-hooks"

interface Props {
  open: boolean
  setOpen: (value: boolean) => void
  companyId: number
}

const AddRootDomainDialog: FC<Props> = ({ companyId, open, setOpen }) => {
  const [rootDomains, setRootDomains] = useState<string[]>([])
  const [rootDomain, setRootDomain] = useState("")

  const domainField: MutableRefObject<HTMLInputElement | null> = useRef(null)

  const handleSubmit = async () => {
    const result = await post(
      `/companies/${companyId}/root-domains`,
      rootDomains
    )

    if (result.status === 200) {
      await mutateApi(`/companies/${companyId}`, result.data)
      setOpen(false)
      setRootDomains([])
    }
  }

  return (
    <Dialog open={open} setOpen={setOpen} initialFocus={domainField}>
      <div className="flex items-center p-4">
        <Icon
          src="/icons/Streaming-White.svg"
          className="mr-3 w-6 h-6 opacity-40"
        />
        <h2 className="text-xs">Add root domains</h2>

        <Button
          className="!p-1 ml-auto"
          type="submit"
          variant="icon"
          onClick={() => setOpen(false)}
        >
          <Icon src="/icons/Close-White.svg" className="!w-6 !h-6 opacity-60" />
        </Button>
      </div>

      {rootDomains.map((domain) => (
        <div key={domain} className="flex items-center px-4 pb-3">
          <Button
            variant="outline"
            className="!p-2 mr-4 font-bold !text-red-500"
            onClick={() => {
              setRootDomains(
                rootDomains.filter((testedDomain) => testedDomain !== domain)
              )
            }}
          >
            <Icon src="/icons/Trash-Red.svg" />
          </Button>
          <p>{domain}</p>
        </div>
      ))}

      <form
        className="flex items-center py-2 px-4 mb-4 border-t border-b border-opacity-10"
        onSubmit={(e) => {
          e.preventDefault()
          setRootDomains([...rootDomains, rootDomain])
          setRootDomain("")
        }}
      >
        <input
          name="domain"
          onChange={(e) => setRootDomain(e.target.value)}
          value={rootDomain}
          className="py-2 w-full text-base bg-dark-bg-800 !outline-none"
          placeholder="New root domain"
          ref={domainField}
        />

        <Button variant="outline" className="ml-4" type="submit">
          Add
        </Button>
      </form>

      <Button className="m-4 ml-auto" onClick={handleSubmit}>
        Save root domains
      </Button>
    </Dialog>
  )
}

export default AddRootDomainDialog
