interface Target {
  name: string
  scopes: string[]
}

export const getTargets = async (): Promise<Target[]> => {
  if (typeof window === "undefined") return []
  try {
    const result = await fetch("/api/targets")
    return await result.json()
  } catch (e) {
    return []
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
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
    })
  } catch (e) {
    console.log("failed request")
  }
}
