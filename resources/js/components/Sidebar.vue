<template>
  <div class="flex h-full min-h-0 flex-col z-20">
    <div class="border-b-1 border-zinc-700 p-2 lg:hidden">
      <button
        class="w-full cursor-pointer rounded border border-zinc-700 px-2 py-1 text-center text-xs text-zinc-400 transition-colors hover:bg-zinc-700 sm:text-sm"
        @click="showTerminal"
      >
        <span class="hidden sm:inline">Ctrl + K or </span>Click to open terminal
      </button>
    </div>
    <div class="flex-1 p-2">
      <p class="mb-4 text-sm">
        <span class="text-green-400">&gt;</span> navigation.exe
      </p>
      <ul class="grid gap-2 grid-cols-1">
        <router-link
          v-for="link in links"
          :to="link.url"
          :key="link.name.toLowerCase().replaceAll(' ', '_')"
          class="block"
          @click="handleNavigate"
        >
          <li
            class="h-full p-2 border-l-4"
            :class="{
              'border-transparent hover:border-zinc-600 hover:bg-zinc-800':
                !link.active,
              'border-green-400 bg-green-400/10 hover:bg-green-400/15':
                link.active,
            }"
          >
            <font-awesome-icon :icon="link.icon" class="mr-2" />
            {{ link.name }}
          </li>
        </router-link>
      </ul>
    </div>
  </div>
</template>
<script setup>
import { ref, watch } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const emits = defineEmits(["show:terminal", "navigate"]);

const links = ref([
  {
    name: "Home",
    url: "/",
    icon: "user",
  },
  {
    name: "Projects",
    url: "/projects",
    icon: "briefcase",
  },
  {
    name: "Experience",
    url: "/experience",
    icon: "building",
  },
  {
    name: "Contact",
    url: "/contact",
    icon: "envelope",
  },
]);

watch(
  () => route.path,
  (newPath) => {
    links.value.forEach((link) => {
      link.active = link.url === newPath;
    });
  },
  { immediate: true },
);

function showTerminal() {
  emits("show:terminal", true);
}

function handleNavigate() {
  emits("navigate");
}
</script>
