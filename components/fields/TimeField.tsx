import type {
	BaseFieldValues,
	FieldBaseProps,
} from "@/components/fields/fieldBase";
import type { TimeValue } from "@/types/TimeValue";
import { Time } from "@internationalized/date";
import { Button, TimeInput, type TimeInputProps, cn } from "@nextui-org/react";
import { IconClockHour1 } from "@tabler/icons-react";
import { useCallback } from "react";
import { useController } from "react-hook-form";

export interface TimeFieldProps<FieldValues extends BaseFieldValues>
	extends FieldBaseProps<FieldValues, TimeValue | null>,
		Pick<TimeInputProps, "className" | "label" | "isRequired"> {
	fillable?: boolean;
	fillValue?: TimeValue;
}

export function TimeField<FieldValues extends BaseFieldValues>({
	name,
	className,
	fillable,
	fillValue,
	...timeInputProps
}: TimeFieldProps<FieldValues>) {
	const {
		field: { name: fieldName, ref, value, onChange, onBlur, disabled },
		fieldState: { invalid, error },
	} = useController<FieldValues, typeof name>({ name });

	const handleChange = useCallback(
		(time: Time | null) => {
			onChange(
				time && ({ hour: time.hour, minute: time.minute } satisfies TimeValue),
			);
		},
		[onChange],
	);

	const onFill = useCallback(() => {
		if (!fillValue) return;

		onChange(fillValue);
	}, [fillValue, onChange]);

	const timeValue = value && new Time(value.hour, value.minute);

	return (
		<div className={cn("flex gap-1", className)}>
			<TimeInput<Time>
				name={fieldName}
				inputRef={ref}
				value={timeValue}
				onChange={handleChange}
				onBlur={onBlur}
				isInvalid={invalid}
				errorMessage={error?.message}
				hourCycle={24}
				isDisabled={disabled}
				{...timeInputProps}
			/>
			{fillable && (
				<Button
					className="h-full"
					isIconOnly
					size="sm"
					variant="bordered"
					onClick={onFill}
					isDisabled={!fillValue}
				>
					<IconClockHour1 size={20} />
				</Button>
			)}
		</div>
	);
}
