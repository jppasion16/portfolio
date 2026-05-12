import { defineStore } from "pinia";
import { ref } from "vue";
import { api } from "../api/index";
import { useAppStore } from "./app";

interface Skill {
  id: number;
  name: string;
  category: string;
  level: number;
}

const apiUrl = "/api/skills";

export const useSkillsStore = defineStore("skills", () => {
  const appStore = useAppStore();
  const skills = ref<Skill[]>([]);
  const loading = ref(false);

  const loadSkills = async () => {
    if (skills.value.length > 0) return;
    loading.value = true;
    skills.value = await api<Skill[]>(apiUrl);
    loading.value = false;
  };

  const createSkill = async (body: object) => {
    if (!appStore.token) throw new Error("Unauthorized Request");

    loading.value = true;

    const skillRes = await api<Skill>(apiUrl, {
      method: "POST",
      body,
      token: appStore.token,
    });

    skills.value.push(skillRes);

    loading.value = false;
    return skillRes;
  };

  const updateSkill = async (body: object, id: number) => {
    if (!appStore.token) throw new Error("Unauthorized Request");

    loading.value = true;

    const skillRes = await api<Skill>(apiUrl + `/${id}`, {
      method: "PUT",
      body,
      token: appStore.token,
    });

    skills.value = skills.value.map((skill) =>
      skill.id === id ? skillRes : skill,
    );

    loading.value = false;
    return skillRes;
  };

  const deleteSkill = async (id: number) => {
    if (!appStore.token) throw new Error("Unauthorized Request");

    loading.value = true;

    const deleteRes = await api<{ success: boolean; message?: string }>(
      apiUrl + `/${id}`,
      {
        method: "DELETE",
        token: appStore.token,
      },
    );

    skills.value = skills.value.filter((skill) => skill.id !== id);

    loading.value = false;
    return deleteRes;
  };

  return {
    skills,
    loadSkills,
    createSkill,
    updateSkill,
    deleteSkill,
  };
});
