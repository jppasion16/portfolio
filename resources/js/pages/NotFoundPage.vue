<template>
  <div class="flex h-full flex-col items-center justify-center gap-2 px-4 text-center">
    <h1 class="text-red-400 text-4xl">404</h1>
    <p class="text-zinc-400">
      The path
      <code class="break-all text-zinc-200"
        >/{{ $route.params.pathMatch.join("/") }}</code
      >
      does not exist.
    </p>
  </div>
</template>

<script setup>
const emits = defineEmits(["update:loading"]);
emits("update:loading", false);
</script>
