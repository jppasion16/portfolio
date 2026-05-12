export async function fetchProfile(): Promise<any> {
  const response = await fetch("/api/profiles/1");
  const data = await response.json();
  if (!data.success) throw new Error(data.message);
  return data.data;
}

export async function fetchSkills(id: number | null = null): Promise<any> {
  const response = await fetch("/api/skills" + (id ? `/${id}` : ""));
  const data = await response.json();
  if (!data.success) throw new Error(data.message);
  return data.data;
}

export async function fetchProjects(id: number | null = null): Promise<any> {
  const response = await fetch("/api/projects" + (id ? `/${id}` : ""));
  const data = await response.json();
  if (!data.success) throw new Error(data.message);
  return data.data;
}

export async function fetchExperiences(id: number | null = null): Promise<any> {
  const response = await fetch("/api/experiences" + (id ? `/${id}` : ""));
  const data = await response.json();
  if (!data.success) throw new Error(data.message);
  return data.data;
}

export async function fetchServices(id: number | null = null): Promise<any> {
  const response = await fetch("/api/services" + (id ? `/${id}` : ""));
  const data = await response.json();
  if (!data.success) throw new Error(data.message);
  return data.data;
}
