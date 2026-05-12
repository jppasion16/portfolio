<template>
  <div
    class="w-3/4 h-3/4 bg-zinc-900 border-zinc-700 border rounded overflow-y-auto z-100 flex flex-col"
    @click.stop
  >
    <div
      class="bg-zinc-800 flex-1 border-l-1 border-zinc-700 flex flex-col p-4"
    >
      <p class="text-lg font-semibold mb-2">Edit:</p>
      <textarea
        v-model="textArea"
        class="flex-1 w-full outline-none"
      ></textarea>
    </div>
    <div class="flex justify-center items-center p-4">
      <button
        type="button"
        @click="appStore.terminalMode = 'default'"
        class="p-2 border border-zinc-200 focus:border-green-400 outline-none"
      >
        Cancel
      </button>
      <button
        type="button"
        @click="handleSave"
        class="p-2 border border-zinc-200 focus:border-green-400 outline-none ml-2"
      >
        Save
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useAppStore } from "../../stores/app";

import { useExperiencesStore } from "../../stores/experiences";
import { useProjectsStore } from "../../stores/projects";
import { useSkillsStore } from "../../stores/skills";
import { useServicesStore } from "../../stores/services";

const fields = {
  experiences: ["company", "role", "description", "start_date", "end_date"],
  projects: [
    "name",
    "description",
    "stack",
    "repo_url",
    "live_url",
    "is_featured",
  ],
  services: ["code", "name", "description", "icon", "order"],
  skills: ["name", "category", "level", "order", "color"],
};

const appStore = useAppStore();
const textArea = ref("");

const populateTextArea = () => {
  if (!fields[appStore.addTarget]) return;

  const data = {};
  fields[appStore.addTarget].forEach((field) => {
    data[field] = "";
  });

  textArea.value = JSON.stringify(data, null, 2);
};

populateTextArea();

const handleSave = async () => {
  try {
    const data = JSON.parse(textArea.value);

    switch (appStore.addTarget.toLowerCase()) {
      case "experiences":
        await useExperiencesStore().createExperience(data);
        break;
      case "projects":
        await useProjectsStore().createProject(data);
        break;
      case "skills":
        await useSkillsStore().createSkill(data);
        break;
      case "services":
        await useServicesStore().createService(data);
        break;
    }

    populateTextArea();
  } catch (e) {
    console.log(e);
  }
};
</script>
