<template>
  <main class="relative flex min-h-full flex-col xl:flex-row">
    <div class="flex-1 flex flex-col">
      <div class="flex flex-col p-4 border-b-1 border-zinc-700">
        <p class="text-sm">
          &gt; <span class="text-green-400">open</span> contact_form.txt
        </p>
        <h1 class="py-4 text-2xl text-zinc-100 sm:text-3xl">
          Let&apos;s talk about your project, idea, or question.
        </h1>
        <p class="max-w-3xl text-zinc-300 leading-7">
          You do not need to write like a developer here. A simple message is
          enough. Tell me what you need, what kind of help you are looking for,
          and I&apos;ll take it from there.
        </p>
      </div>

      <div class="flex flex-col p-4">
        <p class="text-sm">
          &gt; <span class="text-green-400">nano</span> new_message.md
        </p>

        <div
          v-if="submitSuccess"
          class="mt-4 rounded border border-green-400/40 bg-green-400/10 p-4 text-green-200"
        >
          Message sent successfully. I&apos;ll get back to you as soon as I can.
        </div>

        <div
          v-if="submitError"
          class="mt-4 rounded border border-red-400/40 bg-red-400/10 p-4 text-red-200"
        >
          {{ submitError }}
        </div>

        <form
          class="mt-4 grid w-full max-w-3xl gap-4"
          @submit.prevent="handleSubmit"
        >
          <div class="grid gap-2">
            <label for="contact-name" class="text-sm text-zinc-300">
              Your name
            </label>
            <input
              id="contact-name"
              v-model="form.name"
              type="text"
              autocomplete="name"
              placeholder="Jane Smith"
              class="rounded border border-zinc-700 bg-zinc-950 px-4 py-3 text-zinc-100 outline-none focus:border-green-400"
              required
            />
          </div>

          <div class="grid gap-2">
            <label for="contact-email" class="text-sm text-zinc-300">
              Email address
            </label>
            <input
              id="contact-email"
              v-model="form.email"
              type="email"
              autocomplete="email"
              placeholder="jane@example.com"
              class="rounded border border-zinc-700 bg-zinc-950 px-4 py-3 text-zinc-100 outline-none focus:border-green-400"
              required
            />
          </div>

          <div class="grid gap-2">
            <label for="contact-message" class="text-sm text-zinc-300">
              Message
            </label>
            <textarea
              id="contact-message"
              v-model="form.message"
              rows="8"
              placeholder="Hi, I need help building a website for my business. I only have a rough idea so far and would like to know what is possible and what the next steps could look like."
              class="rounded border border-zinc-700 bg-zinc-950 px-4 py-3 text-zinc-100 outline-none focus:border-green-400 resize-y"
              required
            ></textarea>
            <p class="text-sm text-zinc-500">
              Helpful details: what you need, what this is for, and any rough
              timeline or budget if you already have one.
            </p>
          </div>

          <div class="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="submit"
              class="w-full rounded border border-green-400/40 bg-green-400/10 px-5 py-3 text-sm text-green-200 transition hover:bg-green-400/15 focus:border-green-300 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              :disabled="isSubmitting"
            >
              {{ isSubmitting ? "Sending..." : "Send message" }}
            </button>
            <p class="text-sm text-zinc-500">
              I&apos;ll reply using the email address you enter above.
            </p>
          </div>
        </form>
      </div>
    </div>

    <aside
      class="flex w-full flex-col border-zinc-700 border-t-1 xl:w-[320px] xl:flex-none xl:border-t-0 xl:border-l-1 2xl:w-[360px]"
    >
      <div class="p-4">
        <p class="text-sm">
          &gt; <span class="text-green-400">help</span> contact
        </p>
        <div class="mt-3 space-y-3 text-sm text-zinc-300">
          <p class="rounded border border-zinc-700 p-3">
            Not sure what to write? Start with what you&apos;re trying to do and
            what kind of help you need.
          </p>
          <p class="rounded border border-zinc-700 p-3">
            It&apos;s fine if the idea is still messy. Early-stage questions are
            welcome.
          </p>
          <p class="rounded border border-zinc-700 p-3">
            If email is easier, you can also reach me directly using the details
            below.
          </p>
        </div>
      </div>

      <div class="border-t-1 border-zinc-700 p-4">
        <p class="text-sm">
          &gt; <span class="text-green-400">cat</span> contact_methods.json
        </p>
        <div class="mt-3 grid gap-3 text-sm sm:grid-cols-2 xl:grid-cols-1">
          <div class="rounded border border-zinc-700 p-3">
            <p class="text-zinc-500">email</p>
            <a
              v-if="profile.email"
              :href="`mailto:${profile.email}`"
              class="mt-1 inline-block text-green-300 hover:text-green-200"
            >
              {{ profile.email }}
            </a>
            <p v-else class="mt-1 text-zinc-500">Not available</p>
          </div>

          <div class="rounded border border-zinc-700 p-3">
            <p class="text-zinc-500">location</p>
            <p class="mt-1 text-zinc-200">{{ profile.location || "Remote" }}</p>
          </div>

          <div class="rounded border border-zinc-700 p-3">
            <p class="text-zinc-500">github</p>
            <a
              v-if="profile.github"
              :href="normalizeUrl(profile.github)"
              target="_blank"
              rel="noopener noreferrer"
              class="mt-1 inline-block break-all text-blue-300 hover:text-blue-200"
            >
              {{ profile.github }}
            </a>
            <p v-else class="mt-1 text-zinc-500">Not available</p>
          </div>

          <div class="rounded border border-zinc-700 p-3">
            <p class="text-zinc-500">linkedin</p>
            <a
              v-if="profile.linkedin"
              :href="normalizeUrl(profile.linkedin)"
              target="_blank"
              rel="noopener noreferrer"
              class="mt-1 inline-block break-all text-blue-300 hover:text-blue-200"
            >
              {{ profile.linkedin }}
            </a>
            <p v-else class="mt-1 text-zinc-500">Not available</p>
          </div>
        </div>
      </div>

      <div class="border-t-1 border-zinc-700 p-4">
        <p class="text-sm">
          &gt; <span class="text-green-400">echo</span> $MESSAGE_TIPS
        </p>
        <ul class="mt-3 space-y-2 text-sm text-zinc-400">
          <li>What do you want to build or improve?</li>
          <li>Who is it for?</li>
          <li>Do you have a rough deadline?</li>
        </ul>
      </div>
    </aside>
  </main>
</template>

<script setup>
import { reactive, ref, watch, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { api } from "../api/index";
import { useAppStore } from "../stores/app";
import { useProfileStore } from "../stores/profile";
import { useRoute } from "vue-router";

const emits = defineEmits(["update:loading"]);
const route = useRoute();

const appStore = useAppStore();
const profileStore = useProfileStore();
const { profile } = storeToRefs(profileStore);

const form = reactive({
  name: "",
  email: "",
  message: "",
});

const isSubmitting = ref(false);
const submitError = ref("");
const submitSuccess = ref(false);

const normalizeUrl = (value) => {
  if (!value) return "";
  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
};

watch(
  () => profile.value,
  (profileData) => {
    if (!profileData || !Object.keys(profileData).length) return;

    appStore.contacts = {
      email: profileData.email,
      github: normalizeUrl(profileData.github),
      linkedin: normalizeUrl(profileData.linkedin),
      location: profileData.location,
    };
  },
  { immediate: true },
);

watch(
  () => profileStore.loading || isSubmitting.value,
  (isLoading) => {
    emits("update:loading", isLoading);
  },
);

const resetForm = () => {
  form.name = "";
  form.email = "";
  form.message = "";
};

const handleSubmit = async () => {
  isSubmitting.value = true;
  submitError.value = "";
  submitSuccess.value = false;

  try {
    await api("/api/messages", {
      method: "POST",
      body: {
        name: form.name,
        email: form.email,
        message: form.message,
      },
    });

    resetForm();
    submitSuccess.value = true;
  } catch (err) {
    submitError.value =
      err instanceof Error ? err.message : "Unable to send message.";
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(async () => {
  try {
    form.message = route.query.type === "resume" ? "Request for resume" : "";
    await profileStore.loadProfile();
  } catch (err) {
    console.error(err);
  } finally {
    emits("update:loading", false);
  }
});
</script>
