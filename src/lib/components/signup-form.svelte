<script lang="ts">
	import { cn } from '$lib/utils.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Field from '$lib/components/ui/field/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import type { HTMLAttributes } from 'svelte/elements';
	import { signUp } from '$lib/remotes/auth/auth.remote';
	import { signUpSchema } from '$lib/remotes/auth/auth.schema';
	import { resolve } from '$app/paths';

	const { class: className, ...restProps }: HTMLAttributes<HTMLDivElement> = $props();
	const { fields: { name, email, _password, _confirmPassword } } = signUp;
</script>

<div class={cn('flex flex-col gap-6', className)} {...restProps}>
	<Card.Root>
		<Card.Header class="text-center">
			<Card.Title class="text-xl">Create your account</Card.Title>
			<Card.Description>Enter your email below to create your account</Card.Description>
		</Card.Header>
		<Card.Content>
			<form {...signUp.preflight(signUpSchema)}>
				<Field.Group>
					<Field.Field>
						<Field.Label for="name">Full Name</Field.Label>
						<Input id="name" placeholder="John Doe" {...name.as('text')} />
						{#each name.issues() ?? [] as issue (issue)}
							<Field.Error>{issue.message}</Field.Error>
						{/each}
					</Field.Field>
					<Field.Field>
						<Field.Label for="email">Email</Field.Label>
						<Input id="email" placeholder="m@example.com" {...email.as('email')} />
						{#each email.issues() ?? [] as issue (issue)}
							<Field.Error>{issue.message}</Field.Error>
						{/each}
					</Field.Field>
					<Field.Field>
						<Field.Field class="grid grid-cols-2 gap-4">
							<Field.Field>
								<Field.Label for="password">Password</Field.Label>
								<Input id="password" {..._password.as('password')} />
								{#each _password.issues() ?? [] as issue (issue)}
									<Field.Error>{issue.message}</Field.Error>
								{/each}
							</Field.Field>
							<Field.Field>
								<Field.Label for="confirm-password">Confirm Password</Field.Label>
								<Input id="confirm-password" {..._confirmPassword.as('password')} />
								{#each _confirmPassword.issues() ?? [] as issue (issue)}
									<Field.Error>{issue.message}</Field.Error>
								{/each}
							</Field.Field>
						</Field.Field>
						<Field.Description>Must be at least 8 characters long.</Field.Description>
					</Field.Field>
					<Field.Field>
						{#each signUp.fields.issues() ?? [] as issue (issue)}
							<Field.Error>{issue.message}</Field.Error>
						{/each}
						<Button type="submit">Create Account</Button>
						<Field.Description class="text-center">
							Already have an account? <a href={resolve('/sign-in')}>Sign in</a>
						</Field.Description>
					</Field.Field>
				</Field.Group>
			</form>
		</Card.Content>
	</Card.Root>
</div>
