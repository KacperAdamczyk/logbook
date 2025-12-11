<script lang="ts">
	import * as InputOTP from '$lib/components/ui/input-otp/index.js';
	import { REGEXP_ONLY_DIGITS } from 'bits-ui';

	interface Props {
		id: string;
		name: string;
		value: string | number;
	}

	let { id, name, value = $bindable() }: Props = $props();
</script>

<InputOTP.Root
	{id}
	maxlength={4}
	{name}
	pattern={REGEXP_ONLY_DIGITS}
	bind:value={() => value.toString(), (v) => (value = v)}
>
	{#snippet children({ cells })}
		<InputOTP.Group>
			{#each cells as cell (cell)}
				<InputOTP.Slot {cell} />
			{/each}
		</InputOTP.Group>
	{/snippet}
</InputOTP.Root>
