import { useFieldContext } from "@/form";
import { DatePicker, type DatePickerProps } from "@heroui/date-picker";
import { CalendarDate } from "@internationalized/date";
import { useCallback } from "react";

interface DateFieldProps
	extends Pick<DatePickerProps, "className" | "label" | "isRequired"> {}

export function DateField(props: DateFieldProps) {
	const {
		name,
		state: {
			value,
			meta: { errors },
		},
		handleChange,
		handleBlur,
	} = useFieldContext<Date | null>();

	const onChange = useCallback(
		(date: CalendarDate | null) => {
			handleChange(date ? date.toDate("utc") : null);
		},
		[handleChange],
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
			name={name}
			value={dateValue}
			onChange={onChange}
			onBlur={handleBlur}
			isInvalid={!!errors.length}
			errorMessage={errors.join(", ")}
			showMonthAndYearPickers
			{...props}
		/>
	);
}
