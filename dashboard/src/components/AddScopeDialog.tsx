import React, { FC, useState } from "react"
import Dialog from "@components/Dialog"
import Button from "@components/Button"
import Icon from "@components/Icon"
import axios from "redaxios"
import { mutate } from "swr"

interface Props {
  open: boolean
  setOpen: (value: boolean) => void
  companyId: number
}

const AddScopeDialog: FC<Props> = ({ companyId, open, setOpen }) => {
  const [scopes, setScopes] = useState<string[]>([])
  const [scope, setScope] = useState("")

  const handleSubmit = async () => {
    const result = await axios.post(
      `/api/companies/${companyId}/scopes`,
      scopes
    )

    if (result.status === 200) {
      await mutate(`/api/companies/${companyId}`, result.data)
      setOpen(false)
      setScopes([])
    }
  }

  return (
    <Dialog open={open} setOpen={setOpen}>
      <div className="flex items-center p-4 mb-4">
        <Icon
          src="/icons/Streaming-White.svg"
          className="mr-3 w-6 h-6 opacity-40"
        />
        <h2 className="text-xs">Add scopes</h2>

        <Button
          className="ml-auto !p-0"
          type="submit"
          variant="icon"
          onClick={() => setOpen(false)}
        >
          <Icon src="/icons/Close-White.svg" className="opacity-60 w-6 h-6" />
        </Button>
      </div>

      {scopes.map((domain) => (
        <div key={domain} className="px-4 pb-4 flex items-center">
          <Button
            variant="outline"
            className="mr-4 !text-red-500 font-bold !p-2"
            onClick={() => {
              setScopes(
                scopes.filter((testedDomain) => testedDomain !== domain)
              )
            }}
          >
            <Icon src="/icons/Trash-Red.svg" />
          </Button>
          <p>{domain}</p>
        </div>
      ))}

      <div className="flex items-end mb-4 mx-4 items-center border border-opacity-10 rounded-xl p-3">
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

      <div className="border-t border-opacity-5">
        <Button className="ml-auto m-4" onClick={handleSubmit}>
          Save scopes
        </Button>
      </div>
    </Dialog>
  )
}

export default AddScopeDialog
