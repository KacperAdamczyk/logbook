import { DateField } from "@/form/fields/DateField";
import { InputField } from "@/form/fields/InputField";
import { NumberField } from "@/form/fields/NumberField";
import { RadioField } from "@/form/fields/RadioField";
import { SelectField } from "@/form/fields/SelectField";
import { TextAreaField } from "@/form/fields/TextAreaField";
import { TimeField } from "@/form/fields/TimeField";
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
