<template>
  <main class="relative flex min-h-full flex-col xl:flex-row">
    <div class="flex-1 flex flex-col">
      <div class="flex flex-col p-4 border-b-1 border-zinc-700">
        <p class="text-sm">
          &gt; <span class="text-green-400">ls</span> projects --all
        </p>
        <div
          v-if="projects.length"
          class="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-2 2xl:grid-cols-3"
        >
          <article
            v-for="project in projects"
            :key="project.id"
            class="flex flex-col gap-3 rounded border border-zinc-700 bg-zinc-900/60 p-3"
          >
            <div class="flex items-start justify-between gap-3">
              <div>
                <p class="text-xs text-zinc-500">project_{{ project.id }}</p>
                <h2 class="text-lg font-semibold text-green-400">
                  {{ project.name }}
                </h2>
              </div>
              <span
                class="shrink-0 rounded border px-2 py-1 text-xs"
                :class="
                  project.is_featured
                    ? 'border-green-400/40 text-green-300 bg-green-400/10'
                    : 'border-zinc-700 text-zinc-400'
                "
              >
                {{ project.is_featured ? "featured" : "archive" }}
              </span>
            </div>

            <p class="text-sm text-zinc-200 leading-6">
              {{ project.description }}
            </p>

            <div class="text-sm space-y-1">
              <p class="text-zinc-400">
                stack:
                <span class="text-blue-300">{{ project.stack }}</span>
              </p>
              <p class="text-zinc-400 truncate">
                repo:
                <a
                  v-if="project.repo_url"
                  :href="project.repo_url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-blue-300 hover:text-blue-200"
                >
                  {{ project.repo_url }}
                </a>
                <span v-else class="text-zinc-500">n/a</span>
              </p>
              <p class="text-zinc-400 truncate">
                live:
                <a
                  v-if="project.live_url"
                  :href="project.live_url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-green-300 hover:text-green-200"
                >
                  {{ project.live_url }}
                </a>
                <span v-else class="text-zinc-500">n/a</span>
              </p>
            </div>

            <div class="mt-auto flex flex-wrap gap-4 pt-2 text-sm">
              <a
                v-if="project.repo_url"
                :href="project.repo_url"
                target="_blank"
                rel="noopener noreferrer"
                class="text-blue-300 hover:text-blue-200"
              >
                &gt; open repo
              </a>
              <a
                v-if="project.live_url"
                :href="project.live_url"
                target="_blank"
                rel="noopener noreferrer"
                class="text-green-400 hover:text-green-300"
              >
                &gt; open live
              </a>
            </div>
          </article>
        </div>
        <div
          v-else
          class="mt-3 rounded border border-dashed border-zinc-700 p-4 text-zinc-500"
        >
          No projects found.
        </div>
      </div>

      <div class="flex flex-col p-4">
        <p class="text-sm">
          &gt; <span class="text-green-400">echo</span> $PROJECT_SUMMARY
        </p>
        <div class="grid md:grid-cols-3 gap-3 mt-3">
          <div class="rounded border border-zinc-700 p-3">
            <p class="text-xs text-zinc-500">total</p>
            <p class="text-2xl text-zinc-100">{{ projects.length }}</p>
          </div>
          <div class="rounded border border-zinc-700 p-3">
            <p class="text-xs text-zinc-500">featured</p>
            <p class="text-2xl text-green-300">{{ featuredProjects.length }}</p>
          </div>
          <div class="rounded border border-zinc-700 p-3">
            <p class="text-xs text-zinc-500">live deployments</p>
            <p class="text-2xl text-blue-300">{{ liveProjectsCount }}</p>
          </div>
        </div>
      </div>
    </div>

    <aside
      class="flex w-full flex-col border-zinc-700 border-t-1 xl:w-[320px] xl:flex-none xl:border-t-0 xl:border-l-1 2xl:w-[360px]"
    >
      <div class="p-4">
        <p class="text-sm">
          &gt; <span class="text-green-400">grep</span> featured projects.log
        </p>
        <div v-if="featuredProjects.length" class="mt-3 space-y-3">
          <div
            v-for="project in featuredProjects"
            :key="`featured-${project.id}`"
            class="rounded border border-zinc-700 p-3"
          >
            <p class="text-green-400 font-semibold">{{ project.name }}</p>
            <p class="text-sm text-zinc-400 mt-1 line-clamp-3">
              {{ project.description }}
            </p>
          </div>
        </div>
        <div
          v-else
          class="mt-3 rounded border border-dashed border-zinc-700 p-3 text-zinc-500"
        >
          No featured projects configured.
        </div>
      </div>

      <div class="border-t-1 border-zinc-700 p-4">
        <p class="text-sm">
          &gt; <span class="text-green-400">tail</span> links.out
        </p>
        <div class="mt-3 space-y-2 text-sm">
          <p class="text-zinc-400">
            repos:
            <span class="text-zinc-200">{{ repoProjectsCount }}</span>
          </p>
          <p class="text-zinc-400">
            latest_featured:
            <span class="text-green-300">
              {{ featuredProjects[0]?.name ?? "n/a" }}
            </span>
          </p>
          <p class="text-zinc-400">
            latest_live:
            <span class="text-blue-300">
              {{ liveProjects[0]?.name ?? "n/a" }}
            </span>
          </p>
        </div>
      </div>
    </aside>
  </main>
</template>

<script setup>
import { computed, onMounted, watch } from "vue";
import { storeToRefs } from "pinia";
import { useProjectsStore } from "../stores/projects";

const emits = defineEmits(["update:loading"]);

const projectsStore = useProjectsStore();
const { projects } = storeToRefs(projectsStore);

const featuredProjects = computed(() =>
  projects.value.filter((project) => project.is_featured),
);
const liveProjects = computed(() =>
  projects.value.filter((project) => Boolean(project.live_url)),
);
const liveProjectsCount = computed(() => liveProjects.value.length);
const repoProjectsCount = computed(
  () => projects.value.filter((project) => Boolean(project.repo_url)).length,
);

watch(
  () => projectsStore.loading,
  (isLoading) => {
    emits("update:loading", isLoading);
  },
);

onMounted(async () => {
  try {
    await projectsStore.loadProjects();
  } catch (err) {
    console.error(err);
  } finally {
    emits("update:loading", false);
  }
});
</script>
