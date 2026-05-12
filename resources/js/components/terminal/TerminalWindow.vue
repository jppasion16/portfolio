<template>
  <div
    class="w-3/4 h-3/4 bg-zinc-900 border-zinc-700 border rounded overflow-y-auto z-100"
    ref="terminalContainer"
    tabindex="-1"
    @click.stop
  >
    <div
      class="flex flex-col bg-zinc-900 p-4 border-t-1 border-zinc-700 font-mono text-sm"
      tabindex="-1"
    >
      <TerminalHistory :history />
      <TerminalInput @submit="handleCommand" :history :loading :showTerminal />
    </div>
  </div>
</template>
<script setup>
import { ref, watch, nextTick } from "vue";
import TerminalHistory from "./TerminalHistory.vue";
import TerminalInput from "./TerminalInput.vue";
import { commands } from "../../terminal/commands";
import { useAppStore } from "../../stores/app";

const appStore = useAppStore();
const props = defineProps({
  showTerminal: {
    type: Boolean,
    required: true,
  },
});

function addInput(line) {
  line = line.trim();
  if (line === "") return;
  history.value.push({
    id: history.value.length + 1,
    type: "input",
    lines: [line],
  });
}

function addOutput(lines) {
  history.value.push({
    id: history.value.length + 1,
    type: "output",
    lines: lines,
  });
}

function handleCommand(command) {
  addInput(command);

  const parts = command.toLowerCase().trim().split(/\s+/);

  const func = cmd[parts[0]];
  const args = parts.slice(1);

  if (func) {
    func(...args);
    return;
  }

  addOutput([
    /*html*/ `<span class='text-red-400'>Command not found:</span> ${command}`,
    /*html*/ `Type <span class='text-green-400'>help</span> for available commands`,
  ]);
}

const terminalContainer = ref(null);
const history = ref([
  {
    id: 1,
    type: "output",
    lines: [
      /*html*/ `Type <span class='text-green-400'>help</span> for available commands`,
    ],
  },
]);
const loading = ref(false);
const cmd = commands({
  history,
  addOutput,
  loading,
});

watch(
  () => history.value.length,
  async () => {
    if (appStore.terminalMode !== "default") return;
    await nextTick();

    const el = terminalContainer.value;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  },
);
</script>
