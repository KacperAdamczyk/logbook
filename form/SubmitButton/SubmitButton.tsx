import { useFormContext } from "@/form";
import { Button, type ButtonProps } from "@heroui/react";

export function SubmitButton(props: ButtonProps) {
	const form = useFormContext();

	return (
		<form.Subscribe selector={(store) => store.isSubmitting}>
			{(isSubmitting) => (
				<Button type="submit" {...props} disabled={isSubmitting} />
			)}
		</form.Subscribe>
	);
}
