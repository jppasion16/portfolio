import { storeToRefs } from "pinia";
import { useProfileStore } from "../stores/profile";
import { useAppStore } from "../stores/app";
import { useServicesStore } from "../stores/services";
import { useProjectsStore } from "../stores/projects";
import { useExperiencesStore } from "../stores/experiences";
import { useSkillsStore } from "../stores/skills";

export function commands({ history, addOutput, loading }) {
  const targets = ["skills", "projects", "experiences", "services"];
  const ls = (target) => {
    if (!target) {
      addOutput([
        `<span class="text-green-400">Available targets:</span> <span class="text-zinc-200">${JSON.stringify(["skills", "projects", "experiences", "services"])}</span>`,
      ]);
      return;
    }
    if (targets.includes(target)) {
      fetch(`/api/${target}`)
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
        });
    } else {
      addOutput([`<span class="text-red-400">'${target}' not found</span>`]);
    }
  };

  const appStore = useAppStore();
  return {
    help: () =>
      addOutput([
        /*html*/ `<span class='text-green-400'>Available commands:</span>`,
        /*html*/ `
        <table class="border border-separate border-spacing-2">
          <tr><td><b>help</b></td><td>-</td><td>Show this help message</td></tr>
          <tr><td><b>whoami</b></td><td>-</td><td>Learn more about me</td></tr>
          <tr><td><b>clear</b></td><td>-</td><td>Clear all output</td></tr>
          <tr><td><b>ls <i>or</i> list</b> <i>target</i></td><td>-</td><td>List all items of type <i>target</i></td></tr>
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
          `<span class="text-green-400">Available targets:</span> <span class="text-zinc-200">${JSON.stringify(["skills", "projects", "experiences", "services"])}</span>`,
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
      } else if (targets.includes(target)) {
        fetch(`/api/${target}/${id}`)
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
      if (targets.includes(target)) {
        appStore.addTarget = target;
        appStore.terminalMode = "add";
      } else {
        addOutput([`<span class="text-red-400">'${target}' not found</span>`]);
      }
    },
    edit: (target, id) => {
      if (targets.includes(target)) {
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
      if (targets.includes(target)) {
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
      }
    },
  };
}
