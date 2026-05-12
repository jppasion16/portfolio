<template>
  <MovingBg2>
    <div
      class="relative flex min-h-screen flex-col font-mono text-zinc-200 lg:h-screen"
    >
      <div
        class="absolute top-0 left-0 right-0 bottom-0 bg-zinc-800 flex items-center justify-center overflow-hidden z-200"
        v-show="loading"
      >
        <span class="text-sm text-zinc-400">Loading...</span>
      </div>
      <Header
        @show:sidebar="showSidebar = $event"
        @show:terminal="openTerminal"
      />
      <div class="flex flex-1 min-h-0 flex-col gap-2 px-2 pb-2 lg:flex-row">
        <div
          class="hidden bg-zinc-950/75 border-zinc-700 border lg:flex lg:w-[260px] lg:flex-none lg:flex-col xl:w-[280px]"
        >
          <Sidebar class="flex-1 min-h-0" @show:terminal="openTerminal" />
          <Footer :contacts="appStore.contacts" />
        </div>
        <div
          class="flex min-h-[45vh] flex-1 flex-col bg-zinc-950/75 border-zinc-700 border lg:min-h-0"
        >
          <div
            class="flex-1 min-h-0 overflow-x-hidden overflow-y-auto"
            data-header-scroll-target
          >
            <router-view @update:loading="loading = $event" />
          </div>
        </div>
      </div>
      <div class="px-2 pb-2 lg:hidden">
        <div class="border border-zinc-700 bg-zinc-950/75">
          <Footer :contacts="appStore.contacts" />
        </div>
      </div>

      <div
        v-show="showSidebar"
        class="fixed inset-0 z-40 bg-zinc-950/75 p-3 sm:p-4 lg:hidden"
        @click="showSidebar = false"
      >
        <div
          class="h-full w-[min(80vw,320px)] overflow-y-auto border border-zinc-700 bg-zinc-900"
          @click.stop
        >
          <Sidebar
            @show:terminal="openTerminal"
            @navigate="showSidebar = false"
          />
        </div>
      </div>

      <div
        v-show="showTerminal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/75 p-3 sm:p-4"
        @click="showTerminal = false"
      >
        <TerminalWindow
          :showTerminal
          v-if="appStore.terminalMode === 'default'"
        />
        <TerminalLogin v-if="appStore.terminalMode === 'login'" />
        <TerminalDataEdit
          :terminalData
          v-if="appStore.terminalMode === 'edit'"
        />
        <TerminalDataAdd v-if="appStore.terminalMode === 'add'" />
      </div>
    </div>
  </MovingBg2>
</template>

<script setup>
import MovingBg from "./components/MovingBg.vue";
import MovingBg2 from "./components/MovingBg2.vue";
import { useRoute } from "vue-router";
import Header from "./components/Header.vue";
import Sidebar from "./components/Sidebar.vue";
import Footer from "./components/Footer.vue";
import TerminalWindow from "./components/terminal/TerminalWindow.vue";
import TerminalLogin from "./components/terminal/TerminalLogin.vue";
import { ref, watch, onMounted, onUnmounted } from "vue";
import TerminalDataEdit from "./components/terminal/TerminalDataEdit.vue";
import TerminalDataAdd from "./components/terminal/TerminalDataAdd.vue";
import { useAppStore } from "./stores/app";

const appStore = useAppStore();
const route = useRoute();
const loading = ref(true);

const showTerminal = ref(false);
const showSidebar = ref(false);
const terminalData = ref({});

appStore.token = localStorage.getItem("token") ?? null;

watch(
  () => terminalData.value,
  (data) => {
    if (data.mode) appStore.terminalMode = data.mode;
  },
);

watch(
  () => route.path,
  () => {
    showSidebar.value = false;
  },
);

const openTerminal = () => {
  showSidebar.value = false;
  showTerminal.value = true;
};

const handleKeydown = (e) => {
  // Ctrl + K to open terminal, Escape to close
  if (e.ctrlKey && e.key.toLowerCase() === "k") {
    e.preventDefault();
    openTerminal();
  } else if (e.key === "Escape") {
    if (showTerminal.value) {
      showTerminal.value = false;
      return;
    }
    showSidebar.value = false;
  }
};

onMounted(() => {
  window.addEventListener("keydown", handleKeydown);
});
onUnmounted(() => {
  window.removeEventListener("keydown", handleKeydown);
});
</script>

<style>
/* 1. The container (the entire scrollbar area) */
::-webkit-scrollbar {
  width: 10px; /* Width of vertical scrollbar */
  height: 10px; /* Height of horizontal scrollbar */
}

/* 2. The track (the background of the scrollbar) */
::-webkit-scrollbar-track {
  background: #18181b; /* zinc-900 */
  border-radius: 5px;
}

/* 3. The thumb (the draggable part) */
::-webkit-scrollbar-thumb {
  background: #3f3f46; /* zinc-700 */
  border-radius: 5px;
  border: 2px solid #18181b; /* adds padding effect around thumb */
}

/* 4. The thumb on hover */
::-webkit-scrollbar-thumb:hover {
  background: #52525b; /* zinc-600 */
}

/* Firefox Support */
* {
  scrollbar-width: thin;
  scrollbar-color: #3f3f46 #18181b; /* thumb color | track color */
}
</style>
