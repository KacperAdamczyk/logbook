import { useFieldContext } from "@/form";
import { NumberInput, type NumberInputProps } from "@heroui/number-input";

interface NumberFieldProps
	extends Pick<NumberInputProps, "className" | "label" | "isRequired"> {}

export function NumberField(props: NumberFieldProps) {
	const {
		name,
		state: {
			value,
			meta: { errors },
		},
		handleChange,
		handleBlur,
	} = useFieldContext<number>();

	return (
		<NumberInput
			name={name}
			value={value}
			onValueChange={handleChange}
			onBlur={handleBlur}
			isInvalid={!!errors.length}
			errorMessage={errors.join(", ")}
			{...props}
		/>
	);
}
