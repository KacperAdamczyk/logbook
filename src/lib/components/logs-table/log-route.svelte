<script lang="ts">
	interface Props {
		type: "flight" | "simulator";
		departurePlaceId: string | null;
		arrivalPlaceId: string | null;
		simulatorType: string | null;
	}

	const { type, departurePlaceId, arrivalPlaceId, simulatorType }: Props = $props();
</script>

{#if type === "flight"}
	<span class="font-mono text-sm">
		{departurePlaceId ?? "—"} → {arrivalPlaceId ?? "—"}
	</span>
{:else}
	<span class="text-sm text-muted-foreground">
		{simulatorType ?? "—"}
	</span>
{/if}
