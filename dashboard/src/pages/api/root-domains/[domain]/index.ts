import { string } from "zod"
import { NextApiHandler } from "next"
import { deleteRootDomain, findRootDomainById } from "@lib/db"
import { withApiAuthRequired } from "@auth0/nextjs-auth0"
import { createHandler } from "@lib/rest"

const del: NextApiHandler = async (req, res) => {
  const domain = string().parse(req.query.domain)
  const company = await deleteRootDomain(domain)
  res.json(company)
}

const get: NextApiHandler = async (req, res) => {
  const domain = string().parse(req.query.domain)
  const company = await findRootDomainById(domain)
  res.json(company)
}

export default withApiAuthRequired(createHandler({ del, get }))
