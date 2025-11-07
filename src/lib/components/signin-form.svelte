<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import {
		Card,
		CardHeader,
		CardTitle,
		CardDescription,
		CardContent
	} from '$lib/components/ui/card/index.js';
	import {
		FieldGroup,
		Field,
		FieldLabel,
		FieldDescription,
		FieldError
	} from '$lib/components/ui/field/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { cn } from '$lib/utils.js';
	import type { HTMLAttributes } from 'svelte/elements';
	import { resolve } from '$app/paths';
	import { signIn } from '$lib/remotes/auth/auth.remote';
	import { signInSchema } from '$lib/remotes/auth/auth.schema';

	let { class: className, ...restProps }: HTMLAttributes<HTMLDivElement> = $props();

	const id = $props.id();
	const {
		fields: { email, _password }
	} = signIn;
</script>

<div class={cn('flex flex-col gap-6', className)} {...restProps}>
	<Card>
		<CardHeader class="text-center">
			<CardTitle class="text-xl">Welcome back</CardTitle>
			<CardDescription>Login with your Apple or Google account</CardDescription>
		</CardHeader>
		<CardContent>
			<form {...signIn.preflight(signInSchema)}>
				<FieldGroup>
					<Field>
						<FieldLabel for="email-{id}">Email</FieldLabel>
						<Input id="email-{id}" placeholder="email@example.com" {...email.as('email')} />
						{#each email.issues() as issue (issue)}
							<FieldError>{issue.message}</FieldError>
						{/each}
					</Field>
					<Field>
						<div class="flex items-center">
							<FieldLabel for="password-{id}">Password</FieldLabel>
							<a href="##" class="ml-auto text-sm underline-offset-4 hover:underline">
								Forgot your password?
							</a>
						</div>
						<Input id="password-{id}" {..._password.as('password')} />
						{#each _password.issues() as issue (issue)}
							<FieldError>{issue.message}</FieldError>
						{/each}
					</Field>
					<Field>
						{#each signIn.fields.issues() as issue (issue)}
							<FieldError>{issue.message}</FieldError>
						{/each}
						<Button type="submit">Login</Button>
						<FieldDescription class="text-center">
							Don't have an account? <a href={resolve('/sign-up')}>Sign up</a>
						</FieldDescription>
					</Field>
				</FieldGroup>
			</form>
		</CardContent>
	</Card>
</div>
