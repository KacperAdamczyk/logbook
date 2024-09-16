import type {
	BaseFieldValues,
	FieldBaseProps,
} from "@/components/fields/fieldBase";
import { parseTime } from "@internationalized/date";
import { Button, TimeInput, type TimeInputProps, cn } from "@nextui-org/react";
import { IconClockHour1 } from "@tabler/icons-react";
import { useCallback } from "react";
import { useController } from "react-hook-form";

export interface TimeFieldProps<FieldValues extends BaseFieldValues>
	extends FieldBaseProps<FieldValues, string | undefined>,
		Pick<TimeInputProps, "className" | "label" | "isRequired"> {
	fillable?: boolean;
	fillValue?: string;
}

export function TimeField<FieldValues extends BaseFieldValues>({
	name,
	className,
	fillable,
	fillValue,
	...timeInputProps
}: TimeFieldProps<FieldValues>) {
	const {
		field,
		fieldState: { invalid, error },
	} = useController<FieldValues>({ name });

	const onChange = useCallback<NonNullable<TimeInputProps["onChange"]>>(
		(value) => {
			field.onChange(value ? value.toString() : undefined);
		},
		[field],
	);

	const onFill = useCallback(() => {
		if (!fillValue) return;

		field.onChange(fillValue);
	}, [field, fillValue]);

	const value = field.value ? parseTime(field.value) : null;

	return (
		<div className={cn("flex gap-1", className)}>
			<TimeInput
				name={field.name}
				inputRef={field.ref}
				value={value}
				onChange={onChange}
				onBlur={field.onBlur}
				isInvalid={invalid}
				errorMessage={error?.message}
				hourCycle={24}
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
