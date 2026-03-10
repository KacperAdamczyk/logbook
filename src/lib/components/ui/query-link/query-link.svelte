<script lang="ts">
	import { cn, type WithElementRef } from "$lib/utils.js";
	import type { HTMLAnchorAttributes } from "svelte/elements";

	type Props = WithElementRef<HTMLAnchorAttributes> & {
		href: string;
	};

	let { ref = $bindable(null), href, class: className, children, ...restProps }: Props = $props();
</script>

<a bind:this={ref} {href} class={cn(className)} {...restProps}>
	{@render children?.()}
</a>
