import { string } from "zod"
import { NextApiHandler } from "next"
import { deleteScopeByDomain } from "@lib/db"
import { withApiAuthRequired } from "@auth0/nextjs-auth0"
import { createHandler } from "@lib/rest"

const del: NextApiHandler = async (req, res) => {
  const domain = string().parse(req.query.domain)

  const company = await deleteScopeByDomain(domain)

  res.json(company)
}

export default withApiAuthRequired(createHandler({ del }))
