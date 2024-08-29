"use client";
import { logFormSchema } from "@/actions/validation/logFormSchema";
import { FlightDuration } from "@/components/FlightDuration";
import { DateField } from "@/components/fields/DateField";
import { InputField } from "@/components/fields/InputField";
import { RadioField, RadioFieldOption } from "@/components/fields/RadioField";
import { SelectField } from "@/components/fields/SelectField";
import { TextAreaField } from "@/components/fields/TextAreaField";
import { TimeField, TimeFieldProps } from "@/components/fields/TimeField";
import { calculateFlightTime } from "@/helpers/calculateFlightTime";
import { formatMinutes } from "@/helpers/formatMinutes";
import { zodResolver } from "@hookform/resolvers/zod";
import { parseTime } from "@internationalized/date";
import { Button, Divider } from "@nextui-org/react";
import { FC, useMemo } from "react";
import { DefaultValues, FormProvider, useForm } from "react-hook-form";

export type EngineType = "single" | "multi";
export interface LogFormFieldValues {
	date: string;
	departurePlace: string | undefined;
	departureTime: string | undefined;
	arrivalPlace: string | undefined;
	arrivalTime: string | undefined;
	planeModel: string | undefined;
	planeRegistration: string | undefined;
	engineType: EngineType;
	singlePilotTimeSingleEngine: string | undefined;
	singlePilotTimeMultiEngine: string | undefined;
	multiPilotTime: string | undefined;
	totalFlightTime: string | undefined;
	pilotInCommand: string | undefined;
	takeoffsDay: string | undefined;
	takeoffsNight: string | undefined;
	landingsDay: string | undefined;
	landingsNight: string | undefined;
	operationalConditionTimeNight: string | undefined;
	operationalConditionTimeIfr: string | undefined;
	functionTimePilotInCommand: string | undefined;
	functionTimeCoPilot: string | undefined;
	functionTimeDual: string | undefined;
	functionTimeInstructor: string | undefined;
	remarks: string | undefined;
}

export interface LogFormProps {
	defaultValues?: DefaultValues<LogFormFieldValues>;
	header: string;
	submitLabel: string;
}
const o = [
	{ label: "EPRZ", value: "EPRZ" },
	{ label: "WAW", value: "WAW" },
];

const engineOptions = [
	{ label: "Single", value: "single" },
	{ label: "Multi", value: "multi" },
] satisfies RadioFieldOption[];

export const LogForm: FC<LogFormProps> = ({
	defaultValues,
	header,
	submitLabel,
}) => {
	const methods = useForm<LogFormFieldValues>({
		defaultValues,
		resolver: zodResolver(logFormSchema),
	});

	const [planeModel, engineType, departureTime, arrivalTime] = methods.watch([
		"planeModel",
		"engineType",
		"departureTime",
		"arrivalTime",
	]);

	const flightDuration = useMemo(() => {
		if (!departureTime || !arrivalTime) {
			return null;
		}

		return calculateFlightTime(departureTime, arrivalTime);
	}, [departureTime, arrivalTime]);

	const onSubmit = (data: LogFormFieldValues) => console.log(data);

	const fillProps = useMemo(
		() =>
			({
				fillable: true,
				fillValue: flightDuration
					? parseTime(formatMinutes(flightDuration)).toString()
					: undefined,
			}) satisfies Pick<
				TimeFieldProps<LogFormFieldValues>,
				"fillable" | "fillValue"
			>,
		[flightDuration],
	);

	return (
		<FormProvider {...methods}>
			<form
				className="grid grid-cols-4 gap-2 p-2 max-w-5xl mx-auto"
				onSubmit={methods.handleSubmit(onSubmit)}
			>
				<h1 className="text-xl text-center col-span-4">{header}</h1>
				<DateField<LogFormFieldValues>
					className="col-span-4"
					name="date"
					label="Date"
					isRequired
				/>
				<SelectField<LogFormFieldValues>
					className="col-span-2 md:col-span-1"
					name="departurePlace"
					label="Departure Place"
					items={o}
					isRequired
				/>
				<TimeField<LogFormFieldValues>
					className="col-span-2 md:col-span-1"
					name="departureTime"
					label="Departure Time"
					isRequired
				/>
				<SelectField<LogFormFieldValues>
					className="col-span-2 md:col-span-1"
					name="arrivalPlace"
					label="Arrival Place"
					items={o}
					isRequired
				/>
				<TimeField<LogFormFieldValues>
					className="col-span-2 md:col-span-1"
					name="arrivalTime"
					label="Arrival Time"
					isRequired
				/>
				<Divider className="col-span-4" />
				<h2 className="col-span-4 text-sm text-center">Plane</h2>
				<SelectField<LogFormFieldValues>
					className="col-span-2"
					name="planeModel"
					label="Model"
					items={[]}
					isRequired
				/>
				<SelectField<LogFormFieldValues>
					className="col-span-2"
					name="planeRegistration"
					label="Registration"
					items={[]}
					isDisabled={!planeModel}
					isRequired
				/>
				<Divider className="col-span-4" />
				<h2 className="col-span-4 text-sm text-center">Pilot time</h2>
				<FlightDuration className="col-span-4" duration={flightDuration} />
				<TimeField<LogFormFieldValues>
					className="col-span-2"
					name="totalFlightTime"
					label="Total Time Of Flight"
					isRequired
					{...fillProps}
				/>
				<SelectField<LogFormFieldValues>
					className="col-span-2"
					name="pilotInCommand"
					label="Pilot In Command"
					items={[]}
					isRequired
					{...fillProps}
				/>
				<RadioField<LogFormFieldValues>
					className="col-span-4 md:col-span-2"
					label="Engine type"
					name="engineType"
					orientation="horizontal"
					options={engineOptions}
				/>
				{engineType === "single" && (
					<>
						<TimeField<LogFormFieldValues>
							className="col-span-2 md:col-span-1"
							name="singlePilotTimeSingleEngine"
							label="Single Engine Time"
							{...fillProps}
						/>
						<TimeField<LogFormFieldValues>
							className="col-span-2 md:col-span-1"
							name="singlePilotTimeMultiEngine"
							label="Multi Engine Time"
							{...fillProps}
						/>
					</>
				)}
				{engineType === "multi" && (
					<TimeField<LogFormFieldValues>
						className="col-span-4 md:col-span-2"
						name="multiPilotTime"
						label="Multi Pilot Time"
						isRequired
						{...fillProps}
					/>
				)}
				<Divider className="col-span-4" />
				<h2 className="col-span-4 text-sm text-center">Takeoffs & Landings</h2>
				<InputField<LogFormFieldValues>
					name="takeoffsDay"
					label="Takeoffs Day"
					type="number"
				/>
				<InputField<LogFormFieldValues>
					name="takeoffsNight"
					label="Takeoffs Night"
					type="number"
				/>
				<InputField<LogFormFieldValues>
					name="landingsDay"
					label="Landings Day"
					type="number"
				/>
				<InputField<LogFormFieldValues>
					name="landingsNight"
					label="Landings Night"
					type="number"
				/>
				<Divider className="col-span-4" />
				<h2 className="col-span-4 text-sm text-center">
					Operational condition time
				</h2>
				<TimeField<LogFormFieldValues>
					className="col-span-2"
					name="operationalConditionTimeNight"
					label="Night"
					{...fillProps}
				/>
				<TimeField<LogFormFieldValues>
					className="col-span-2"
					name="operationalConditionTimeIfr"
					label="IFR"
					{...fillProps}
				/>
				<Divider className="col-span-4" />
				<h2 className="col-span-4 text-sm text-center">Function time</h2>
				<TimeField<LogFormFieldValues>
					className="col-span-2 md:col-span-1"
					name="functionTimePilotInCommand"
					label="Pilot In Command"
					{...fillProps}
				/>
				<TimeField<LogFormFieldValues>
					className="col-span-2 md:col-span-1"
					name="functionTimeCoPilot"
					label="Co-Pilot"
					{...fillProps}
				/>
				<TimeField<LogFormFieldValues>
					className="col-span-2 md:col-span-1"
					name="functionTimeDual"
					label="Dual"
					{...fillProps}
				/>
				<TimeField<LogFormFieldValues>
					className="col-span-2 md:col-span-1"
					name="functionTimeInstructor"
					label="Instructor"
					{...fillProps}
				/>
				<TextAreaField<LogFormFieldValues>
					className="col-span-4"
					name="remarks"
					label="Remarks"
					minRows={1}
				/>
				<Button className="col-span-4 mt-2" type="submit" color="primary">
					{submitLabel}
				</Button>
			</form>
		</FormProvider>
	);
};
