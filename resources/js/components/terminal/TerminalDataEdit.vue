<template>
  <div
    class="w-3/4 h-3/4 bg-zinc-900 border-zinc-700 border rounded overflow-y-auto z-100 flex flex-col"
    @click.stop
  >
    <div class="flex flex-1">
      <div class="bg-zinc-700 w-[50%] p-4 flex flex-col">
        <p class="text-lg font-semibold mb-2">Original:</p>
        <pre class="whitespace-pre-wrap flex-1">{{ editData }}</pre>
      </div>
      <div
        class="bg-zinc-800 flex-1 border-l-1 border-zinc-700 flex flex-col p-4"
      >
        <p class="text-lg font-semibold mb-2">Edit:</p>
        <textarea
          v-model="textArea"
          class="flex-1 w-full outline-none"
        ></textarea>
      </div>
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
import { useAppStore } from "../../stores/app";
import { ref } from "vue";
import { api } from "../../api/index";

import { useExperiencesStore } from "../../stores/experiences";
import { useProjectsStore } from "../../stores/projects";
import { useSkillsStore } from "../../stores/skills";
import { useServicesStore } from "../../stores/services";

const appStore = useAppStore();
const editData = ref({});
const textArea = ref("");

try {
  api(`/api/${appStore.editData.target}/${appStore.editData.id}`).then(
    (data) => {
      editData.value = data;
      textArea.value = JSON.stringify(data, null, 2);
    },
  );
} catch (e) {
  console.log(e);
}

const handleSave = () => {
  appStore.loading = true;
  const body = JSON.parse(textArea.value);
  const target = appStore.editData.target;

  if (!appStore.token) throw new Error("Unauthorized Request");
  if (!body) throw new Error("Invalid Data");

  switch (target.toLowerCase()) {
    case "experiences":
      useExperiencesStore().updateExperience(body, appStore.editData.id);
      break;
    case "projects":
      useProjectsStore().updateProject(body, appStore.editData.id);
      break;
    case "skills":
      useSkillsStore().updateSkill(body, appStore.editData.id);
      break;
    case "services":
      useServicesStore().updateService(body, appStore.editData.id);
      break;
  }

  appStore.terminalMode = "default";
};
</script>
