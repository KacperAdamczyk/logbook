<script lang="ts">
	import { Field, FieldContent, FieldLabel, FieldError } from '$lib/components/ui/field';
	import type { Snippet } from 'svelte';

	interface Props {
		label?: string;
		errors?: { message: string }[];
		children?: Snippet<[string]>;
	}

	const { label, errors, children }: Props = $props();
	const id = $props.id();
</script>

<Field data-invalid={errors?.length}>
	<FieldContent>
		{#if label}
			<FieldLabel for={id}>{label}</FieldLabel>
		{/if}
		{@render children?.(id)}
		<FieldError {errors} />
	</FieldContent>
</Field>
