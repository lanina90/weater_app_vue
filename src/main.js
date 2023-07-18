
import { createApp } from 'vue'
import App from './App.vue'
import './assets/styles/main.sass'
import store from "@/store";

createApp(App).use(store).mount('#app')
