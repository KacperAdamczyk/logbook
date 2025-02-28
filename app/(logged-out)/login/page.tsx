"use client";

import { authClient } from "@/lib/auth-client";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import Form from "next/form";
import { useActionState } from "react";

const loginAction = () => authClient.signIn.social({ provider: "github" });

export default function Login() {
	const [, login, isPending] = useActionState(loginAction, null);

	return (
		<div className="h-dvh flex flex-col justify-center">
			<Card className="w-1/2 mx-auto">
				<CardHeader className="text-3xl border-b-1 border-gray-800 justify-center">
					Login
				</CardHeader>
				<CardBody>
					<Form action={login} className="flex justify-center">
						<Button type="submit" isLoading={isPending}>
							Login with Github
						</Button>
					</Form>
				</CardBody>
			</Card>
		</div>
	);
}
