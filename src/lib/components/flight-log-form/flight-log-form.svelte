<script lang="ts">
	import type { RemoteForm } from '@sveltejs/kit';

	import type { FlightLogSchema } from '$lib/remotes/flight-log/flight-log.schema';
	import { FieldSet, FieldGroup, FieldError } from '$lib/components/ui/field';
	import { FieldWrapper } from '$lib/components/field-wrapper';
	import { DatePicker } from '$lib/components/date-picker';
	import Input from '$lib/components/ui/input/input.svelte';
	import TimeInput from '$lib/components/time-input/time-input.svelte';

	interface Props {
		remote: RemoteForm<FlightLogSchema, unknown>;
	}

	const { remote }: Props = $props();
</script>

<FieldSet>
	<FieldGroup>
		<FieldGroup>
			<FieldWrapper label="Date" errors={remote.fields.date.issues()}>
				{#snippet children(id)}
					<DatePicker {id} {...remote.fields.date.as('text')}></DatePicker>
				{/snippet}
			</FieldWrapper>
		</FieldGroup>
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
	</FieldGroup>
	<FieldError errors={remote.fields.allIssues()} />
</FieldSet>
