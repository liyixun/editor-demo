import Vue from "vue";
import App from "./App.vue";
import "@/mavonEditor.js";

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
}).$mount("#app");
