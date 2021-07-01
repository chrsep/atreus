import { NextApiHandler } from "next"
import { withApiAuthRequired } from "@auth0/nextjs-auth0"
import { createHandler } from "@lib/rest"
import { findAllCompanies, insertNewCompany } from "@lib/db"
import { array, object, string } from "zod"

const get: NextApiHandler = async (req, res) => {
  const companies = await findAllCompanies()

  res.json(companies)
}

const postBody = object({
  name: string(),
  scopes: array(string()).min(1),
})

const post: NextApiHandler = async (req, res) => {
  const body = postBody.parse(JSON.parse(req.body))

  const newCompany = await insertNewCompany(body.name, body.scopes)

  res.json(newCompany)
}

export default withApiAuthRequired(createHandler({ get, post }))
