import { BaseFieldValues, FieldBaseProps } from "@/components/fields/FieldBase";
import { TextAreaProps, Textarea } from "@nextui-org/react";
import { useController, useFormContext } from "react-hook-form";

interface TextAreaFieldProps<FieldValues extends BaseFieldValues>
	extends FieldBaseProps<FieldValues, string>,
		Pick<
			TextAreaProps,
			"className" | "label" | "isRequired" | "minRows" | "maxRows"
		> {}

export function TextAreaField<FieldValues extends BaseFieldValues>({
	name,
	...textareaProps
}: TextAreaFieldProps<FieldValues>) {
	// const {
	// 	field,
	// 	fieldState: { invalid, error },
	// } = useController<FieldValues>({ name });

	const { register } = useFormContext();
	const field = register(name);

	return (
		<Textarea
			{...field}
			// name={field.name}
			// ref={field.ref}
			// value={field.value}
			// onValueChange={field.onChange}
			// onBlur={field.onBlur}
			// isInvalid={invalid}
			// errorMessage={error?.message}
			{...textareaProps}
		/>
	);
}
