<template>
  <div class="flex flex-col">
    <p class="text-sm">&gt; <span class="text-green-400">services</span></p>
    <div
      v-if="services.length"
      class="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-2 2xl:grid-cols-3"
    >
      <article
        v-for="service in services"
        :key="service.id"
        class="flex flex-col gap-3 rounded border border-zinc-700 bg-zinc-900/60 p-3"
      >
        <h2 class="text-lg font-semibold text-green-400 flex">
          <span class="flex-1">{{ service.name }}</span>
          <font-awesome-icon
            v-if="service.icon"
            :icon="service.icon"
            class="mr-2 text-green-400"
          />
        </h2>

        <p class="text-sm text-zinc-200 leading-6">
          {{ service.description }}
        </p>
      </article>
    </div>
    <div
      v-else
      class="mt-3 rounded border border-dashed border-zinc-700 p-4 text-zinc-500"
    >
      No services found.
    </div>
  </div>
</template>

<script setup>
defineProps({
  services: {
    type: Array,
    required: true,
  },
});
</script>
