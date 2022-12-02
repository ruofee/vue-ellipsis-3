import { createApp } from 'vue';
import App from './index.vue';
import VueEllipsis3 from '../src';
const app = createApp(App);
console.log('VueEllipsis3', VueEllipsis3);
app.use(VueEllipsis3);
app.mount('#app');
