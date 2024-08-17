import { loadEnv } from "vite";
import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ mode }) => ({
	test: {
		env: loadEnv(mode, process.cwd(), ""),
		setupFiles: ["./tests/setup.ts"],
	},
	plugins: [tsconfigPaths()],
}));
