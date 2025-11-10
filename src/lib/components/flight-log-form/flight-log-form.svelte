<script lang="ts">
	import type { RemoteForm } from '@sveltejs/kit';

	import type { FlightLogSchema } from '$lib/remotes/flight-log/flight-log.schema';

	interface Props {
		remote: RemoteForm<FlightLogSchema, void>;
	}

	const { remote }: Props = $props();
	let f = $state<string>();
</script>

<form {...remote}></form>
