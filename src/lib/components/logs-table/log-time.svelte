<script lang="ts">
	import { formatMinutesToTime } from "$lib/utils/parse-duration";

	interface Props {
		type: "flight" | "simulator";
		totalFlightTime: number | null;
		simulatorTotalTime: number | null;
	}

	const { type, totalFlightTime, simulatorTotalTime }: Props = $props();

	const time = $derived(type === "flight" ? totalFlightTime : simulatorTotalTime);
</script>

<span class="font-mono text-sm">
	{time !== null ? formatMinutesToTime(time) : "—"}
</span>
