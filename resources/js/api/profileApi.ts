import { useAppStore } from "../stores/app";

export async function fetchProfile(): Promise<any> {
  const response = await fetch("/api/profiles/1");
  const data = await response.json();
  if (!data.success) throw new Error(data.message);
  return data.data;
}

export async function updateProfile(body: object) {
  const appStore = useAppStore();
  return await fetch("/api/profiles/1", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + appStore.token,
    },
    body: JSON.stringify(body),
  });
}
