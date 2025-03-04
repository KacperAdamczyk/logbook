import { useFieldContext } from "@/form";
import { Input, type InputProps } from "@heroui/input";

interface InputFieldProps
	extends Pick<InputProps, "className" | "label" | "isRequired" | "type"> {}

export function InputField(props: InputFieldProps) {
	const {
		name,
		state: {
			value,
			meta: { errors },
		},
		handleChange,
		handleBlur,
	} = useFieldContext<string>();

	return (
		<Input
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
