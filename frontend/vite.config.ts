import { defineConfig, loadEnv, splitVendorChunkPlugin } from 'vite';
import react from '@vitejs/plugin-react';
import eslint from 'vite-plugin-eslint';
import vitePluginFaviconsInject from 'vite-plugin-favicons-inject';
import path from 'path';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };
  return defineConfig({
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@Components': path.resolve(__dirname, './src', 'components'),
        '@Constants': path.resolve(__dirname, './src', 'constants'),
        '@Utils': path.resolve(__dirname, './src', 'utils'),
        '@Redux': path.resolve(__dirname, './src', 'redux'),
        '@Api': path.resolve(__dirname, './src', 'api'),
        '@Types': path.resolve(__dirname, './src', 'types'),
        '@Domain': path.resolve(__dirname, './src', 'domain'),
        '@Src': path.resolve(__dirname, './src'),
      },
    },
    plugins: [
      react(),
      viteStaticCopy({
        targets: [
          {
            src: path.resolve(__dirname, 'src/styles/export/clock.css'),
            dest: path.resolve(__dirname, 'public/styles'),
          },
          {
            src: path.resolve(__dirname, 'src/export/js/app.js'),
            dest: path.resolve(__dirname, 'public/js/export'),
          },
          {
            src: path.resolve(__dirname, 'src/export/js/map.js'),
            dest: path.resolve(__dirname, 'public/js/export'),
          },
          {
            src: path.resolve(__dirname, 'src/export/js/clock-widget.js'),
            dest: path.resolve(__dirname, 'public/js/export'),
          },
          {
            src: path.resolve(__dirname, 'src/export/js/clock.js'),
            dest: path.resolve(__dirname, 'public/js/export'),
          },
          {
            src: path.resolve(__dirname, 'src/export/js/calendar.js'),
            dest: path.resolve(__dirname, 'public/js/export'),
          },
          {
            src: path.resolve(
              __dirname,
              'node_modules/css-ripple-effect/dist/ripple.css',
            ),
            dest: path.resolve(__dirname, 'public/styles'),
          },
        ],
      }),
      splitVendorChunkPlugin(),
      eslint({
        failOnError: process.env.NODE_ENV !== 'development',
      }),
      vitePluginFaviconsInject('./src/assets/sprites/favicon.png'),
    ],
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@import "@Src/styles/index.scss";',
        },
      },
    },
  });
};
