<template>
  <div class="p-4 flex flex-col">
    <p class="text-sm">
      &gt; <span class="text-green-400">skills</span>.overview
    </p>
    <div class="mt-4">
      <div
        v-for="category in categories"
        :key="category.id"
        class="mb-4 flex flex-col sm:flex-row xl:flex-col"
      >
        <div class="flex-1">
          <p class="text-zinc-200">{{ category.name }}</p>
        </div>

        <div
          class="flex flex-1 lg:w-full gap-1 text-xs text-zinc-400 sm:items-center sm:text-sm"
        >
          <span class="overflow-x-auto whitespace-nowrap">
            &lbrack;<span :class="category.colorClass">{{
              category.ratingBar
            }}</span
            >&rbrack;
          </span>
          <span class="text-right flex-1 ml-4">{{ category.level }}%</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed, ref, onMounted, onUnmounted } from "vue";
const barColorClasses = [
  "text-red-400",
  "text-orange-400",
  "text-yellow-400",
  "text-green-400",
  "text-blue-400",
  "text-indigo-400",
  "text-purple-400",
];
const props = defineProps({
  skills: {
    type: Array,
    required: true,
  },
});

const barLength = ref(25);

const categories = computed(() => {
  const categoryMap = {};
  let colorIdx = 0;
  props.skills.forEach((skill) => {
    if (!categoryMap[skill.category]) {
      categoryMap[skill.category] = {
        id: skill.category.toLowerCase().replace(/\s+/g, "_"),
        name: skill.category,
        ratingBar: "",
        count: 0,
      };

      const colorClass = barColorClasses[colorIdx];
      categoryMap[skill.category].colorClass = colorClass;

      colorIdx++;
    }
    categoryMap[skill.category].count++;

    // construct rating bar based on highest skill level in category
    if (
      categoryMap[skill.category].level < skill.level ||
      !categoryMap[skill.category].level ||
      !categoryMap[skill.category].ratingBar
    ) {
      categoryMap[skill.category].level = skill.level;
      const hashCount = Math.floor((skill.level * barLength.value) / 100);
      categoryMap[skill.category].ratingBar = "";
      for (let i = 0; i < barLength.value; i++) {
        if (i < hashCount) {
          categoryMap[skill.category].ratingBar += "#";
          continue;
        }
        categoryMap[skill.category].ratingBar += "-";
      }
    }
  });

  const categories = Object.values(categoryMap);
  const categoryOrder = [
    "backend",
    "frontend",
    "database",
    "devops",
    "design",
    "other",
  ];

  categories.sort((a, b) => {
    return categoryOrder.indexOf(a.id) - categoryOrder.indexOf(b.id);
  });

  return categories;
});

const handleResize = () => {
  barLength.value =
    window.innerWidth >= 1280
      ? 25
      : window.innerWidth >= 768
        ? 75
        : window.innerWidth >= 640
          ? 50
          : window.innerWidth >= 480
            ? 50
            : window.innerWidth >= 375
              ? 40
              : 30;
};

onMounted(() => {
  window.addEventListener("resize", handleResize);
  handleResize();
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});
</script>
