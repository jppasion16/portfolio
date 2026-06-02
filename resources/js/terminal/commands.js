import { storeToRefs } from "pinia";
import { useProfileStore } from "../stores/profile";
import { useAppStore } from "../stores/app";
import { useServicesStore } from "../stores/services";
import { useProjectsStore } from "../stores/projects";
import { useExperiencesStore } from "../stores/experiences";
import { useSkillsStore } from "../stores/skills";

export function commands({ history, addOutput, loading }) {
  const appStore = useAppStore();
  const publicTargets = ["skills", "projects", "experiences", "services"];
  const protectedTargets = ["messages"];
  const listTargets = [...publicTargets, ...protectedTargets];
  const listTargetNames = JSON.stringify(listTargets);
  const mutableTargets = publicTargets;

  const requestOptions = () => {
    const headers = {
      Accept: "application/json",
    };

    if (appStore.token) {
      headers.Authorization = `Bearer ${appStore.token}`;
    }

    return { headers };
  };

  const parseListOptions = (args) => {
    const options = {
      limit: null,
    };

    for (let i = 0; i < args.length; i++) {
      const arg = args[i];
      let limitValue = null;

      if (arg.startsWith("--limit=")) {
        limitValue = arg.slice("--limit=".length);
      } else if (arg === "--limit") {
        limitValue = args[i + 1];
        i++;
      } else {
        return { error: `Unknown option '${arg}'` };
      }

      const limit = Number(limitValue);

      if (!Number.isInteger(limit) || limit < 1) {
        return { error: "--limit must be a positive integer" };
      }

      options.limit = limit;
    }

    return options;
  };

  const listUrl = (target, { limit }) => {
    const params = new URLSearchParams();

    if (limit) {
      params.set("limit", String(limit));
    }

    const query = params.toString();
    return `/api/${target}${query ? `?${query}` : ""}`;
  };

  const ls = (target, ...args) => {
    if (!target) {
      addOutput([
        `<span class="text-green-400">Available targets:</span> <span class="text-zinc-200">${listTargetNames}</span>`,
      ]);
      return;
    }

    if (protectedTargets.includes(target) && !appStore.token) {
      addOutput([
        `<span class="text-red-400">You must be logged in to list '${target}'</span>`,
      ]);
      return;
    }

    const options = parseListOptions(args);

    if (options.error) {
      addOutput([`<span class="text-red-400">${options.error}</span>`]);
      return;
    }

    if (listTargets.includes(target)) {
      loading.value = true;

      fetch(listUrl(target, options), requestOptions())
        .then((res) => res.json())
        .then((json) => {
          if (!json.success) {
            addOutput([`<span class="text-red-400">${json.message}</span>`]);
            return;
          }

          const output = [];
          json.data.forEach((data) => {
            output.push(
              `<pre class="whitespace-pre-wrap text-zinc-200">${JSON.stringify(data, null, 2)}</pre>`,
            );
          });
          addOutput([
            /*html*/ `<span class='text-green-400'>${target}:</span>`,
            ...output,
          ]);
        })
        .catch((error) => {
          addOutput([`<span class="text-red-400">${error.message}</span>`]);
        })
        .finally(() => {
          loading.value = false;
        });
    } else {
      addOutput([`<span class="text-red-400">'${target}' not found</span>`]);
    }
  };

  return {
    help: () =>
      addOutput([
        /*html*/ `<span class='text-green-400'>Available commands:</span>`,
        /*html*/ `
        <table class="border border-separate border-spacing-2">
          <tr><td><b>help</b></td><td>-</td><td>Show this help message</td></tr>
          <tr><td><b>whoami</b></td><td>-</td><td>Learn more about me</td></tr>
          <tr><td><b>clear</b></td><td>-</td><td>Clear all output</td></tr>
          <tr><td><b>ls <i>or</i> list</b> <i>target</i> [--limit=N]</td><td>-</td><td>List items of type <i>target</i></td></tr>
          <tr><td><b>show</b> <i>target</i> <i>id</i></td><td>-</td><td>Show item of type <i>target</i> with id <i>id</i></td></tr>
          <tr><td><b>login</b></td><td>-</td><td>Login to your account</td></tr>
          <tr><td><b>logout</b></td><td>-</td><td>Logout of your account</td></tr>
          <tr><td><b>add</b> <i>target</i></td><td>-</td><td>(For Authenticated User)Add a new item of type <i>target</i></td></tr>
          <tr><td><b>edit</b> <i>target</i> <i>id</i></td><td>-</td><td>(For Authenticated User)Edit item of type <i>target</i> with id <i>id</i></td></tr>
          <tr><td><b>delete</b> <i>target</i> <i>id</i></td><td>-</td><td>(For Authenticated User)Delete item of type <i>target</i> with id <i>id</i></td></tr>
        </table>`,
      ]),
    clear: () => {
      history.value = history.value
        .filter((item) => item.type !== "output")
        .map((item) => ({ ...item, cleared: true }));
    },
    whoami: async () => {
      loading.value = true;

      const profileStore = useProfileStore();
      const { profile } = storeToRefs(profileStore);

      if (!profile.value) {
        await profileStore.loadProfile();
      }

      loading.value = false;
      addOutput([
        /*html*/ `<span class='text-green-400'>${profile.value.name} - ${profile.value.title}</span>`,
        /*html*/ `<span class="text-zinc-200">${profile.value.bio}</span>`,
      ]);
    },
    login: () => {
      if (appStore.token) {
        addOutput([
          `<span class="text-red-400">You are already logged in</span>`,
        ]);
        return;
      }
      appStore.terminalMode = "login";
    },
    logout: () => {
      appStore.token = "";
      localStorage.removeItem("token");
    },
    ls,
    list: ls,
    show: (target, id = null) => {
      if (!target) {
        addOutput([
          `<span class="text-green-400">Available targets:</span> <span class="text-zinc-200">${listTargetNames}</span>`,
        ]);
        return;
      }
      if (!id) {
        addOutput([`<span class="text-red-400">No ID specified</span>`]);
        return;
      }
      if (target === "current_mode") {
        addOutput([
          /*html*/ `<span class='text-green-400'>Current Terminal Mode:</span>`,
          /*html*/ `<span class="text-zinc-200">${appStore.terminalMode}</span>`,
        ]);
      } else if (target === "history") {
        addOutput([
          /*html*/ `<span class='text-green-400'>History:</span>`,
          /*html*/ `<span class="text-zinc-200"><pre class="whitespace-pre-wrap">${JSON.stringify(
            history.value
              .filter((item) => item.type === "input")
              .map((item) => item.lines[0]),
            null,
            2,
          )}</pre></span>`,
        ]);
      } else if (listTargets.includes(target)) {
        if (protectedTargets.includes(target) && !appStore.token) {
          addOutput([
            `<span class="text-red-400">You must be logged in to show '${target}'</span>`,
          ]);
          return;
        }

        fetch(`/api/${target}/${id}`, requestOptions())
          .then((res) => res.json())
          .then((json) => {
            if (!json.success) {
              addOutput([`<span class="text-red-400">${json.message}</span>`]);
              return;
            }

            addOutput([
              /*html*/ `<span class='text-green-400'>${target}:</span>`,
              /*html*/ `<span class="text-zinc-200"><pre class="whitespace-pre-wrap">${JSON.stringify(json.data, null, 2)}</pre></span>`,
            ]);
          });
      } else {
        addOutput([`<span class="text-red-400">'${target}' not found</span>`]);
      }
    },
    add: (target) => {
      if (mutableTargets.includes(target)) {
        appStore.addTarget = target;
        appStore.terminalMode = "add";
      } else {
        addOutput([`<span class="text-red-400">'${target}' not found</span>`]);
      }
    },
    edit: (target, id) => {
      if (mutableTargets.includes(target)) {
        appStore.editData = {
          target,
          id: Number(id),
        };
        appStore.terminalMode = "edit";
      } else {
        addOutput([`<span class="text-red-400">'${target}' not found</span>`]);
      }
    },
    delete: async (target, id) => {
      loading.value = true;
      id = Number(id);
      if (mutableTargets.includes(target)) {
        switch (target) {
          case "experiences":
            await useExperiencesStore().deleteExperience(id);
            break;
          case "projects":
            await useProjectsStore().deleteProject(id);
            break;
          case "skills":
            await useSkillsStore().deleteSkill(id);
            break;
          case "services":
            await useServicesStore().deleteService(id);
            break;
        }
        addOutput([
          `<span class="text-green-400">'${target} - ${id}' deleted</span>`,
        ]);
        loading.value = false;
      } else {
        addOutput([`<span class="text-red-400">'${target}' not found</span>`]);
        loading.value = false;
      }
    },
  };
}
