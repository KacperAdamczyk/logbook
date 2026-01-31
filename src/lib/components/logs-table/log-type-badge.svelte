<script lang="ts">
	interface Props {
		type: "flight" | "simulator";
	}

	const { type }: Props = $props();
</script>

<span
	class="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium {type === 'flight'
		? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
		: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300'}"
>
	{type === "flight" ? "Flight" : "Simulator"}
</span>
