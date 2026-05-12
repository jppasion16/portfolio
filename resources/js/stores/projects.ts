import { defineStore } from "pinia";
import { ref } from "vue";
import { api } from "../api/index";
import { useAppStore } from "./app";

interface Project {
  id: number;
  name: string;
  description: string;
  stack: number;
  repo_url: string;
  live_url: string;
  is_featured: boolean;
}

const apiUrl = "/api/projects";

export const useProjectsStore = defineStore("projects", () => {
  const appStore = useAppStore();
  const projects = ref<Project[]>([]);
  const loading = ref(false);

  const loadProjects = async () => {
    if (projects.value.length > 0) return;
    loading.value = true;
    projects.value = await api<Project[]>(apiUrl);
    loading.value = false;
  };

  const createProject = async (body: object) => {
    if (!appStore.token) throw new Error("Unauthorized Request");

    loading.value = true;

    const projectRes = await api<Project>(apiUrl, {
      method: "POST",
      body,
      token: appStore.token,
    });

    projects.value.push(projectRes);

    loading.value = false;
    return projectRes;
  };

  const updateProject = async (body: object, id: number) => {
    if (!appStore.token) throw new Error("Unauthorized Request");

    loading.value = true;

    const projectRes = await api<Project>(apiUrl + `/${id}`, {
      method: "PUT",
      body,
      token: appStore.token,
    });

    projects.value = projects.value.map((p) => (p.id === id ? projectRes : p));

    loading.value = false;
    return projectRes;
  };

  const deleteProject = async (id: number) => {
    if (!appStore.token) throw new Error("Unauthorized Request");

    loading.value = true;

    const deleteRes = await api<{ success: boolean; message?: string }>(
      apiUrl + `/${id}`,
      {
        method: "DELETE",
        token: appStore.token,
      },
    );

    projects.value = projects.value.filter((p) => p.id !== id);

    loading.value = false;
    return deleteRes;
  };

  return {
    projects,
    loadProjects,
    createProject,
    updateProject,
    deleteProject,
  };
});
