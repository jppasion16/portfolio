<template>
  <div
    class="w-3/4 h-3/4 bg-zinc-900 border-zinc-700 border rounded z-100 flex flex-col justify-center items-center"
    @click.stop
  >
    <form
      @submit.prevent="handleLogin"
      class="flex flex-col justify-center items-center max-w-sm mx-auto p-8 border border-zinc-700 gap-4"
    >
      <h1 class="text-2xl font-bold mb-4">Login</h1>
      <h3 class="text-yellow-400 text-center" ref="errorMsgContainer">
        {{ errorMsg }}
      </h3>
      <input
        ref="emailInput"
        v-model="email"
        type="text"
        placeholder="Email"
        class="bg-transparent border border-zinc-400 p-2 focus:outline-none focus:border-green-400"
      />
      <input
        v-model="password"
        type="password"
        placeholder="Password"
        class="bg-transparent border border-zinc-400 p-2 focus:outline-none focus:border-green-400 mb-8"
      />
      <div class="flex justify-center gap-2">
        <button
          type="submit"
          class="bg-transparent border border-zinc-400 p-2 focus:outline-none focus:border-green-400"
        >
          Login
        </button>
        <button
          type="button"
          class="bg-transparent border border-zinc-400 p-2 focus:outline-none focus:border-green-400"
          @click="appStore.terminalMode = 'default'"
        >
          Cancel
        </button>
      </div>
    </form>
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { useAppStore } from "../../stores/app";
import { login } from "../../api/authApi";
const appStore = useAppStore();
const emailInput = ref(null);
const email = ref("");
const password = ref("");
const errorMsg = ref("");

const handleLogin = async () => {
  try {
    await login(email.value, password.value);
  } catch (error) {
    errorMsg.value = error.message;
  }
  appStore.terminalMode = "default";
};

onMounted(() => {
  emailInput.value.focus();
});
</script>
