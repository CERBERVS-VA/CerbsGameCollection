import { defineConfig } from "vite";
// For .env support: https://vite.dev/config/#using-environment-variables-in-config

export default defineConfig({
  root: "./frontend/src",
  define: {
    __APP_VERSION__: JSON.stringify("v1.0.0"),
  },
  server: {
    host: true,
    port: 5173,
    // strictPort: true,
    watch: {
      usePolling: true,
    },
  },
  css: {
    // See https://sass-lang.com/documentation/js-api/interfaces/stringoptions/
    preprocessorOptions: {
      scss: {
        fatalDeprecations: ["1.89.2"],
      } as any, // prevent static type checking for SassPreprocessorOptions
    },
  },
  build: {
    outDir: "../.dist",
    emptyOutDir: true,
  },
});
