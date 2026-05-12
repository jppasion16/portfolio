import { defineStore } from "pinia";
import { ref } from "vue";

export const useAppStore = defineStore("app", () => {
  const loading = ref(false);
  const error = ref<string | null>(null);
  const token = ref<string | null>(null);
  const terminalMode = ref<string>("default");
  const editData = ref<Record<string, any>>({});
  const contacts = ref<Record<string, any>>({});

  const setToken = (t: string | null) => (token.value = t);

  return {
    loading,
    error,
    token,
    terminalMode,
    editData,
    contacts,
    setToken,
  };
});
