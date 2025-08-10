import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import path from "path";
// @ts-ignore
import vue from "@vitejs/plugin-vue";

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		vue(),
		dts({ insertTypesEntry: true, tsconfigPath: "./tsconfig.app.json" })
	],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src")
		}
	},
	build: {
		lib: {
			entry: "src/index.ts",
			name: "ViewSfc",
			fileName: (format) => `view-sfc.${format}.js`,
			formats: ["es"],
			cssFileName: "view-sfc"
		},
		rollupOptions: {
			external: ["vue"],
			output: {
				globals: {
					vue: "Vue"
				}
			}
		},
		outDir: "dist"
	}
});
