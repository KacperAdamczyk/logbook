"use client";
import { logFormSchema } from "@/actions/validation/logFormSchema";
import { DateField } from "@/components/fields/DateField";
import { SelectField } from "@/components/fields/SelectField";
import { TimeField } from "@/components/fields/TimeField";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@nextui-org/react";
import { FC } from "react";
import { DefaultValues, FormProvider, useForm } from "react-hook-form";

interface FieldValues {
	date: string;
	departurePlace: string;
	departureTime: string;
	arrivalPlace: string;
	arrivalTime: string;
}

export interface LogFormProps {
	defaultValues?: DefaultValues<FieldValues>;
}
const o = [
	{ label: "EPRZ", value: "EPRZ" },
	{ label: "WAW", value: "WAW" },
];

export const LogForm: FC<LogFormProps> = ({ defaultValues }) => {
	const methods = useForm<FieldValues>({
		defaultValues,
		resolver: zodResolver(logFormSchema),
	});

	const onSubmit = (data: FieldValues) => console.log(data);

	return (
		<FormProvider {...methods}>
			<form onSubmit={methods.handleSubmit(onSubmit)}>
				<DateField<FieldValues> name="date" label="Date" isRequired />
				<SelectField<FieldValues>
					name="departurePlace"
					label="Departure Place"
					items={o}
				/>
				<TimeField<FieldValues> name="departureTime" label="Departure Time" />
				<SelectField<FieldValues>
					name="arrivalPlace"
					label="Arrival Place"
					items={o}
				/>
				<TimeField<FieldValues> name="arrivalTime" label="Arrival Time" />
				<Button type="submit">Save</Button>
			</form>
		</FormProvider>
	);
};
