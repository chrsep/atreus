import { NextApiHandler } from "next"
import { withApiAuthRequired } from "@auth0/nextjs-auth0"
import { createHandler } from "@lib/rest"
import { addRootDomainsByCompanyId } from "@lib/db"
import { array, string } from "zod"

const PostBody = array(string())
const post: NextApiHandler = async (req, res) => {
  const companyId = string().parse(req.query.companyId)
  const body = PostBody.parse(req.body)

  const company = await addRootDomainsByCompanyId(parseInt(companyId, 10), body)

  res.json(company)
}

export default withApiAuthRequired(createHandler({ post }))
