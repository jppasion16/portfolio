import { defineStore } from "pinia";
import { ref } from "vue";
import { fetchProfile } from "../api/profileApi";

export const useProfileStore = defineStore("profile", () => {
  const loading = ref(false);
  const error = ref<string | null>(null);
  const profile = ref<Record<string, any>>({});

  async function loadProfile() {
    if (Object.keys(profile.value).length) return;
    loading.value = true;
    error.value = null;
    try {
      profile.value = await fetchProfile();
    } catch (err: any) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  }

  return { loading, error, profile, loadProfile };
});
