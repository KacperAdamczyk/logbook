<script lang="ts">
	import type { RemoteForm } from '@sveltejs/kit';

	import type { FlightLogSchema } from '$lib/remotes/flight-log/flight-log.schema';
	import { FieldSet, FieldGroup, FieldError } from '$lib/components/ui/field';
	import { FieldWrapper } from '$lib/components/field-wrapper';
	import { DatePicker } from '$lib/components/date-picker';

	interface Props {
		remote: RemoteForm<FlightLogSchema, unknown>;
	}

	const { remote }: Props = $props();
</script>

<FieldSet>
	<FieldGroup>
		<FieldWrapper label="Date" errors={remote.fields.date.issues()}>
			{#snippet children(id)}
				<DatePicker {id} {...remote.fields.date.as('text')}></DatePicker>
			{/snippet}
		</FieldWrapper>
	</FieldGroup>
	<FieldError errors={remote.fields.allIssues()} />
</FieldSet>
