// vite.config.ts
import { defineConfig } from "file:///C:/Work/hoanthui/7ff-client/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Work/hoanthui/7ff-client/node_modules/@vitejs/plugin-react/dist/index.mjs";
import { fileURLToPath, URL } from "node:url";
var __vite_injected_original_import_meta_url = "file:///C:/Work/hoanthui/7ff-client/vite.config.ts";
var vite_config_default = defineConfig({
  server: {
    port: 3e3
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url))
    }
  },
  css: {
    preprocessorOptions: {
      less: {
        modifyVars: {
          "font-family": "'Raleway', sans-serif",
          "font-size-base": "16px",
          "line-height-base": "1.5",
          "layout-header-background": "transparent",
          "layout-body-background": "transparent",
          "body-background": "transparent",
          "text-color": "#002329"
        },
        javascriptEnabled: true
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxXb3JrXFxcXGhvYW50aHVpXFxcXDdmZi1jbGllbnRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFdvcmtcXFxcaG9hbnRodWlcXFxcN2ZmLWNsaWVudFxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovV29yay9ob2FudGh1aS83ZmYtY2xpZW50L3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcbmltcG9ydCByZWFjdCBmcm9tIFwiQHZpdGVqcy9wbHVnaW4tcmVhY3RcIjtcbmltcG9ydCB7IGZpbGVVUkxUb1BhdGgsIFVSTCB9IGZyb20gXCJub2RlOnVybFwiO1xuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHNlcnZlcjoge1xuICAgIHBvcnQ6IDMwMDAsXG4gIH0sXG4gIHBsdWdpbnM6IFtyZWFjdCgpXSxcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiB7XG4gICAgICBcIkBcIjogZmlsZVVSTFRvUGF0aChuZXcgVVJMKFwiLi9zcmNcIiwgaW1wb3J0Lm1ldGEudXJsKSksXG4gICAgfSxcbiAgfSxcbiAgY3NzOiB7XG4gICAgcHJlcHJvY2Vzc29yT3B0aW9uczoge1xuICAgICAgbGVzczoge1xuICAgICAgICBtb2RpZnlWYXJzOiB7XG4gICAgICAgICAgXCJmb250LWZhbWlseVwiOiBcIidSYWxld2F5Jywgc2Fucy1zZXJpZlwiLFxuICAgICAgICAgIFwiZm9udC1zaXplLWJhc2VcIjogXCIxNnB4XCIsXG4gICAgICAgICAgXCJsaW5lLWhlaWdodC1iYXNlXCI6IFwiMS41XCIsXG4gICAgICAgICAgXCJsYXlvdXQtaGVhZGVyLWJhY2tncm91bmRcIjogXCJ0cmFuc3BhcmVudFwiLFxuICAgICAgICAgIFwibGF5b3V0LWJvZHktYmFja2dyb3VuZFwiOiBcInRyYW5zcGFyZW50XCIsXG4gICAgICAgICAgXCJib2R5LWJhY2tncm91bmRcIjogXCJ0cmFuc3BhcmVudFwiLFxuICAgICAgICAgIFwidGV4dC1jb2xvclwiOiBcIiMwMDIzMjlcIixcbiAgICAgICAgfSxcbiAgICAgICAgamF2YXNjcmlwdEVuYWJsZWQ6IHRydWUsXG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBMlEsU0FBUyxvQkFBb0I7QUFDeFMsT0FBTyxXQUFXO0FBQ2xCLFNBQVMsZUFBZSxXQUFXO0FBRmtJLElBQU0sMkNBQTJDO0FBSXROLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFFBQVE7QUFBQSxJQUNOLE1BQU07QUFBQSxFQUNSO0FBQUEsRUFDQSxTQUFTLENBQUMsTUFBTSxDQUFDO0FBQUEsRUFDakIsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsS0FBSyxjQUFjLElBQUksSUFBSSxTQUFTLHdDQUFlLENBQUM7QUFBQSxJQUN0RDtBQUFBLEVBQ0Y7QUFBQSxFQUNBLEtBQUs7QUFBQSxJQUNILHFCQUFxQjtBQUFBLE1BQ25CLE1BQU07QUFBQSxRQUNKLFlBQVk7QUFBQSxVQUNWLGVBQWU7QUFBQSxVQUNmLGtCQUFrQjtBQUFBLFVBQ2xCLG9CQUFvQjtBQUFBLFVBQ3BCLDRCQUE0QjtBQUFBLFVBQzVCLDBCQUEwQjtBQUFBLFVBQzFCLG1CQUFtQjtBQUFBLFVBQ25CLGNBQWM7QUFBQSxRQUNoQjtBQUFBLFFBQ0EsbUJBQW1CO0FBQUEsTUFDckI7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
