import { defineConfig } from 'vite';
import { resolve } from 'path';
import vue from '@vitejs/plugin-vue';
import cssExtractPlugin from './build/cssExtractPlugin';

const fileName = 'vue-ellipsis-3';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), cssExtractPlugin()],
  build: {
    lib: {
      entry: resolve(__dirname, './src/index.ts'),
      name: 'VueEllipsis3',
      formats: ['umd', 'es'],
      fileName: (format) => {
        if (format === 'umd') {
          return `${fileName}.js`;
        }
        return `${fileName}.${format}.js`;
      },
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue',
        },
        exports: 'named',
      },
    },
  },
});
