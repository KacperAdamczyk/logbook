import type {
	BaseFieldValues,
	FieldBaseProps,
} from "@/components/fields/fieldBase";
import { CalendarDate } from "@internationalized/date";
import { DatePicker, type DatePickerProps } from "@nextui-org/react";
import { useCallback } from "react";
import { useController } from "react-hook-form";

interface DateFieldProps<FieldValues extends BaseFieldValues>
	extends FieldBaseProps<FieldValues, Date | undefined>,
		Pick<DatePickerProps, "className" | "label" | "isRequired"> {}

export function DateField<FieldValues extends BaseFieldValues>({
	name,
	...datePickerProps
}: DateFieldProps<FieldValues>) {
	const {
		field: { ref, name: fieldName, value, onChange, onBlur, disabled },
		fieldState: { invalid, error },
	} = useController<FieldValues, typeof name>({ name });

	const handleChange = useCallback(
		(date: CalendarDate | null) => {
			onChange(date?.toDate("utc"));
		},
		[onChange],
	);

	const dateValue =
		value &&
		new CalendarDate(
			value.getFullYear(),
			value.getMonth() + 1,
			value.getDate(),
		);

	return (
		<DatePicker
			name={fieldName}
			inputRef={ref}
			value={dateValue}
			onChange={handleChange}
			onBlur={onBlur}
			isInvalid={invalid}
			errorMessage={error?.message}
			isDisabled={disabled}
			showMonthAndYearPickers
			{...datePickerProps}
		/>
	);
}
