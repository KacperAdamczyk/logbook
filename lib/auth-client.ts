import { createAuthClient } from "better-auth/react";
import { oAuthProxy } from "better-auth/plugins";
export const authClient = createAuthClient({
	plugins: [oAuthProxy()],
});
