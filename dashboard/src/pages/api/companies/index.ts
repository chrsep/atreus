import { NextApiHandler } from "next"
import { withApiAuthRequired } from "@auth0/nextjs-auth0"
import { createHandler } from "@lib/rest"
import { findAllCompanies } from "@lib/db"

const get: NextApiHandler = async (req, res) => {
  const companies = await findAllCompanies()

  res.json(companies)
}

export default withApiAuthRequired(createHandler({ get }))
