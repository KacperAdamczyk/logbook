import type {
	BaseFieldValues,
	FieldBaseProps,
} from "@/components/fields/fieldBase";
import { type TextAreaProps, Textarea } from "@heroui/input";
import { useCallback } from "react";
import { useController } from "react-hook-form";

interface TextAreaFieldProps<FieldValues extends BaseFieldValues>
	extends FieldBaseProps<FieldValues, string | null>,
		Pick<
			TextAreaProps,
			"className" | "label" | "isRequired" | "minRows" | "maxRows"
		> {}

export function TextAreaField<FieldValues extends BaseFieldValues>({
	name,
	...textareaProps
}: TextAreaFieldProps<FieldValues>) {
	const {
		field,
		fieldState: { invalid, error },
	} = useController<FieldValues, typeof name>({ name });

	const handleChange = useCallback(
		(value: string) => {
			field.onChange(value !== "" ? value : null);
		},
		[field],
	);

	return (
		<Textarea
			name={field.name}
			ref={field.ref}
			value={field.value ?? ""}
			onValueChange={handleChange}
			onBlur={field.onBlur}
			isInvalid={invalid}
			errorMessage={error?.message}
			{...textareaProps}
		/>
	);
}
