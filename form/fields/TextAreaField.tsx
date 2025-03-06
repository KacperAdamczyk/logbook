import { useFieldContext } from "@/form";
import { type TextAreaProps, Textarea } from "@heroui/input";

interface TextAreaFieldProps
	extends Pick<
		TextAreaProps,
		"className" | "label" | "isRequired" | "minRows" | "maxRows"
	> {}

export function TextAreaField(props: TextAreaFieldProps) {
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
		<Textarea
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
