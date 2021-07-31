const prefix = "/api"

export const patch = async <T, K>(
  url: string,
  body: K
): Promise<{ data: T; status: number; ok: boolean }> => {
  const result = await fetch(prefix + url, {
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    method: "PATCH",
    body: JSON.stringify(body),
  })

  const data = await result.json()
  return {
    data,
    ok: result.ok,
    status: result.status,
  }
}

export const del = async <T>(
  url: string
): Promise<{ data: T | null; status: number; ok: boolean }> => {
  const result = await fetch(prefix + url, {
    credentials: "include",
    method: "DELETE",
  })

  let data: T | null
  try {
    data = await result.json()
  } catch (e) {
    data = null
  }
  return {
    data,
    ok: result.ok,
    status: result.status,
  }
}

export const post = async <T, K>(
  url: string,
  body: K
): Promise<{ data: T; status: number; ok: boolean }> => {
  const result = await fetch(prefix + url, {
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    method: "POST",
    body: JSON.stringify(body),
  })

  const data = await result.json()
  return {
    data,
    ok: result.ok,
    status: result.status,
  }
}
