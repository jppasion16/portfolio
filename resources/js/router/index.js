import { createRouter, createWebHistory } from "vue-router";

import HomePage from "../pages/HomePage.vue";
import ProjectsPage from "../pages/ProjectsPage.vue";
import ExperiencePage from "../pages/ExperiencePage.vue";
import ContactPage from "../pages/ContactPage.vue";

const routes = [
  {
    path: "/",
    component: HomePage,
  },
  {
    path: "/experience",
    component: ExperiencePage,
  },
  {
    path: "/projects",
    component: ProjectsPage,
  },
  {
    path: "/contact",
    component: ContactPage,
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("../pages/NotFoundPage.vue"),
  },
];

export default createRouter({
  history: createWebHistory(),
  routes,
});
