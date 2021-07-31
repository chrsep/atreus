/* eslint-disable no-fallthrough */
// noinspection FallThroughInSwitchStatementJS

import { NextApiHandler, NextApiResponse } from "next"

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
    switch (req.method?.toUpperCase()) {
      case "POST":
        if (handlers.post) {
          await handlers.post(req, res)
        } else {
          methodNotAllowed(res)
        }
        break
      case "GET":
        if (handlers.get) {
          await handlers.get(req, res)
        } else {
          methodNotAllowed(res)
        }
        break
      case "PATCH":
        if (handlers.patch) {
          await handlers.patch(req, res)
        } else {
          methodNotAllowed(res)
        }
        break
      case "PUT":
        if (handlers.put) {
          await handlers.put(req, res)
        } else {
          methodNotAllowed(res)
        }
        break
      case "DELETE":
        if (handlers.del) {
          await handlers.del(req, res)
        } else {
          methodNotAllowed(res)
        }
        break
      default: {
        methodNotAllowed(res)
      }
    }
  }
}

const methodNotAllowed = (res: NextApiResponse) => {
  res.status(405).json({
    error: "method_not_allowed",
    description:
      "The user does not have an active session or is not authenticated",
  })
}
