<script lang="ts">
	import { page } from "$app/state";
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle,
	} from "$lib/components/ui/card";
	import { getFlightLog } from "$lib/remotes/flight-log/get-flight-log/get-flight-log.remote";

	const flightLog = $derived(await getFlightLog(page.params.id!));
</script>

<div class="p-6">
	<Card class="mx-auto w-full max-w-3xl">
		<CardHeader>
			<CardTitle>Flight Log Details</CardTitle>
			<CardDescription>
				{flightLog.departurePlace?.name} → {flightLog.arrivalPlace?.name}
			</CardDescription>
		</CardHeader>
		<CardContent class="space-y-6">
			<div class="grid grid-cols-2 gap-4">
				<div>
					<p class="text-sm text-muted-foreground">Departure</p>
					<p class="font-medium">{flightLog.departurePlace?.name}</p>
					<p class="text-sm text-muted-foreground">
						{new Date(flightLog.departureAt).toLocaleString()}
					</p>
				</div>
				<div>
					<p class="text-sm text-muted-foreground">Arrival</p>
					<p class="font-medium">{flightLog.arrivalPlace?.name}</p>
					<p class="text-sm text-muted-foreground">
						{new Date(flightLog.arrivalAt).toLocaleString()}
					</p>
				</div>
			</div>

			<div class="grid grid-cols-2 gap-4">
				<div>
					<p class="text-sm text-muted-foreground">Aircraft</p>
					<p class="font-medium">{flightLog.aircraft?.registration}</p>
					<p class="text-sm text-muted-foreground">{flightLog.aircraft?.model}</p>
				</div>
				<div>
					<p class="text-sm text-muted-foreground">Pilot in Command</p>
					<p class="font-medium">{flightLog.pilotInCommand?.name}</p>
				</div>
			</div>

			<div>
				<p class="mb-2 text-sm text-muted-foreground">Flight Times</p>
				<div class="grid grid-cols-2 gap-2 text-sm md:grid-cols-4">
					<div>
						<p class="text-muted-foreground">Total</p>
						<p class="font-medium">{flightLog.totalFlightTime} min</p>
					</div>
					<div>
						<p class="text-muted-foreground">SP/SE</p>
						<p class="font-medium">{flightLog.singlePilotSingleEngineTime} min</p>
					</div>
					<div>
						<p class="text-muted-foreground">SP/ME</p>
						<p class="font-medium">{flightLog.singlePilotMultiEngineTime} min</p>
					</div>
					<div>
						<p class="text-muted-foreground">Multi-Pilot</p>
						<p class="font-medium">{flightLog.multiPilotTime} min</p>
					</div>
				</div>
			</div>

			<div>
				<p class="mb-2 text-sm text-muted-foreground">Operational Conditions</p>
				<div class="grid grid-cols-2 gap-2 text-sm">
					<div>
						<p class="text-muted-foreground">Night</p>
						<p class="font-medium">{flightLog.operationalConditionNightTime} min</p>
					</div>
					<div>
						<p class="text-muted-foreground">IFR</p>
						<p class="font-medium">{flightLog.operationalConditionIfrTime} min</p>
					</div>
				</div>
			</div>

			<div>
				<p class="mb-2 text-sm text-muted-foreground">Pilot Function Times</p>
				<div class="grid grid-cols-2 gap-2 text-sm md:grid-cols-4">
					<div>
						<p class="text-muted-foreground">PIC</p>
						<p class="font-medium">{flightLog.functionPilotInCommandTime} min</p>
					</div>
					<div>
						<p class="text-muted-foreground">Co-Pilot</p>
						<p class="font-medium">{flightLog.functionCoPilotTime} min</p>
					</div>
					<div>
						<p class="text-muted-foreground">Dual</p>
						<p class="font-medium">{flightLog.functionDualTime} min</p>
					</div>
					<div>
						<p class="text-muted-foreground">Instructor</p>
						<p class="font-medium">{flightLog.functionInstructorTime} min</p>
					</div>
				</div>
			</div>

			<div>
				<p class="mb-2 text-sm text-muted-foreground">Takeoffs & Landings</p>
				<div class="grid grid-cols-2 gap-2 text-sm md:grid-cols-4">
					<div>
						<p class="text-muted-foreground">Takeoffs (Day)</p>
						<p class="font-medium">{flightLog.takeoffsDay}</p>
					</div>
					<div>
						<p class="text-muted-foreground">Takeoffs (Night)</p>
						<p class="font-medium">{flightLog.takeoffsNight}</p>
					</div>
					<div>
						<p class="text-muted-foreground">Landings (Day)</p>
						<p class="font-medium">{flightLog.landingsDay}</p>
					</div>
					<div>
						<p class="text-muted-foreground">Landings (Night)</p>
						<p class="font-medium">{flightLog.landingsNight}</p>
					</div>
				</div>
			</div>

			{#if flightLog.remarks}
				<div>
					<p class="mb-2 text-sm text-muted-foreground">Remarks</p>
					<p>{flightLog.remarks}</p>
				</div>
			{/if}
		</CardContent>
	</Card>
</div>
