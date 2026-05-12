import "../css/app.css";
import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faEnvelope,
  faUser,
  faBriefcase,
  faBuilding,
  faCode,
  faChartLine,
  faLaptopCode,
  faPlug,
  faDatabase,
  faDisplay,
  faScrewdriverWrench,
  faGears,
  faLightbulb,
  faPenRuler,
  faEllipsisVertical,
} from "@fortawesome/free-solid-svg-icons";

library.add(
  faEnvelope,
  faUser,
  faBriefcase,
  faBuilding,
  faCode,
  faChartLine,
  faLaptopCode,
  faPlug,
  faDatabase,
  faDisplay,
  faScrewdriverWrench,
  faGears,
  faLightbulb,
  faPenRuler,
  faEllipsisVertical,
);

createApp(App)
  .use(createPinia())
  .use(router)
  .component("font-awesome-icon", FontAwesomeIcon)
  .mount("#app");
