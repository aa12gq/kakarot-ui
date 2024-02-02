import { createRouter, createWebHistory } from "vue-router";
import GvpHomeView from "@/apps/gvp/Home.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "gvp-home",
      component: GvpHomeView,
    },
  ],
});

export default router;
