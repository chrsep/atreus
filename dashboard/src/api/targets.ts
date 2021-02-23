type GetResponse = Array<{
  id: string
  name: string
}>
export const getTargets = async (): Promise<string> => {
  if (typeof window === "undefined") return ""
  try {
    const result = await fetch("/api/targets")
    return "success"
  } catch (e) {
    return "failed"
  }
}

interface PostPayload {
  name: string
  scopes: string[]
}

export const postTargets = async (payload: PostPayload): Promise<string> => {
  if (typeof window === "undefined") return ""
  try {
    const result = await fetch("/api/targets", {
      method: "post",
      body: JSON.stringify(payload)
    })
  } catch (e) {
    console.log("failed request")
  }
}
