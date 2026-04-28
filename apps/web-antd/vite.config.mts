import { defineConfig } from '@vben/vite-config';

export default defineConfig(async () => {
  return {
    application: {},
    vite: {
      server: {
        allowedHosts: true,
        proxy: {
          '/admin-api': {
            changeOrigin: true,
            // mock代理目标地址
            target: 'http://8.141.17.93:48080',
            ws: true,
          },
        },
      },
    },
  };
});
