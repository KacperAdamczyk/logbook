<script lang="ts">
	import FlightLogForm from '$lib/components/flight-log-form/flight-log-form.svelte';
	import {
		Card,
		CardContent,
		CardHeader,
		CardTitle,
		CardDescription
	} from '$lib/components/ui/card';
	import { createFlightLog } from '$lib/remotes/flight-log/create-flight-log/create-flight-log.remote';
	import { toast } from 'svelte-sonner';

	$effect(() => {
		console.log('Result', createFlightLog.pending, createFlightLog.result);
	});
</script>

<Card class="mx-auto w-full max-w-3xl">
	<CardHeader>
		<CardTitle>New Flight Log</CardTitle>
		<CardDescription>Fill out the form below to create a new flight log entry.</CardDescription>
	</CardHeader>
	<CardContent>
		<FlightLogForm remote={createFlightLog} />
	</CardContent>
</Card>
