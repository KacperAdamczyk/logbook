"use client";
import { createLogAction } from "@/actions/createLog";
import { updateLogAction } from "@/actions/updateLog";
import {
	logFormSchema,
	logFormSchemaV,
} from "@/actions/validation/logFormSchema";
import { FlightDuration } from "@/components/FlightDuration";
import type { RadioFieldOption } from "@/form/fields/RadioField";
import type { SelectFieldItem } from "@/form/fields/SelectField";
import type { TimeFieldProps } from "@/form/fields/TimeField";
import type { Aircraft, Pilot, Place } from "@/db/schema";
import { useAppForm } from "@/form";
import { actionToast } from "@/helpers/actionToast";
import { calculateFlightTime } from "@/helpers/calculateFlightTime";
import { minutesToTime } from "@/helpers/minutesToTime";
import type { TimeValue } from "@/types/TimeValue";
import { Divider } from "@heroui/divider";
import { useHookFormActionErrorMapper } from "@next-safe-action/adapter-react-hook-form/hooks";
import { useStore } from "@tanstack/react-form";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import { type FC, useMemo } from "react";
import { toast } from "sonner";

export type EngineType = "single" | "multi";
export interface LogFormFieldValues {
	date: Date | null;
	departurePlace: string | null;
	departureTime: TimeValue | null;
	arrivalPlace: string | null;
	arrivalTime: TimeValue | null;
	planeModel: string | null;
	planeRegistration: string | null;
	engineType: EngineType;
	singlePilotTimeSingleEngine: TimeValue | null;
	singlePilotTimeMultiEngine: TimeValue | null;
	multiPilotTime: TimeValue | null;
	totalFlightTime: TimeValue | null;
	pilotInCommand: string | null;
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
	initialValues: LogFormFieldValues;
	submitLabel: string;
	logId?: string;
	aircraft: Aircraft[];
	pilots: Pilot[];
	places: Place[];
	onSuccessToast?: string;
	onSuccessRedirect?: string;
}

const engineOptions = [
	{ label: "Single", value: "single" },
	{ label: "Multi", value: "multi" },
] satisfies RadioFieldOption<EngineType>[];

export const LogForm: FC<LogFormProps> = ({
	initialValues,
	submitLabel,
	logId,
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

	const action = logId
		? updateLogAction.bind(null, logId)
		: createLogAction.bind(null, null);
	const {
		executeAsync,
		isPending,
		result: { validationErrors },
	} = useAction(action, {
		...toasts,
		onSuccess: ({ data }) => {
			toasts.onSuccess({ data });

			const updatedTimesCount = data?.recalculatedLogsCount ?? 0;

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
	});
	const { hookFormValidationErrors } =
		useHookFormActionErrorMapper(validationErrors);

	const form = useAppForm({
		onSubmit: ({ value }) => {
			console.log("onSubmit", value);
		},
		defaultValues: initialValues,
		validators: { onChange: logFormSchemaV },
	});

	const planeModel = useStore(form.store, (state) => state.values.planeModel);
	const engineType = useStore(form.store, (state) => state.values.engineType);
	const departureTime = useStore(
		form.store,
		(state) => state.values.departureTime,
	);
	const arrivalTime = useStore(form.store, (state) => state.values.arrivalTime);

	const flightDuration = useMemo(() => {
		if (!departureTime || !arrivalTime) {
			return undefined;
		}

		return minutesToTime(calculateFlightTime(departureTime, arrivalTime));
	}, [departureTime, arrivalTime]);

	const fillProps = useMemo(
		() =>
			({
				fillable: true,
				fillValue: flightDuration,
			}) satisfies Pick<TimeFieldProps, "fillable" | "fillValue">,
		[flightDuration],
	);

	const aircraftModelItems = useMemo(() => {
		const aircraftMap = new Map(
			aircraft.map(({ model }) => [
				model,
				{ label: model, value: model } satisfies SelectFieldItem,
			]),
		);

		return aircraftMap.values().toArray();
	}, [aircraft]);

	const aircraftRegistrationItems = useMemo(
		() =>
			aircraft
				.filter((aircraft) => aircraft.model === planeModel)
				.map(
					({ registration }) =>
						({
							label: registration,
							value: registration,
						}) satisfies SelectFieldItem,
				),
		[aircraft, planeModel],
	);

	const placesItems = useMemo(
		() =>
			places.map(
				({ name }) =>
					({
						label: name,
						value: name,
					}) satisfies SelectFieldItem,
			),
		[places],
	);

	const pilotsItems = useMemo(
		() =>
			pilots.map(
				({ name }) =>
					({
						label: name,
						value: name,
					}) satisfies SelectFieldItem,
			),
		[pilots],
	);

	return (
		<form
			className="grid grid-cols-4 gap-2 max-w-5xl mx-auto"
			onSubmit={(event) => {
				event.preventDefault();
				event.stopPropagation();

				return form.handleSubmit();
			}}
		>
			<form.AppForm>
				<form.AppField name="date">
					{(field) => (
						<field.DateField className="col-span-4" label="Date" isRequired />
					)}
				</form.AppField>
				<form.AppField name="departurePlace">
					{(field) => (
						<field.SelectField
							className="col-span-2 md:col-span-1"
							label="Departure Place"
							items={placesItems}
							isRequired
						/>
					)}
				</form.AppField>
				<form.AppField name="departureTime">
					{(field) => (
						<field.TimeField
							className="col-span-2 md:col-span-1"
							label="Departure Time"
							isRequired
						/>
					)}
				</form.AppField>
				<form.AppField name="arrivalPlace">
					{(field) => (
						<field.SelectField
							className="col-span-2 md:col-span-1"
							label="Arrival Place"
							items={placesItems}
							isRequired
						/>
					)}
				</form.AppField>
				<form.AppField name="arrivalTime">
					{(field) => (
						<field.TimeField
							className="col-span-2 md:col-span-1"
							label="Arrival Time"
							isRequired
						/>
					)}
				</form.AppField>
				<Divider className="col-span-4" />
				<h2 className="col-span-4 text-sm text-center">Plane</h2>
				<form.AppField name="planeModel">
					{(field) => (
						<field.SelectField
							className="col-span-2"
							label="Model"
							items={aircraftModelItems}
							isRequired
						/>
					)}
				</form.AppField>
				<form.AppField name="planeRegistration">
					{(field) => (
						<field.SelectField
							className="col-span-2"
							label="Registration"
							items={aircraftRegistrationItems}
							isDisabled={!planeModel}
							isRequired
						/>
					)}
				</form.AppField>
				<Divider className="col-span-4" />
				<h2 className="col-span-4 text-sm text-center">Pilot Time</h2>
				<FlightDuration className="col-span-4" duration={flightDuration} />
				<form.AppField name="totalFlightTime">
					{(field) => (
						<field.TimeField
							className="col-span-2"
							label="Total Time Of Flight"
							isRequired
							{...fillProps}
						/>
					)}
				</form.AppField>
				<form.AppField name="pilotInCommand">
					{(field) => (
						<field.SelectField
							className="col-span-2"
							label="Pilot In Command"
							items={pilotsItems}
							isRequired
							{...fillProps}
						/>
					)}
				</form.AppField>
				<form.AppField name="engineType">
					{(field) => (
						<field.RadioField
							className="col-span-4 md:col-span-2"
							label="Engine Type"
							options={engineOptions}
						/>
					)}
				</form.AppField>
				{engineType === "single" && (
					<>
						<form.AppField name="singlePilotTimeSingleEngine">
							{(field) => (
								<field.TimeField
									className="col-span-2 md:col-span-1"
									label="Single Engine Time"
									isRequired
									{...fillProps}
								/>
							)}
						</form.AppField>
						<form.AppField name="singlePilotTimeMultiEngine">
							{(field) => (
								<field.TimeField
									className="col-span-2 md:col-span-1"
									label="Multi Engine Time"
									isRequired
									{...fillProps}
								/>
							)}
						</form.AppField>
					</>
				)}
				{engineType === "multi" && (
					<form.AppField name="multiPilotTime">
						{(field) => (
							<field.TimeField
								className="col-span-4 md:col-span-2"
								label="Multi Pilot Time"
								isRequired
								{...fillProps}
							/>
						)}
					</form.AppField>
				)}
				<Divider className="col-span-4" />
				<h2 className="col-span-4 text-sm text-center">Takeoffs & Landings</h2>
				<form.AppField name="takeoffsDay">
					{(field) => (
						<field.NumberField
							className="col-span-2"
							label="Takeoffs Day"
							isRequired
						/>
					)}
				</form.AppField>
				<form.AppField name="takeoffsNight">
					{(field) => (
						<field.NumberField
							className="col-span-2"
							label="Takeoffs Night"
							isRequired
						/>
					)}
				</form.AppField>
				<form.AppField name="landingsDay">
					{(field) => (
						<field.NumberField
							className="col-span-2"
							label="Landings Day"
							isRequired
						/>
					)}
				</form.AppField>
				<form.AppField name="landingsNight">
					{(field) => (
						<field.NumberField
							className="col-span-2"
							label="Landings Night"
							isRequired
						/>
					)}
				</form.AppField>
				<Divider className="col-span-4" />
				<h2 className="col-span-4 text-sm text-center">
					Operational Condition Time
				</h2>
				<form.AppField name="operationalConditionTimeNight">
					{(field) => (
						<field.TimeField
							className="col-span-2"
							label="Night"
							{...fillProps}
						/>
					)}
				</form.AppField>
				<form.AppField name="operationalConditionTimeIfr">
					{(field) => (
						<field.TimeField
							className="col-span-2"
							label="IFR"
							{...fillProps}
						/>
					)}
				</form.AppField>
				<Divider className="col-span-4" />
				<h2 className="col-span-4 text-sm text-center">Function Time</h2>
				<form.AppField name="functionTimePilotInCommand">
					{(field) => (
						<field.TimeField
							className="col-span-2 md:col-span-1"
							label="Pilot In Command"
							{...fillProps}
						/>
					)}
				</form.AppField>
				<form.AppField name="functionTimeCoPilot">
					{(field) => (
						<field.TimeField
							className="col-span-2 md:col-span-1"
							label="Co-Pilot"
							{...fillProps}
						/>
					)}
				</form.AppField>
				<form.AppField name="functionTimeDual">
					{(field) => (
						<field.TimeField
							className="col-span-2 md:col-span-1"
							label="Dual"
							{...fillProps}
						/>
					)}
				</form.AppField>
				<form.AppField name="functionTimeInstructor">
					{(field) => (
						<field.TimeField
							className="col-span-2 md:col-span-1"
							label="Instructor"
							{...fillProps}
						/>
					)}
				</form.AppField>
				<form.AppField name="remarks">
					{(field) => (
						<field.TextAreaField
							className="col-span-4"
							label="Remarks"
							minRows={2}
						/>
					)}
				</form.AppField>
				<form.SubmitButton className="col-span-4 mt-2">
					{submitLabel}
				</form.SubmitButton>
			</form.AppForm>
		</form>
	);
};
