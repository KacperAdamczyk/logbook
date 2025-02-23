"use client";

import { authClient } from "@/lib/auth-client";
import Form from "next/form";

export default function Login() {
	const login = async () => {
		await authClient.signIn.social({ provider: "github" });
	};

	return (
		<div>
			<h1>Login Page</h1>
			<Form action={login}>
				<button type="submit" value="github">
					Login with Github
				</button>
			</Form>
		</div>
	);
}
