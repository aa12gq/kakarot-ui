import { createRouter, createWebHistory } from "vue-router";
import GvpHomeView from "@/apps/gvp/Home.vue";
import ScanTaskView from "@/apps/wscc/ScanTask.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "gvp-home",
      component: GvpHomeView,
      children: [
        {
          path: "/wscc/scan_task",
          name: "wscc-scan_task",
          component: ScanTaskView,
          meta:{
            keepAlive: true,
          }
        },
      ]
    },
  ],
});

export default router;
