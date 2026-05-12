<template>
  <main class="relative flex min-h-full flex-col xl:flex-row">
    <div class="flex-1 flex flex-col">
      <div class="flex flex-col p-4">
        <p class="text-sm">
          &gt; <span class="text-green-400">ls</span> experiences --timeline
        </p>
        <div v-if="experiences.length" class="mt-4 space-y-4">
          <article
            v-for="experience in experiences"
            :key="experience.id"
            class="rounded border border-zinc-700 bg-zinc-900/60 p-4"
          >
            <div
              class="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between"
            >
              <div>
                <p class="text-xs text-zinc-500">entry_{{ experience.id }}</p>
                <h2 class="text-xl font-semibold text-green-400">
                  {{ experience.role }}
                </h2>
                <p class="text-blue-300 mt-1">{{ experience.company }}</p>
              </div>
              <div
                class="rounded border px-3 py-2 text-sm"
                :class="
                  experience.end_date
                    ? 'border-zinc-700 text-zinc-300'
                    : 'border-green-400/40 text-green-300 bg-green-400/10'
                "
              >
                {{
                  formatDateRange(experience.start_date, experience.end_date)
                }}
              </div>
            </div>

            <p class="mt-4 text-zinc-200 leading-6 whitespace-pre-wrap">
              {{ experience.description }}
            </p>
          </article>
        </div>
        <div
          v-else
          class="mt-4 rounded border border-dashed border-zinc-700 p-4 text-zinc-500"
        >
          No experience entries found.
        </div>
      </div>
    </div>

    <aside
      class="flex w-full flex-col border-zinc-700 border-t-1 xl:w-[320px] xl:flex-none xl:border-t-0 xl:border-l-1 2xl:w-[360px]"
    >
      <div class="p-4">
        <p class="text-sm">
          &gt; <span class="text-green-400">wc</span> -l experience.log
        </p>
        <div class="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-1">
          <div class="rounded border border-zinc-700 p-3">
            <p class="text-xs text-zinc-500">entries</p>
            <p class="text-2xl text-zinc-100">{{ experiences.length }}</p>
          </div>
          <div class="rounded border border-zinc-700 p-3">
            <p class="text-xs text-zinc-500">current</p>
            <p class="text-2xl text-green-300">{{ activeRolesCount }}</p>
          </div>
        </div>
      </div>

      <div class="border-t-1 border-zinc-700 p-4">
        <p class="text-sm">
          &gt; <span class="text-green-400">cut</span> -f company companies.txt
        </p>
        <div
          v-if="companies.length"
          class="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-1"
        >
          <div
            v-for="company in companies"
            :key="company"
            class="rounded border border-zinc-700 px-3 py-2 text-sm text-zinc-300"
          >
            {{ company }}
          </div>
        </div>
        <div
          v-else
          class="mt-3 rounded border border-dashed border-zinc-700 p-3 text-zinc-500"
        >
          No companies listed yet.
        </div>
      </div>

      <div class="border-t-1 border-zinc-700 p-4">
        <p class="text-sm">
          &gt; <span class="text-green-400">echo</span> $CURRENT_ROLE
        </p>
        <p class="mt-3 text-sm text-zinc-400">
          {{ currentRoleSummary }}
        </p>
      </div>
    </aside>
  </main>
</template>

<script setup>
import { computed, onMounted, watch } from "vue";
import { storeToRefs } from "pinia";
import { useExperiencesStore } from "../stores/experiences";

const emits = defineEmits(["update:loading"]);

const experiencesStore = useExperiencesStore();
const { experiences } = storeToRefs(experiencesStore);

const companies = computed(() =>
  [
    ...new Set(experiences.value.map((experience) => experience.company)),
  ].filter(Boolean),
);
const activeRoles = computed(() =>
  experiences.value.filter((experience) => !experience.end_date),
);
const activeRolesCount = computed(() => activeRoles.value.length);
const currentRoleSummary = computed(() => {
  if (!activeRoles.value.length) return "No active role in timeline.";

  const currentRole = activeRoles.value[0];
  return `${currentRole.role} @ ${currentRole.company}`;
});

const formatDate = (date) => {
  if (!date) return "Present";

  const [year, month] = date.split("-");
  return `${year}.${month}`;
};

const formatDateRange = (startDate, endDate) =>
  `${formatDate(startDate)} -> ${formatDate(endDate)}`;

watch(
  () => experiencesStore.loading,
  (isLoading) => {
    emits("update:loading", isLoading);
  },
);

onMounted(async () => {
  try {
    await experiencesStore.loadExperiences();
  } catch (err) {
    console.error(err);
  } finally {
    emits("update:loading", false);
  }
});
</script>
