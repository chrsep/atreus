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
          className="ml-auto !p-1"
          type="submit"
          variant="icon"
          onClick={() => setOpen(false)}
        >
          <Icon src="/icons/Close-White.svg" className="opacity-60 !w-6 !h-6" />
        </Button>
      </div>

      {rootDomains.map((domain) => (
        <div key={domain} className="px-4 pb-3 flex items-center">
          <Button
            variant="outline"
            className="mr-4 !text-red-500 font-bold !p-2"
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
        className="flex items-end mb-4 items-center border-t border-b border-opacity-10 px-4 py-2"
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
          className="bg-dark-bg-800 w-full !outline-none text-base py-2"
          placeholder="New root domain"
          ref={domainField}
        />

        <Button variant="outline" className="ml-4" type="submit">
          Add
        </Button>
      </form>

      <Button className="ml-auto m-4" onClick={handleSubmit}>
        Save root domains
      </Button>
    </Dialog>
  )
}

export default AddRootDomainDialog
