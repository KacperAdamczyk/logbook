import { heroui } from "@heroui/react";
import type { Config } from "tailwindcss";

const config: Config = {
	content: [
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
		"./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
	],
	theme: {},
	darkMode: "class",
	plugins: [heroui()],
};
export default config;
