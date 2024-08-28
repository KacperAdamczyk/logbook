"use client";
import { logFormSchema } from "@/actions/validation/logFormSchema";
import { FlightDuration } from "@/components/FlightDuration";
import { DateField } from "@/components/fields/DateField";
import { SelectField } from "@/components/fields/SelectField";
import { TimeField } from "@/components/fields/TimeField";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@nextui-org/react";
import { FC } from "react";
import { DefaultValues, FormProvider, useForm } from "react-hook-form";

export interface LogFormFieldValues {
	date: string;
	departurePlace: string | undefined;
	departureTime: string | undefined;
	arrivalPlace: string | undefined;
	arrivalTime: string | undefined;
}

export interface LogFormProps {
	defaultValues?: DefaultValues<LogFormFieldValues>;
}
const o = [
	{ label: "EPRZ", value: "EPRZ" },
	{ label: "WAW", value: "WAW" },
];

export const LogForm: FC<LogFormProps> = ({ defaultValues }) => {
	const methods = useForm<LogFormFieldValues>({
		defaultValues,
		resolver: zodResolver(logFormSchema),
	});

	const onSubmit = (data: LogFormFieldValues) => console.log(data);

	return (
		<FormProvider {...methods}>
			<form onSubmit={methods.handleSubmit(onSubmit)}>
				<DateField<LogFormFieldValues> name="date" label="Date" isRequired />
				<SelectField<LogFormFieldValues>
					name="departurePlace"
					label="Departure Place"
					items={o}
					isRequired
				/>
				<TimeField<LogFormFieldValues>
					name="departureTime"
					label="Departure Time"
					isRequired
				/>
				<SelectField<LogFormFieldValues>
					name="arrivalPlace"
					label="Arrival Place"
					items={o}
					isRequired
				/>
				<TimeField<LogFormFieldValues>
					name="arrivalTime"
					label="Arrival Time"
					isRequired
				/>
				<FlightDuration />
				<Button type="submit">Save</Button>
			</form>
		</FormProvider>
	);
};
