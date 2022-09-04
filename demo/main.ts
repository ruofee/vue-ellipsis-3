import { createApp } from 'vue';
import App from './index.vue';
import VueEllipsis3 from 'vue-ellipsis-3';
const app = createApp(App);
console.log('VueEllipsis3', VueEllipsis3);
app.use(VueEllipsis3);
app.mount('#app');
