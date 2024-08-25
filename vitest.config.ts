import { loadEnv } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig(({ mode }) => ({
	test: {
		env: loadEnv(mode, process.cwd(), ""),
		setupFiles: ["./tests/setup.ts"],
	},
	plugins: [tsconfigPaths()],
}));
