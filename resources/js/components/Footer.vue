<template>
  <footer class="flex flex-col gap-2 border-t-1 border-zinc-700 p-2">
    <p class="text-sm"><span class="text-green-400">&gt;</span> find_me</p>
    <div class="flex flex-col gap-2 text-xs">
      <div
        v-for="[type, contact] in Object.entries(contacts)"
        :key="contact"
        class="flex gap-1 sm:gap-2"
      >
        <a
          v-if="type !== 'location'"
          target="_blank"
          rel="noopener noreferrer"
          :class="{
            'text-blue-400': ['github', 'linkedin'].includes(type),
            'text-green-400': type === 'email',
          }"
          :href="(type === 'email' ? 'mailto:' : '') + contact"
        >
          {{ type === "email" ? contact : type }}
        </a>
        <span v-else class="sm:col-span-7 sm:truncate">
          {{ contact }}
        </span>
      </div>

      <!-- <div
        v-for="[type, contact] in Object.entries(contacts)"
        :key="contact"
        class="grid grid-cols-1 gap-1 sm:grid-cols-10 sm:gap-2"
      >
        <span class="font-semibold sm:col-span-3 max-w-[50px]"
          >{{ type }}:</span
        >
        <span
          v-if="['github', 'linkedin'].includes(type)"
          class="break-all text-blue-400 sm:col-span-7 sm:truncate"
        >
          <a :href="contact" target="_blank" rel="noopener noreferrer">
            {{ contact }}
          </a>
        </span>
        <span
          v-else-if="type === 'email'"
          class="break-all text-green-400 sm:col-span-7 sm:truncate"
        >
          <a :href="`mailto:${contact}`">{{ contact }}</a>
        </span>
        <span v-else class="break-all sm:col-span-7 sm:truncate">
          {{ contact }}
        </span>
      </div> -->
    </div>
    <p class="mt-2 text-sm text-zinc-600">
      &copy; {{ new Date().getFullYear() }} jp@portfolio
    </p>
  </footer>
</template>

<script setup>
defineProps({
  contacts: {
    type: Object,
    default: () => ({}),
  },
});
</script>
