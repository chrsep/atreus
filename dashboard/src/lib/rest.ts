/* eslint-disable no-fallthrough */
// noinspection FallThroughInSwitchStatementJS

import { NextApiHandler } from "next"

interface Handler {
  get?: NextApiHandler
  post?: NextApiHandler
  put?: NextApiHandler
  patch?: NextApiHandler
  del?: NextApiHandler
}

/** handles requests based on their methods */
export function createHandler(handlers: Handler): NextApiHandler {
  return async (req, res) => {
    switch (req.method) {
      case "POST":
        if (handlers.post) {
          await handlers.post(req, res)
          break
        }
      case "GET":
        if (handlers.get) {
          await handlers.get(req, res)
          break
        }
      case "PUT":
        if (handlers.put) {
          await handlers.put(req, res)
          break
        }
      case "PATCH":
        if (handlers.patch) {
          await handlers.patch(req, res)
          break
        }
      case "DELETE":
        if (handlers.del) {
          await handlers.del(req, res)
          break
        }
      default: {
        res.status(401).json({
          error: "not_authenticated",
          description:
            "The user does not have an active session or is not authenticated",
        })
      }
    }
  }
}
