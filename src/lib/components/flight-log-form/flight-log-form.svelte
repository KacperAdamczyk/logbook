<script lang="ts">
	import type { RemoteForm } from '@sveltejs/kit';

	import type { FlightLogSchema } from '$lib/remotes/flight-log/flight-log.schema';
	import { FieldSet, FieldGroup, FieldError } from '$lib/components/ui/field';
	import { FieldWrapper } from '$lib/components/field-wrapper';
	import { DatePicker } from '$lib/components/date-picker';
	import Input from '$lib/components/ui/input/input.svelte';
	import TimeInput from '$lib/components/time-input/time-input.svelte';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';

	interface Props {
		remote: RemoteForm<FlightLogSchema, unknown>;
	}

	const { remote }: Props = $props();
</script>

<FieldSet>
	<FieldGroup>
		<!-- Date -->
		<FieldGroup>
			<FieldWrapper label="Date" errors={remote.fields.date.issues()}>
				{#snippet children(id)}
					<DatePicker {id} {...remote.fields.date.as('text')}></DatePicker>
				{/snippet}
			</FieldWrapper>
		</FieldGroup>
		
		<!-- Departure -->
		<FieldGroup>
			<FieldWrapper label="Departure Place" errors={remote.fields.departurePlace.issues()}>
				{#snippet children(id)}
					<Input {id} {...remote.fields.departurePlace.as('text')} />
				{/snippet}
			</FieldWrapper>
			<FieldWrapper label="Departure Time" errors={remote.fields.departureTime.issues()}>
				{#snippet children(id)}
					<TimeInput {id} {...remote.fields.departureTime.as('text')} />
				{/snippet}
			</FieldWrapper>
		</FieldGroup>
		
		<!-- Arrival -->
		<FieldGroup>
			<FieldWrapper label="Arrival Place" errors={remote.fields.arrivalPlace.issues()}>
				{#snippet children(id)}
					<Input {id} {...remote.fields.arrivalPlace.as('text')} />
				{/snippet}
			</FieldWrapper>
			<FieldWrapper label="Arrival Time" errors={remote.fields.arrivalTime.issues()}>
				{#snippet children(id)}
					<TimeInput {id} {...remote.fields.arrivalTime.as('text')} />
				{/snippet}
			</FieldWrapper>
		</FieldGroup>
		
		<!-- Aircraft -->
		<FieldGroup>
			<FieldWrapper label="Aircraft Model" errors={remote.fields.aircraftModel.issues()}>
				{#snippet children(id)}
					<Input {id} {...remote.fields.aircraftModel.as('text')} />
				{/snippet}
			</FieldWrapper>
			<FieldWrapper label="Aircraft Registration" errors={remote.fields.aircraftRegistration.issues()}>
				{#snippet children(id)}
					<Input {id} {...remote.fields.aircraftRegistration.as('text')} />
				{/snippet}
			</FieldWrapper>
		</FieldGroup>
		
		<!-- Pilot -->
		<FieldGroup>
			<FieldWrapper label="Pilot in Command Name" errors={remote.fields.pilotInCommandName.issues()}>
				{#snippet children(id)}
					<Input {id} {...remote.fields.pilotInCommandName.as('text')} />
				{/snippet}
			</FieldWrapper>
		</FieldGroup>
		
		<!-- Flight Times -->
		<FieldGroup>
			<FieldWrapper label="Total Flight Time" errors={remote.fields.totalFlightTime.issues()}>
				{#snippet children(id)}
					<TimeInput {id} {...remote.fields.totalFlightTime.as('text')} />
				{/snippet}
			</FieldWrapper>
			<FieldWrapper label="Single Pilot Type" errors={remote.fields.singlePilotType.issues()}>
				{#snippet children(id)}
					<select
						{id}
						{...remote.fields.singlePilotType.as('text')}
						class="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-base shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
					>
						<option value="">Select type</option>
						<option value="single">Single</option>
						<option value="multi">Multi</option>
					</select>
				{/snippet}
			</FieldWrapper>
		</FieldGroup>
		
		<FieldGroup>
			<FieldWrapper label="Single Pilot Time" errors={remote.fields.singlePilotTime.issues()}>
				{#snippet children(id)}
					<TimeInput {id} {...remote.fields.singlePilotTime.as('text')} />
				{/snippet}
			</FieldWrapper>
			<FieldWrapper label="Multi Pilot Time" errors={remote.fields.multiPilotTime.issues()}>
				{#snippet children(id)}
					<TimeInput {id} {...remote.fields.multiPilotTime.as('text')} />
				{/snippet}
			</FieldWrapper>
		</FieldGroup>
		
		<!-- Operational Conditions -->
		<FieldGroup>
			<FieldWrapper label="Operational Night Time" errors={remote.fields.operationalConditionNightTime.issues()}>
				{#snippet children(id)}
					<TimeInput {id} {...remote.fields.operationalConditionNightTime.as('text')} />
				{/snippet}
			</FieldWrapper>
			<FieldWrapper label="Operational IFR Time" errors={remote.fields.operationalConditionIfrTime.issues()}>
				{#snippet children(id)}
					<TimeInput {id} {...remote.fields.operationalConditionIfrTime.as('text')} />
				{/snippet}
			</FieldWrapper>
		</FieldGroup>
		
		<!-- Function Times -->
		<FieldGroup>
			<FieldWrapper label="PIC Time" errors={remote.fields.functionPilotInCommandTime.issues()}>
				{#snippet children(id)}
					<TimeInput {id} {...remote.fields.functionPilotInCommandTime.as('text')} />
				{/snippet}
			</FieldWrapper>
			<FieldWrapper label="Co-Pilot Time" errors={remote.fields.functionCoPilotTime.issues()}>
				{#snippet children(id)}
					<TimeInput {id} {...remote.fields.functionCoPilotTime.as('text')} />
				{/snippet}
			</FieldWrapper>
		</FieldGroup>
		
		<FieldGroup>
			<FieldWrapper label="Dual Time" errors={remote.fields.functionDualTime.issues()}>
				{#snippet children(id)}
					<TimeInput {id} {...remote.fields.functionDualTime.as('text')} />
				{/snippet}
			</FieldWrapper>
			<FieldWrapper label="Instructor Time" errors={remote.fields.functionInstructorTime.issues()}>
				{#snippet children(id)}
					<TimeInput {id} {...remote.fields.functionInstructorTime.as('text')} />
				{/snippet}
			</FieldWrapper>
		</FieldGroup>
		
		<!-- Takeoffs and Landings -->
		<FieldGroup>
			<FieldWrapper label="Takeoffs Day" errors={remote.fields.takeoffsDay.issues()}>
				{#snippet children(id)}
					<Input {id} {...remote.fields.takeoffsDay.as('number')} type="number" min="0" />
				{/snippet}
			</FieldWrapper>
			<FieldWrapper label="Takeoffs Night" errors={remote.fields.takeoffsNight.issues()}>
				{#snippet children(id)}
					<Input {id} {...remote.fields.takeoffsNight.as('number')} type="number" min="0" />
				{/snippet}
			</FieldWrapper>
		</FieldGroup>
		
		<FieldGroup>
			<FieldWrapper label="Landings Day" errors={remote.fields.landingsDay.issues()}>
				{#snippet children(id)}
					<Input {id} {...remote.fields.landingsDay.as('number')} type="number" min="0" />
				{/snippet}
			</FieldWrapper>
			<FieldWrapper label="Landings Night" errors={remote.fields.landingsNight.issues()}>
				{#snippet children(id)}
					<Input {id} {...remote.fields.landingsNight.as('number')} type="number" min="0" />
				{/snippet}
			</FieldWrapper>
		</FieldGroup>
		
		<!-- Remarks -->
		<FieldGroup>
			<FieldWrapper label="Remarks" errors={remote.fields.remarks.issues()}>
				{#snippet children(id)}
					<Textarea {id} {...remote.fields.remarks.as('text')} />
				{/snippet}
			</FieldWrapper>
		</FieldGroup>
	</FieldGroup>
	<FieldError errors={remote.fields.allIssues()} />
</FieldSet>
