<template>
  <div class="flex flex-col flex-1 overflow-y-auto">
    <TerminalMessage v-for="item in history" :key="item.id" :item />
  </div>
</template>
<script setup>
import TerminalMessage from "./TerminalMessage.vue";

const props = defineProps({
  history: {
    type: Array,
    required: true,
  },
});
</script>
