import { defineConfig } from "tsdown";

export default defineConfig({
	entry: ["src/index.ts", "src/types.ts"],
	outDir: "dist",
	format: ["esm", "cjs"],
	dts: true,
	clean: true,
	deps: {
		neverBundle: ["vue"]
	}
});
