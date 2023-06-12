import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export const routes = [
  {
    path: "/wangEditor",
    name: "wangEditor",
    component: () => import("@/views/wangEditor.vue"),
  },
  {
    path: "/wangEditorPreview",
    name: "wangEditorPreview",
    component: () => import("@/views/wangEditorV2.vue"),
  },
  {
    path: "/mavonEditor",
    name: "mavonEditor",
    component: () => import("@/views/mavonEditorDemo.vue"),
  },
];

export function initRouter() {
  const router = new Router({
    mode: "history",
    routes,
  });
  return router;
}
