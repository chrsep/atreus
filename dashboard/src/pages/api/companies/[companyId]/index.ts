import { NextApiHandler } from "next"
import { withApiAuthRequired } from "@auth0/nextjs-auth0"
import { createHandler } from "@lib/rest"
import { deleteCompanyById, findCompanyById, patchCompanyById } from "@lib/db"
import { object, string } from "zod"

const PatchBody = object({
  name: string(),
  bountyLink: string(),
  icon: string(),
}).partial()
const patch: NextApiHandler = async (req, res) => {
  const { companyId } = req.query

  const body = PatchBody.parse(req.body)
  const companies = await patchCompanyById(
    parseInt(companyId as string, 10),
    body
  )

  res.json(companies)
}

const del: NextApiHandler = async (req, res) => {
  const { companyId } = req.query

  await deleteCompanyById(parseInt(companyId as string, 10))

  res.status(201).end()
}

const get: NextApiHandler = async (req, res) => {
  const { companyId } = req.query
  const company = await findCompanyById(parseInt(companyId as string, 10))

  res.json(company)
}

export default withApiAuthRequired(createHandler({ patch, del, get }))
