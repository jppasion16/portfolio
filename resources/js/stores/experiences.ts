import { defineStore } from "pinia";
import { ref } from "vue";
import { api } from "../api/index";
import { useAppStore } from "./app";

interface Experience {
  id: number;
  company: string;
  role: string;
  description: string | null;
  start_date: string;
  end_date: string | null;
}

const apiUrl = "/api/experiences";

export const useExperiencesStore = defineStore("experiences", () => {
  const appStore = useAppStore();
  const experiences = ref<Experience[]>([]);
  const loading = ref(false);

  const loadExperiences = async () => {
    if (experiences.value.length > 0) return;
    loading.value = true;
    experiences.value = await api<Experience[]>(apiUrl);
    loading.value = false;
  };

  const createExperience = async (body: object) => {
    if (!appStore.token) throw new Error("Unauthorized Request");

    loading.value = true;

    const experienceRes = await api<Experience>(apiUrl, {
      method: "POST",
      body,
      token: appStore.token,
    });

    experiences.value.push(experienceRes);

    loading.value = false;
    return experienceRes;
  };

  const updateExperience = async (body: object, id: number) => {
    if (!appStore.token) throw new Error("Unauthorized Request");

    loading.value = true;

    const experienceRes = await api<Experience>(apiUrl + `/${id}`, {
      method: "PUT",
      body,
      token: appStore.token,
    });

    experiences.value = experiences.value.map((experience) =>
      experience.id === id ? experienceRes : experience,
    );

    loading.value = false;
    return experienceRes;
  };

  const deleteExperience = async (id: number) => {
    if (!appStore.token) throw new Error("Unauthorized Request");

    loading.value = true;

    const deleteRes = await api<{ success: boolean; message?: string }>(
      apiUrl + `/${id}`,
      {
        method: "DELETE",
        token: appStore.token,
      },
    );

    experiences.value = experiences.value.filter(
      (experience) => experience.id !== id,
    );

    loading.value = false;
    return deleteRes;
  };

  return {
    experiences,
    loadExperiences,
    createExperience,
    updateExperience,
    deleteExperience,
  };
});
