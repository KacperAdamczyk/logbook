<script lang="ts">
	import type { RemoteForm } from '@sveltejs/kit';

	import type { FlightLogSchema } from '$lib/remotes/flight-log/flight-log.schema';
	import Button from '$lib/components/ui/button/button.svelte';

	interface Props {
		remote: RemoteForm<FlightLogSchema, unknown>;
	}

	const { remote }: Props = $props();
</script>

<form {...remote}>
	<Button type="submit" disabled={!!remote.pending}>Add</Button>
</form>
