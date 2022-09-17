import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import { createStore } from "vuex";

// Components
import App from "./components/App.vue";

import Tables from "./components/Tables.vue";
import Table from "./components/Table.vue";
import Edit from "./components/Edit.vue";
import Create from "./components/Create.vue";

// Router
const routes = [
  { path: '/', component: Tables, name: "tables" },
  { path: '/table/:table', component: Table, name: "table" },
  { path: '/edit/:table', component: Edit, name: "edit" },
  { path: '/create/:table', component: Create, name: "create" },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Vuex
const store = createStore({
  state()
  {
    return {
      notificationView: false,
      notificationType: '',
      notificationText: "",
      render: 0,
    }
  },
  mutations:
  {
    notify(state, payload)
    {
      state.notificationType = 'Error';
      state.notificationView = true;
      state.notificationText = payload.notificationText;
    },
    close(state)
    {
      state.notificationView = false;
      state.notificationText = '';
      state.notificationType = '';
      state.function = null;
      state.data = {};
    },
    advertise(state, payload)
    {
      state.notificationType = 'Warning';
      state.notificationText = payload.notificationText;
      state.notificationView = true;
      state.function = payload.function;
      state.data = payload.data;
    },
    render(state)
    {
      ++state.render
    }
  }
})

createApp(App).use(router).use(store).mount('#app');
