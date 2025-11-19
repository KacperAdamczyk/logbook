<script lang="ts">
	import CalendarIcon from '@lucide/svelte/icons/calendar';
	import { parseDate } from '@internationalized/date';
	import { cn } from '$lib/utils.js';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import { Calendar } from '$lib/components/ui/calendar/index.js';
	import { Popover, PopoverTrigger, PopoverContent } from '$lib/components/ui/popover/index.js';

	interface Props {
		id?: string;
		name: string;
		value: string | number;
	}

	let { id, name, value = $bindable('') }: Props = $props();

	const dateValue = $derived.by(() => {
		try {
			return parseDate(value.toString());
		} catch {
			return undefined;
		}
	});
</script>

<input id={`${id}-input`} type="hidden" {name} bind:value />
<Popover>
	<PopoverTrigger
		class={cn(
			buttonVariants({
				variant: 'outline',
				class: 'w-[280px] justify-start text-left font-normal'
			}),
			!value && 'text-muted-foreground'
		)}
	>
		<CalendarIcon />
		{dateValue ? dateValue.toString() : 'Pick a date'}
	</PopoverTrigger>
	<PopoverContent class="w-auto p-0">
		<Calendar
			{id}
			type="single"
			bind:value={() => dateValue, (date) => (value = date ? date.toString() : '')}
		/>
	</PopoverContent>
</Popover>
