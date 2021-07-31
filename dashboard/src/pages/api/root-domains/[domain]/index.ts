import { boolean, object, string, TypeOf } from "zod"
import { NextApiHandler } from "next"
import { deleteRootDomain, findRootDomainById, updateRootDomain } from "@lib/db"
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

const PatchBody = object({
  confirmed: boolean(),
})

export type PatchRootDomainBody = TypeOf<typeof PatchBody>

const patch: NextApiHandler = async (req, res) => {
  const domain = string().parse(req.query.domain)
  let body = PatchBody.parse(req.body)

  body = await updateRootDomain(domain, body.confirmed)
  res.json(body)
}

export default withApiAuthRequired(createHandler({ del, get, patch }))
