import { defineStore } from "pinia";
import { ref } from "vue";

export const useTokenStore = defineStore("token", () => {
  const token = ref<string | null>(null);

  const setToken = (t: string | null) => (token.value = t);

  return { token, setToken };
});
