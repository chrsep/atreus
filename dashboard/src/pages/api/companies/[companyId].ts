import { NextApiHandler } from "next"
import { withApiAuthRequired } from "@auth0/nextjs-auth0"
import { createHandler } from "@lib/rest"
import { deleteCompanyById, findAllCompanies } from "@lib/db"

const patch: NextApiHandler = async (req, res) => {
  const companies = await findAllCompanies()

  res.json(companies)
}

const del: NextApiHandler = async (req, res) => {
  const { companyId } = req.query

  await deleteCompanyById(parseInt(companyId as string, 10))

  res.status(201).end()
}

export default withApiAuthRequired(createHandler({ patch, del }))
