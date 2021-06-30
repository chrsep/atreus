import TextField from "@components/TextField"
import { useForm } from "react-hook-form"
import { useState } from "react"
import Divider from "@components/Divider"
import Button from "@components/Button"
import { useRouter } from "next/router"

const NewCompany = () => {
  const router = useRouter()
  const { register, handleSubmit } = useForm<{ name: string }>()

  const [apexDomains, setApexDomains] = useState<string[]>([])
  const [apexDomain, setApexDomain] = useState("")

  const onSubmit = handleSubmit(async (data) => {
    const result = await fetch("/api/companies", {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({
        ...data,
        apexDomains,
      }),
    })

    if (result.ok) {
      await router.push("/")
    }
  })

  return (
    <div>
      <div className="flex items-end mb-4">
        <h1 className="font-bold text-xl">New Company</h1>
      </div>

      <form
        className="shadow-lg border dark:border-opacity-10 rounded-xl dark:bg-dark-bg-800 grid grid-cols-6 row-auto overflow-hidden"
        onSubmit={onSubmit}
      >
        <TextField
          label="Name"
          {...register("name")}
          containerClassName="col-span-4 sm:col-span-2 px-6 pt-6"
        />

        <h2 className="col-span-6 mt-8 font-bold text-lg px-6 ">
          Apex Domains
        </h2>

        <Divider className="col-span-6" />

        <div className="col-span-6 px-6 ">
          {apexDomains.map((domain) => (
            <div key={domain} className="pb-4 flex items-center">
              <Button
                variant="outline"
                className="mr-4 !text-red-500 font-bold"
                onClick={() => {
                  setApexDomains(
                    apexDomains.filter(
                      (testedDomain) => testedDomain !== domain
                    )
                  )
                }}
              >
                Delete
              </Button>
              {domain}
            </div>
          ))}
        </div>

        <div className="col-span-6 sm:col-span-4 flex items-end px-6 ">
          <TextField
            name="domain"
            label="New domain"
            onChange={(e) => setApexDomain(e.target.value)}
            value={apexDomain}
            containerClassName="w-full"
          />

          <Button
            variant="outline"
            className="ml-4"
            onClick={() => {
              setApexDomains([...apexDomains, apexDomain])
              setApexDomain("")
            }}
          >
            Add
          </Button>
        </div>

        <div className="col-span-6 bg-dark-bg-700 bg-opacity-20 p-4 mt-8">
          <Button className="ml-auto" type="submit">
            Save
          </Button>
        </div>
      </form>
    </div>
  )
}

export default NewCompany
