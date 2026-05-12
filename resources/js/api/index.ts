interface ApiOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE" | null;
  body?: object | null;
  token?: string | null;
}

export async function api<T>(
  url: string,
  { method = "GET", body = null, token = null }: ApiOptions = {},
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  const reqInit: RequestInit = {};

  if (method) reqInit.method = method;
  if (body) reqInit.body = JSON.stringify(body);
  if (token) headers["Authorization"] = "Bearer " + token;

  reqInit.headers = headers;

  const res = await fetch(url, reqInit);
  const json = await res.json();

  if (!json.success) {
    throw new Error(json.message);
  }

  return json.data ?? json;
}
