import { useFieldContext } from "@/form";
import { Radio, RadioGroup, type RadioGroupProps } from "@heroui/radio";
import { useCallback } from "react";

export interface RadioFieldOption<Value extends string> {
	label: string;
	value: Value;
}

interface RadioFieldProps<Value extends string>
	extends Pick<
		RadioGroupProps,
		"className" | "label" | "isRequired" | "orientation"
	> {
	options: RadioFieldOption<Value>[];
}

export function RadioField<Value extends string>({
	options,
	...props
}: RadioFieldProps<Value>) {
	const {
		name,
		state: {
			value,
			meta: { errors },
		},
		handleChange,
		handleBlur,
	} = useFieldContext<Value>();

	const onValueChange = useCallback(
		(newValue: string) => {
			handleChange(newValue as Value);
		},
		[handleChange],
	);

	return (
		<RadioGroup
			name={name}
			value={value}
			onValueChange={onValueChange}
			onBlur={handleBlur}
			isInvalid={!!errors.length}
			errorMessage={errors.join(", ")}
			{...props}
		>
			{options.map(({ label, value }) => (
				<Radio key={value} value={value}>
					{label}
				</Radio>
			))}
		</RadioGroup>
	);
}
