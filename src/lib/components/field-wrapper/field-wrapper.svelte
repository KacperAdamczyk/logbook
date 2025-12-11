<script lang="ts">
	import {
		Field,
		FieldContent,
		FieldLabel,
		FieldError,
		FieldDescription
	} from '$lib/components/ui/field';
	import type { Snippet } from 'svelte';

	interface Props {
		label?: string;
		description?: string;
		errors?: { message: string }[];
		children?: Snippet<[string]>;
	}

	const { label, description, errors, children }: Props = $props();
	const id = $props.id();
</script>

<Field data-invalid={errors?.length}>
	<FieldContent>
		{#if label}
			<FieldLabel for={id}>{label}</FieldLabel>
		{/if}
		{@render children?.(id)}
		{#if description}
			<FieldDescription>{description}</FieldDescription>
		{/if}
		<FieldError {errors} />
	</FieldContent>
</Field>
