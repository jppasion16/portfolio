<template>
  <header
    class="sticky top-0 z-11 flex items-center gap-3 px-2 py-2 transition-colors duration-200 lg:bg-transparent"
    :class="isScrolled ? 'bg-zinc-950' : 'bg-transparent'"
  >
    <h1
      class="break-all text-base font-bold sm:text-lg flex-1 cursor-pointer"
      @click="navigateHome"
    >
      <span class="text-green-400">jp</span>@<span class="text-blue-400"
        >portfolio</span
      >:{{ $route.path === "/" ? "~" : "~" + $route.path }}
    </h1>
    <div class="items-center hidden lg:flex">
      <button
        class="w-full cursor-pointer rounded border border-zinc-700 px-2 py-1 text-center text-xs text-zinc-400 transition-colors hover:bg-zinc-700 sm:w-auto sm:text-sm"
        @click="showTerminal"
      >
        Ctrl + K or Click to Open Terminal
      </button>
    </div>
    <div class="flex items-center lg:hidden">
      <button
        class="w-full cursor-pointer rounded border border-zinc-700 px-2 py-1 text-center text-xs text-zinc-400 transition-colors hover:bg-zinc-700 sm:w-auto sm:text-sm"
        @click="showSidebar"
      >
        <font-awesome-icon icon="fa-solid fa-ellipsis-vertical" />
      </button>
    </div>
  </header>
</template>
<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const emits = defineEmits(["show:sidebar", "show:terminal"]);
const windowScrolled = ref(false);
const panelScrolled = ref(false);
const isScrolled = computed(() => windowScrolled.value || panelScrolled.value);

let scrollTarget = null;

function navigateHome() {
  router.push("/");
}
function showSidebar() {
  emits("show:sidebar", true);
}
function showTerminal() {
  emits("show:terminal", true);
}

function updateScrollState() {
  windowScrolled.value = window.scrollY > 0;
  panelScrolled.value = scrollTarget ? scrollTarget.scrollTop > 0 : false;
}

onMounted(async () => {
  await nextTick();

  scrollTarget = document.querySelector("[data-header-scroll-target]");

  window.addEventListener("scroll", updateScrollState, { passive: true });
  scrollTarget?.addEventListener("scroll", updateScrollState, {
    passive: true,
  });

  updateScrollState();
});

onUnmounted(() => {
  window.removeEventListener("scroll", updateScrollState);
  scrollTarget?.removeEventListener("scroll", updateScrollState);
});
</script>
