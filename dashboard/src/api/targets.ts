type GetResponse = Array<{
  id: string
  name: string
}>
export const getTargets = async (): Promise<string> => {
  if (typeof window === "undefined") return ""
  try {
    const result =await fetch("/api/targets")
    return "success"
  } catch (e) {
    return "failed"
  }
}
