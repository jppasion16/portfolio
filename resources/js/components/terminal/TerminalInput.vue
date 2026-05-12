<template>
  <div class="flex">
    <form @submit.prevent="submitCommand" class="w-full flex">
      <span>&gt;</span>
      <input
        ref="inputEl"
        v-model.trim="input"
        @keydown.arrow-up="historyUp"
        @keydown.arrow-down="historyDown"
        @blur="appStore.terminalMode === 'default' && inputEl?.focus()"
        type="text"
        autocomplete="off"
        class="bg-transparent focus:outline-none flex-1 ml-2"
        :disabled="loading"
      />
    </form>
  </div>
</template>
<script setup>
import { computed, nextTick, ref, watch, onMounted } from "vue";
import { useAppStore } from "../../stores/app";
const appStore = useAppStore();
const props = defineProps({
  showTerminal: {
    type: Boolean,
    required: true,
  },
  loading: {
    type: Boolean,
    required: true,
  },
  history: {
    type: Array,
    required: true,
  },
});
const input = ref("");
const emits = defineEmits(["submit"]);
const inputEl = ref(null);
const inputHistory = computed(() =>
  props.history
    .filter((item) => item.type === "input")
    .map((item) => item.lines[0]),
);
const historyCursor = ref(0);
watch(
  () => props.showTerminal,
  (show) => {
    show && nextTick(() => inputEl.value?.focus());
  },
);

watch(
  () => props.history,
  () => {
    historyCursor.value = inputHistory.value.length;
  },
  { deep: true },
);

watch(
  () => props.loading,
  (isLoading) => {
    !isLoading && nextTick(() => inputEl.value?.focus());
  },
  { deep: true },
);

onMounted(() => {
  inputEl.value?.focus();
});

function submitCommand() {
  if (!input.value) return;
  emits("submit", input.value);
  input.value = "";
}

function historyUp() {
  if (historyCursor.value > 0) {
    historyCursor.value--;
    input.value = inputHistory.value[historyCursor.value] || "";
  }
}

function historyDown() {
  if (historyCursor.value < inputHistory.value.length) {
    historyCursor.value++;
    input.value = inputHistory.value[historyCursor.value] || "";
  }
}
</script>
