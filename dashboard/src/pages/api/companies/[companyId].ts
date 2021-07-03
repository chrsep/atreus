import { NextApiHandler } from "next"
import { withApiAuthRequired } from "@auth0/nextjs-auth0"
import { createHandler } from "@lib/rest"
import { findAllCompanies, insertNewCompany } from "@lib/db"
import { array, object, string } from "zod"

const patch: NextApiHandler = async (req, res) => {
  const companies = await findAllCompanies()

  res.json(companies)
}

export default withApiAuthRequired(createHandler({ patch }))
