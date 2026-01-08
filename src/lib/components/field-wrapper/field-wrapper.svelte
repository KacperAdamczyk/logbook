<script lang="ts">
	import * as Field from "$lib/components/ui/field/index.js";
	import type { Snippet } from "svelte";

	interface Props {
		label?: string;
		description?: string;
		errors?: { message: string }[];
		children?: Snippet<[string]>;
	}

	const { label, description, errors, children }: Props = $props();
	const id = $props.id();
</script>

<Field.Field data-invalid={errors?.length}>
	<Field.Content>
		{#if label}
			<Field.Label for={id}>{label}</Field.Label>
		{/if}
		{@render children?.(id)}
		{#if description}
			<Field.Description>{description}</Field.Description>
		{/if}
		<Field.Error {errors} />
	</Field.Content>
</Field.Field>
