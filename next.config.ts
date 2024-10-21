// import { fileURLToPath } from "node:url";
// import { createJiti } from "jiti";
import type { NextConfig } from "next";

// const jiti = createJiti(fileURLToPath(import.meta.url));

// await jiti.import("./env");

const nextConfig: NextConfig = {
	serverExternalPackages: ["@libsql/client"],
};

export default nextConfig;
