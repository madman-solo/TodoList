// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "./", // 如果部署到子路径，这里填写对应的路径
  server: {
    host: true, // 允许外部访问
    port: 3000,
  },
  build: {
    outDir: "dist",
    assetsDir: "assets",
  },
});
