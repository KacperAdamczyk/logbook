import { DateField } from "@/components/fields/DateField";
import { InputField } from "@/components/fields/InputField";
import { NumberField } from "@/components/fields/NumberField";
import { RadioField } from "@/components/fields/RadioField";
import { SelectField } from "@/components/fields/SelectField";
import { TextAreaField } from "@/components/fields/TextAreaField";
import { TimeField } from "@/components/fields/TimeField";
import { SubmitButton } from "@/form/SubmitButton";
import { createFormHookContexts, createFormHook } from "@tanstack/react-form";

const { fieldContext, formContext, useFieldContext, useFormContext } =
	createFormHookContexts();

const { useAppForm } = createFormHook({
	fieldContext,
	formContext,
	fieldComponents: {
		DateField,
		InputField,
		NumberField,
		RadioField,
		SelectField,
		TextAreaField,
		TimeField,
	},
	formComponents: {
		SubmitButton,
	},
});

export { useFieldContext, useFormContext, useAppForm };
