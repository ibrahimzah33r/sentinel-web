const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

type CsrfTokenResponse = {
  token: string
}

export async function apiGet<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`)
  }

  return response.json() as Promise<T>
}

export async function apiPost<T>(
  path: string,
  body?: unknown,
): Promise<T> {
  const csrfToken = await getCsrfToken()

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: {
      'X-CSRF-TOKEN': csrfToken,
      ...(body
        ? {
          'Content-Type': 'application/json',
        }
        : {}),
    },
    credentials: 'include',
    body: body ? JSON.stringify(body) : undefined,
  })

  if (!response.ok) {
    throw new Error(
      `Request failed with status ${response.status}`,
    )
  }

  if (response.status === 204) {
    return undefined as T
  }

  return response.json() as Promise<T>
}

export async function apiPatch<T>(
  path: string,
): Promise<T> {
  const csrfToken = await getCsrfToken()

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'PATCH',
    headers: {
      'X-CSRF-TOKEN': csrfToken,
    },
    credentials: 'include',
  })

  if (!response.ok) {
    throw new Error(
      `Request failed with status ${response.status}`,
    )
  }

  return response.json() as Promise<T>
}

async function getCsrfToken(): Promise<string> {
  const response = await fetch(
    `${API_BASE_URL}/api/auth/csrf`,
    {
      credentials: 'include',
    },
  )

  if (!response.ok) {
    throw new Error(
      `CSRF request failed with status ${response.status}`,
    )
  }

  const data =
    (await response.json()) as CsrfTokenResponse

  return data.token
}
