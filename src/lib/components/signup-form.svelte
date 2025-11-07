<script lang="ts">
	import { cn } from '$lib/utils.js';
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
	import type { HTMLAttributes } from 'svelte/elements';
	import { signUp } from '$lib/remotes/auth/auth.remote';
	import { signUpSchema } from '$lib/remotes/auth/auth.schema';
	import { resolve } from '$app/paths';

	const { class: className, ...restProps }: HTMLAttributes<HTMLDivElement> = $props();
	const {
		fields: { name, email, _password, _confirmPassword }
	} = signUp;
</script>

<div class={cn('flex flex-col gap-6', className)} {...restProps}>
	<Card>
		<CardHeader class="text-center">
			<CardTitle class="text-xl">Create your account</CardTitle>
			<CardDescription>Enter your email below to create your account</CardDescription>
		</CardHeader>
		<CardContent>
			<form {...signUp.preflight(signUpSchema)}>
				<FieldGroup>
					<Field>
						<FieldLabel for="name">Full Name</FieldLabel>
						<Input id="name" placeholder="John Doe" {...name.as('text')} />
						{#each name.issues() as issue (issue)}
							<FieldError>{issue.message}</FieldError>
						{/each}
					</Field>
					<Field>
						<FieldLabel for="email">Email</FieldLabel>
						<Input id="email" placeholder="m@example.com" {...email.as('email')} />
						{#each email.issues() as issue (issue)}
							<FieldError>{issue.message}</FieldError>
						{/each}
					</Field>
					<Field>
						<Field class="grid grid-cols-2 gap-4">
							<Field>
								<FieldLabel for="password">Password</FieldLabel>
								<Input id="password" {..._password.as('password')} />
								{#each _password.issues() as issue (issue)}
									<FieldError>{issue.message}</FieldError>
								{/each}
							</Field>
							<Field>
								<FieldLabel for="confirm-password">Confirm Password</FieldLabel>
								<Input id="confirm-password" {..._confirmPassword.as('password')} />
								{#each _confirmPassword.issues() as issue (issue)}
									<FieldError>{issue.message}</FieldError>
								{/each}
							</Field>
						</Field>
						<FieldDescription>Must be at least 8 characters long.</FieldDescription>
					</Field>
					<Field>
						{#each signUp.fields.issues() as issue (issue)}
							<FieldError>{issue.message}</FieldError>
						{/each}
						<Button type="submit">Create Account</Button>
						<FieldDescription class="text-center">
							Already have an account? <a href={resolve('/sign-in')}>Sign in</a>
						</FieldDescription>
					</Field>
				</FieldGroup>
			</form>
		</CardContent>
	</Card>
</div>
