<template>
  <p
    v-if="item.type === 'input' && !item.cleared"
    class="text-zinc-400 break-words"
  >
    &gt;<span class="ml-2">{{ item.lines[0] }}</span>
  </p>
  <p
    v-else-if="item.type === 'output'"
    v-for="line in item.lines"
    class="text-zinc-400 break-words"
    v-html="line"
  ></p>
</template>

<script setup>
defineProps({
  item: {
    type: Object,
    required: true,
  },
});
</script>
