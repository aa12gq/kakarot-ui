import { createApp } from 'vue';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import piniaPersist from 'pinia-plugin-persist';
import { AutoRenewJWT } from '@/components/Auth';

import App from './App.vue';
import router from './router';

import '@/assets/css/app.css';

const app = createApp(App);

app.use(createPinia().use(piniaPersist).use(piniaPluginPersistedstate));
app.use(router);

app.mount('#app');
// 保持JWT自动更新,以免过期
AutoRenewJWT();
