import type { Plugin } from 'vue';
import VueEllipsis3 from './index.vue';

const plugin: Plugin = {
  install: (app) => {
    app.component('VueEllipsis3', VueEllipsis3);
  },
};

export default plugin;

export { VueEllipsis3 };
