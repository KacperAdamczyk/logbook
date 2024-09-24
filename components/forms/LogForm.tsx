"use client";
import { createLogAction } from "@/actions/createLog";
import { logFormSchema } from "@/actions/validation/logFormSchema";
import { FlightDuration } from "@/components/FlightDuration";
import { DateField } from "@/components/fields/DateField";
import { NumberField } from "@/components/fields/NumberField";
import { RadioField, RadioFieldOption } from "@/components/fields/RadioField";
import {
	SelectField,
	type SelectFieldItem,
} from "@/components/fields/SelectField";
import { TextAreaField } from "@/components/fields/TextAreaField";
import { TimeField, TimeFieldProps } from "@/components/fields/TimeField";
import type { Aircraft, Pilot, Place } from "@/db/schema";
import { actionToast } from "@/helpers/actionToast";
import { calculateFlightTime } from "@/helpers/calculateFlightTime";
import { formatMinutes } from "@/helpers/formatMinutes";
import { zodResolver } from "@hookform/resolvers/zod";
import { parseTime, type Time } from "@internationalized/date";
import { useHookFormAction } from "@next-safe-action/adapter-react-hook-form/hooks";
import { Button, Divider } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { FC, useMemo } from "react";
import { DefaultValues, FormProvider } from "react-hook-form";
import { toast } from "sonner";
import { DevTool } from "@hookform/devtools";
import { minutesToTime } from "@/helpers/minutesToTime";
import type { TimeValue } from "@/types/TimeValue";

export type EngineType = "single" | "multi";
export interface LogFormFieldValues {
	date: Date | null;
	departurePlace: string;
	departureTime: TimeValue | null;
	arrivalPlace: string;
	arrivalTime: TimeValue | null;
	planeModel: string;
	planeRegistration: string;
	engineType: EngineType;
	singlePilotTimeSingleEngine: TimeValue | null;
	singlePilotTimeMultiEngine: TimeValue | null;
	multiPilotTime: TimeValue | null;
	totalFlightTime: TimeValue | null;
	pilotInCommand: string;
	takeoffsDay: number;
	takeoffsNight: number;
	landingsDay: number;
	landingsNight: number;
	operationalConditionTimeNight: TimeValue | null;
	operationalConditionTimeIfr: TimeValue | null;
	functionTimePilotInCommand: TimeValue | null;
	functionTimeCoPilot: TimeValue | null;
	functionTimeDual: TimeValue | null;
	functionTimeInstructor: TimeValue | null;
	remarks: string;
}

export interface LogFormProps {
	defaultValues: LogFormFieldValues;
	submitLabel: string;
	action: "create" | "edit";
	aircraft: Aircraft[];
	pilots: Pilot[];
	places: Place[];
	onSuccessToast?: string;
	onSuccessRedirect?: string;
}

const engineOptions = [
	{ label: "Single", value: "single" },
	{ label: "Multi", value: "multi" },
] satisfies RadioFieldOption[];

const actionMap = {
	create: createLogAction,
	edit: createLogAction,
} as const;

export const LogForm: FC<LogFormProps> = ({
	defaultValues,
	submitLabel,
	action,
	aircraft,
	pilots,
	places,
	onSuccessToast,
	onSuccessRedirect,
}) => {
	const router = useRouter();
	const toasts = actionToast({
		successMessageFn: () => onSuccessToast,
	});
	const {
		handleSubmitWithAction,
		form,
		action: { isPending },
	} = useHookFormAction(actionMap[action], zodResolver(logFormSchema), {
		formProps: {
			defaultValues,
		},
		actionProps: {
			...toasts,
			onSuccess: ({ data }) => {
				toasts.onSuccess({ data });

				const updatedTimesCount = data?.updatedTimes?.length ?? 0;

				if (updatedTimesCount > 1) {
					toast.info(`Recalculated ${updatedTimesCount - 1} additional logs`);
				}

				if (onSuccessRedirect) {
					if (onSuccessRedirect === "..") {
						router.back();
					} else {
						router.push(onSuccessRedirect);
					}
				}
			},
		},
	});

	console.log(defaultValues);

	const [planeModel, engineType, departureTime, arrivalTime] = form.watch([
		"planeModel",
		"engineType",
		"departureTime",
		"arrivalTime",
	]);

	const flightDuration = useMemo(() => {
		if (!departureTime || !arrivalTime) {
			return null;
		}

		return minutesToTime(calculateFlightTime(departureTime, arrivalTime));
	}, [departureTime, arrivalTime]);

	const fillProps = useMemo(
		() =>
			({
				fillable: true,
				fillValue: flightDuration ?? undefined,
			}) satisfies Pick<
				TimeFieldProps<LogFormFieldValues>,
				"fillable" | "fillValue"
			>,
		[flightDuration],
	);

	const aircraftModelItems = useMemo(() => {
		const aircraftMap = new Map(
			aircraft.map(({ id, model }) => [
				model,
				{ label: model, value: model, key: id } satisfies SelectFieldItem,
			]),
		);

		return Array.from(aircraftMap.values());
	}, [aircraft]);

	const aircraftRegistrationItems = useMemo(
		() =>
			aircraft
				.filter((aircraft) => aircraft.model === planeModel)
				.map(
					({ id, registration }) =>
						({
							label: registration,
							value: registration,
							key: id,
						}) satisfies SelectFieldItem,
				),
		[aircraft, planeModel],
	);

	const placesItems = useMemo(
		() =>
			places.map(
				({ id, name }) =>
					({
						label: name,
						value: name,
						key: id,
					}) satisfies SelectFieldItem,
			),
		[places],
	);

	const pilotsItems = useMemo(
		() =>
			pilots.map(
				({ id, name }) =>
					({
						label: name,
						value: name,
						key: id,
					}) satisfies SelectFieldItem,
			),
		[pilots],
	);

	return (
		<FormProvider {...form}>
			<form
				className="grid grid-cols-4 gap-2 max-w-5xl mx-auto"
				onSubmit={handleSubmitWithAction}
			>
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
					items={placesItems}
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
					items={placesItems}
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
					items={aircraftModelItems}
					isRequired
				/>
				<SelectField<LogFormFieldValues>
					className="col-span-2"
					name="planeRegistration"
					label="Registration"
					items={aircraftRegistrationItems}
					isDisabled={!planeModel}
					isRequired
				/>
				<Divider className="col-span-4" />
				<h2 className="col-span-4 text-sm text-center">Pilot Time</h2>
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
					items={pilotsItems}
					isRequired
					{...fillProps}
				/>
				<RadioField<LogFormFieldValues>
					className="col-span-4 md:col-span-2"
					label="Engine Type"
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
							isRequired
							{...fillProps}
						/>
						<TimeField<LogFormFieldValues>
							className="col-span-2 md:col-span-1"
							name="singlePilotTimeMultiEngine"
							label="Multi Engine Time"
							isRequired
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
				<NumberField<LogFormFieldValues>
					name="takeoffsDay"
					label="Takeoffs Day"
				/>
				<NumberField<LogFormFieldValues>
					name="takeoffsNight"
					label="Takeoffs Night"
				/>
				<NumberField<LogFormFieldValues>
					name="landingsDay"
					label="Landings Day"
				/>
				<NumberField<LogFormFieldValues>
					name="landingsNight"
					label="Landings Night"
				/>
				<Divider className="col-span-4" />
				<h2 className="col-span-4 text-sm text-center">
					Operational Condition Time
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
				<h2 className="col-span-4 text-sm text-center">Function Time</h2>
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
					minRows={2}
				/>
				<Button
					className="col-span-4 mt-2"
					type="submit"
					color="primary"
					isLoading={isPending}
				>
					{submitLabel}
				</Button>
				<DevTool control={form.control} />
			</form>
		</FormProvider>
	);
};
