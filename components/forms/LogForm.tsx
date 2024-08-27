"use client";
import { logFormSchema } from "@/actions/validation/logFormSchema";
import { DateField } from "@/components/fields/DateField";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@nextui-org/react";
import { FC } from "react";
import { DefaultValues, FormProvider, useForm } from "react-hook-form";

interface FieldValues {
	date: string;
}

export interface LogFormProps {
	defaultValues?: DefaultValues<FieldValues>;
}

export const LogForm: FC<LogFormProps> = ({ defaultValues }) => {
	const methods = useForm<FieldValues>({
		defaultValues,
		resolver: zodResolver(logFormSchema),
	});

	const onSubmit = (data: FieldValues) => console.log(data);

	return (
		<FormProvider {...methods}>
			<form onSubmit={methods.handleSubmit(onSubmit)}>
				<DateField<FieldValues> name="date" label="Date" />
				<Button type="submit">Save</Button>
			</form>
		</FormProvider>
	);
};
