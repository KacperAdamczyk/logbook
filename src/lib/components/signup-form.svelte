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
		FieldDescription,
		FieldError
	} from '$lib/components/ui/field/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import type { HTMLAttributes } from 'svelte/elements';
	import { signUp } from '$lib/remotes/auth/auth.remote';
	import { signUpSchema } from '$lib/remotes/auth/auth.schema';
	import { resolve } from '$app/paths';
	import FormField from '$lib/components/form-field/form-field.svelte';

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
					<FormField label="Full Name" errors={name.issues()}>
						{#snippet children(id)}
							<Input {id} placeholder="John Doe" {...name.as('text')} />
						{/snippet}
					</FormField>
					<FormField label="Email" errors={email.issues()}>
						{#snippet children(id)}
							<Input {id} placeholder="m@example.com" {...email.as('email')} />
						{/snippet}
					</FormField>
					<Field>
						<div class="grid grid-cols-2 gap-4">
							<FormField label="Password" errors={_password.issues()}>
								{#snippet children(id)}
									<Input {id} {..._password.as('password')} />
								{/snippet}
							</FormField>
							<FormField label="Confirm Password" errors={_confirmPassword.issues()}>
								{#snippet children(id)}
									<Input {id} {..._confirmPassword.as('password')} />
								{/snippet}
							</FormField>
						</div>
						<FieldDescription>Must be at least 8 characters long.</FieldDescription>
					</Field>
					<Field>
						<FieldError errors={signUp.fields.issues()} />
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
