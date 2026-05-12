import { useAppStore } from "../stores/app";

export async function login(email: string, password: string) {
  if (useAppStore().token) return true;
  return await fetch("/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  })
    .then((res) => res.json())
    .then((json) => {
      if (!json.success) {
        throw new Error(json.message);
      }
      useAppStore().setToken(json.token);
      localStorage.setItem("token", json.token);
    });
}

export async function logout() {
  return useAppStore().token && useAppStore().setToken(null) == null;
}
