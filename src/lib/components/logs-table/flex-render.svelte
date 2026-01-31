<script lang="ts">
	import { flexRender } from "@tanstack/svelte-table";

	interface Props {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		content: any;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		context: any;
	}

	const { content, context }: Props = $props();
	const Component = $derived(flexRender(content, context));
</script>

{#if Component}
	<Component />
{/if}
