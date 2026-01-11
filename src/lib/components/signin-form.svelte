<script lang="ts">
	import { Button } from "$lib/components/ui/button/index.js";
	import * as Card from "$lib/components/ui/card/index.js";
	import * as Field from "$lib/components/ui/field/index.js";
	import { Input } from "$lib/components/ui/input/index.js";
	import { cn } from "$lib/utils.js";
	import type { HTMLAttributes } from "svelte/elements";
	import { resolve } from "$app/paths";
	import { signIn } from "$lib/remotes/auth/auth.remote";
	import { signInSchema } from "$lib/remotes/auth/auth.schema";
	import { FieldWrapper } from "$lib/components/field-wrapper";

	let { class: className, ...restProps }: HTMLAttributes<HTMLDivElement> = $props();

	const {
		fields: { email, _password, issues },
	} = signIn;
</script>

<div class={cn("flex flex-col gap-6", className)} {...restProps}>
	<Card.Root>
		<Card.Header class="text-center">
			<Card.Title class="text-xl">Welcome back</Card.Title>
			<Card.Description>Login with your Apple or Google account</Card.Description>
		</Card.Header>
		<Card.Content>
			<form {...signIn.preflight(signInSchema)}>
				<Field.Group>
					<FieldWrapper label="Email" errors={email.issues()}>
						{#snippet children(id)}
							<Input {id} placeholder="email@example.com" {...email.as("email")} />
						{/snippet}
					</FieldWrapper>
					<FieldWrapper label="Password" errors={_password.issues()}>
						{#snippet children(id)}
							<Input {id} {..._password.as("password")} />
							<div class="flex items-center justify-between">
								<a href="##" class="text-sm underline-offset-4 hover:underline">
									Forgot your password?
								</a>
							</div>
						{/snippet}
					</FieldWrapper>
					<Field.Field>
						<Field.Error errors={issues()} />
						<Button type="submit">Login</Button>
						<Field.Description class="text-center">
							Don't have an account? <a href={resolve("/sign-up")}>Sign up</a>
						</Field.Description>
					</Field.Field>
				</Field.Group>
			</form>
		</Card.Content>
	</Card.Root>
</div>
