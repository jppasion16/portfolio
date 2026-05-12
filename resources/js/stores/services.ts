import { defineStore } from "pinia";
import { ref } from "vue";
import { api } from "../api/index";
import { useAppStore } from "./app";

interface Service {
  id: number;
  code: string;
  name: string;
  description: string | null;
  icon: string | null;
  order: number;
}

const apiUrl = "/api/services";

export const useServicesStore = defineStore("services", () => {
  const appStore = useAppStore();
  const services = ref<Service[]>([]);
  const loading = ref(false);

  const loadServices = async () => {
    if (services.value.length > 0) return;
    loading.value = true;
    services.value = await api<Service[]>(apiUrl);
    loading.value = false;
  };

  const createService = async (body: object) => {
    if (!appStore.token) throw new Error("Unauthorized Request");

    loading.value = true;

    const serviceRes = await api<Service>(apiUrl, {
      method: "POST",
      body,
      token: appStore.token,
    });

    services.value.push(serviceRes);

    loading.value = false;
    return serviceRes;
  };

  const updateService = async (body: object, id: number) => {
    if (!appStore.token) throw new Error("Unauthorized Request");

    loading.value = true;

    const serviceRes = await api<Service>(apiUrl + `/${id}`, {
      method: "PUT",
      body,
      token: appStore.token,
    });

    services.value = services.value.map((service) =>
      service.id === id ? serviceRes : service,
    );

    loading.value = false;
    return serviceRes;
  };

  const deleteService = async (id: number) => {
    if (!appStore.token) throw new Error("Unauthorized Request");

    loading.value = true;

    const deleteRes = await api<{ success: boolean; message?: string }>(
      apiUrl + `/${id}`,
      {
        method: "DELETE",
        token: appStore.token,
      },
    );

    services.value = services.value.filter((service) => service.id !== id);

    loading.value = false;
    return deleteRes;
  };

  return {
    services,
    loadServices,
    createService,
    updateService,
    deleteService,
  };
});
