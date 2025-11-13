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
		FieldDescription,
		FieldError
	} from '$lib/components/ui/field/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { cn } from '$lib/utils.js';
	import type { HTMLAttributes } from 'svelte/elements';
	import { resolve } from '$app/paths';
	import { signIn } from '$lib/remotes/auth/auth.remote';
	import { signInSchema } from '$lib/remotes/auth/auth.schema';
	import FieldWrapper from '$lib/components/field-wrapper/field-wrapper.svelte';

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
					<FieldWrapper label="Email" errors={email.issues()}>
						{#snippet children(id)}
							<Input {id} placeholder="email@example.com" {...email.as('email')} />
						{/snippet}
					</FieldWrapper>

					<FieldWrapper label="Password" errors={_password.issues()}>
						{#snippet children(id)}
							<Input {id} {..._password.as('password')} />
							<div class="flex items-center justify-between">
								<a href="##" class="text-sm underline-offset-4 hover:underline">
									Forgot your password?
								</a>
							</div>
						{/snippet}
					</FieldWrapper>
					<Field>
						<FieldError errors={signIn.fields.issues()} />
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
