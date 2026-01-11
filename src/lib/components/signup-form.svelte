<script lang="ts">
	import { cn } from "$lib/utils.js";
	import { Button } from "$lib/components/ui/button/index.js";
	import * as Card from "$lib/components/ui/card/index.js";
	import * as Field from "$lib/components/ui/field/index.js";
	import { Input } from "$lib/components/ui/input/index.js";
	import type { HTMLAttributes } from "svelte/elements";
	import { signUp } from "$lib/remotes/auth/auth.remote";
	import { signUpSchema } from "$lib/remotes/auth/auth.schema";
	import { resolve } from "$app/paths";
	import { FieldWrapper } from "$lib/components/field-wrapper";

	const { class: className, ...restProps }: HTMLAttributes<HTMLDivElement> = $props();
	const {
		fields: { name, email, _password, _confirmPassword, issues },
	} = signUp;
</script>

<div class={cn("flex flex-col gap-6", className)} {...restProps}>
	<Card.Root>
		<Card.Header class="text-center">
			<Card.Title class="text-xl">Create your account</Card.Title>
			<Card.Description>Enter your email below to create your account</Card.Description>
		</Card.Header>
		<Card.Content>
			<form {...signUp.preflight(signUpSchema)}>
				<Field.Group>
					<FieldWrapper label="Full Name" errors={name.issues()}>
						{#snippet children(id)}
							<Input {id} placeholder="John Doe" {...name.as("text")} />
						{/snippet}
					</FieldWrapper>
					<FieldWrapper label="Email" errors={email.issues()}>
						{#snippet children(id)}
							<Input {id} placeholder="m@example.com" {...email.as("email")} />
						{/snippet}
					</FieldWrapper>
					<Field.Field>
						<div class="grid grid-cols-2 gap-4">
							<FieldWrapper label="Password" errors={_password.issues()}>
								{#snippet children(id)}
									<Input {id} {..._password.as("password")} />
								{/snippet}
							</FieldWrapper>
							<FieldWrapper label="Confirm Password" errors={_confirmPassword.issues()}>
								{#snippet children(id)}
									<Input {id} {..._confirmPassword.as("password")} />
								{/snippet}
							</FieldWrapper>
						</div>
						<Field.Description>Must be at least 8 characters long.</Field.Description>
					</Field.Field>
					<Field.Field>
						<Field.Error errors={issues()} />
						<Button type="submit">Create Account</Button>
						<Field.Description class="text-center">
							Already have an account? <a href={resolve("/sign-in")}>Sign in</a>
						</Field.Description>
					</Field.Field>
				</Field.Group>
			</form>
		</Card.Content>
	</Card.Root>
</div>
