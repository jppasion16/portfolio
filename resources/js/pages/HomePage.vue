<template>
  <main class="relative flex min-h-full flex-col xl:flex-row">
    <div class="flex-1 flex flex-col">
      <div class="flex flex-col p-4 relative w-full">
        <div class="flex flex-col">
          <p class="text-sm">&gt; <span class="text-green-400">whoami</span></p>
          <h1 class="py-4 text-2xl sm:text-3xl md:text-4xl text-center">
            <span class="text-green-300 text-4xl sm:text-5xl lg:text-6xl">{{
              profile.name
            }}</span>
            <br />&lt;<span class="text-blue-300">{{ profile.title }}</span>
            /&gt;
          </h1>
          <p class="text-zinc-200 my-2 text-center">{{ profile.bio }}</p>

          <div
            class="flex flex-col sm:flex-row items-center justify-center my-8 gap-4"
          >
            <button
              type="button"
              class="p-4 border border-green-400 outline-none min-w-[200px] cursor-pointer hover:bg-green-400/10 hover:text-green-400"
              @click="navigateToContact"
            >
              Contact Me
            </button>
            <button
              type="button"
              class="p-4 border border-zinc-400 outline-none min-w-[200px] cursor-pointer hover:bg-zinc-400/10"
              @click="requestResume"
            >
              Request Resume
            </button>
          </div>

          <p class="text-sm mt-4">
            <span class="text-green-400">tech_stack</span> = &lbrack;
          </p>

          <p class="break-words pl-6" v-html="skillArray"></p>
          &rbrack;;
          <p class="text-sm mt-4">
            <span class="text-green-400">status</span> = "<span
              class="py-2 max-w-md"
              :class="{
                'text-zinc-200': isAvailable,
                'text-red-300': !isAvailable,
              }"
            >
              {{
                isAvailable
                  ? "Available for new projects and opportunities"
                  : "Currently unavailable"
              }}";
            </span>
          </p>
        </div>
      </div>
      <div class="flex flex-col border-t-1 border-zinc-700 p-4">
        <Services :services />
      </div>
    </div>
    <div
      class="flex w-full flex-col bg-zinc-950/75 border-zinc-700 border-t-1 xl:w-[320px] xl:flex-none xl:border-t-0 xl:border-l-1 2xl:w-[360px]"
    >
      <div>
        <SkillsOverview :skills />
      </div>
      <div class="flex-1 border-t-1 border-zinc-700 p-4">
        <p class="text-sm">
          &gt; <span class="text-green-400">ls projects --recent</span>
        </p>
        <div class="flex flex-col gap-3 mt-4">
          <article
            v-for="project in projects"
            :key="project.id"
            class="flex flex-col gap-2 rounded border border-zinc-700 p-3 bg-zinc-900/60"
          >
            <h2 class="text-base font-semibold text-green-400">
              {{ project.name }}
            </h2>
            <p class="text-sm text-zinc-200 line-clamp-4">
              {{ project.description }}
            </p>
            <p class="text-xs text-zinc-400">
              stack:
              <span class="text-blue-300">{{ project.stack }}</span>
            </p>
            <a class="text-sm inline" :href="project.live_url" target="_blank">
              &gt; <span class="text-green-400">view project</span>
            </a>
          </article>
        </div>
      </div>
    </div>
  </main>
</template>
<script setup>
import SkillsOverview from "../components/home/SkillsOverview.vue";
import Services from "../components/home/Services.vue";
import { onMounted, computed, watch } from "vue";
import { useAppStore } from "../stores/app";
import { useProfileStore } from "../stores/profile";
import { useProjectsStore } from "../stores/projects";
import { useSkillsStore } from "../stores/skills";
import { useServicesStore } from "../stores/services";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";

const navigateToContact = (query = null) => {
  if (typeof query === "object") query = null;
  const path = "/contact";
  const route = path + (query ? `?${query}` : "");
  router.push(route);
};

const requestResume = () => {
  navigateToContact("type=resume");
};

const router = useRouter();
const profileStore = useProfileStore();
const projectsStore = useProjectsStore();
const skillsStore = useSkillsStore();
const servicesStore = useServicesStore();

const { profile } = storeToRefs(profileStore);
const { projects } = storeToRefs(projectsStore);
const { skills } = storeToRefs(skillsStore);
const skillArray = computed(() =>
  skills.value
    .map((skill) => `"<span class='${skill.color}'>${skill.name}</span>"`)
    .join(", "),
);
const { services } = storeToRefs(servicesStore);
const isAvailable = computed(() => profile.value.is_available);
const emits = defineEmits(["update:loading"]);
watch(
  () =>
    profileStore.loading ||
    projectsStore.loading ||
    skillsStore.loading ||
    servicesStore.loading,
  (isLoading) => {
    emits("update:loading", isLoading);
  },
);
watch(
  () => profile.value,
  () => {
    useAppStore().contacts = {
      email: profile.value.email,
      github: profile.value.github,
      linkedin: profile.value.linkedin,
      location: profile.value.location,
    };
  },
);
onMounted(async () => {
  try {
    await Promise.all([
      profileStore.loadProfile(),
      projectsStore.loadProjects(),
      skillsStore.loadSkills(),
      servicesStore.loadServices(),
    ]);
  } catch (err) {
    console.error(err);
  }
});
</script>
