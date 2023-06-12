<template>
  <div id="app">
    <div class="container">
      <div class="menu">
        <ul>
          <router-link
            v-for="item in menuItems"
            :key="item.name"
            :to="{ name: item.name }"
            tag="li"
            :class="{ active: $route.path === `/${item.name}` }"
            @click="activeItem = item.name"
            >{{ item.name }}</router-link
          >
        </ul>
      </div>
      <div class="content">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import { initRouter, routes } from "./router/index";

export default {
  name: "App",
  router: initRouter(),
  data: () => ({
    activeItem: "wangEditor", // 默认激活的菜单项
    menuItems: routes.map((item) => ({ name: item.name, path: item.path })),
  }),
  components: {},
};
</script>

<style>
body {
  margin: 0;
}
.container {
  display: flex;
  flex-direction: row;
  height: 100vh;
}

.menu {
  width: 200px;
  background-color: #f0f0f0;
}

.menu ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.menu li {
  padding: 10px;
  cursor: pointer;
  user-select: none;
}

.menu li.active {
  background-color: #fff;
}

.content {
  flex: 3;
  padding: 20px;
  box-sizing: border-box;
}
</style>
