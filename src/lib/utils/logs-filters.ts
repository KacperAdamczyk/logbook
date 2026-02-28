import { z } from "zod";

export interface LogsListFilters {
	dateFrom?: string;
	dateTo?: string;
	departurePlaceId?: string;
	arrivalPlaceId?: string;
	pilotInCommandId?: string;
	aircraftId?: string;
}

const FILTER_PARAM_MAP = {
	dateFrom: "from",
	dateTo: "to",
	departurePlaceId: "departure",
	arrivalPlaceId: "arrival",
	pilotInCommandId: "pic",
	aircraftId: "aircraft",
} as const satisfies Record<keyof LogsListFilters, string>;

function preprocessOptionalTrimmedString(value: unknown): string | undefined {
	if (typeof value !== "string") {
		return undefined;
	}

	const normalized = value.trim();

	return normalized || undefined;
}

const optionalFilterStringSchema = z
	.preprocess(preprocessOptionalTrimmedString, z.string().min(1).optional())
	.catch(undefined);
const optionalFilterDateSchema = z
	.preprocess(preprocessOptionalTrimmedString, z.iso.date().optional())
	.catch(undefined);

const logsListFiltersSchema = z.object({
	dateFrom: optionalFilterDateSchema,
	dateTo: optionalFilterDateSchema,
	departurePlaceId: optionalFilterStringSchema,
	arrivalPlaceId: optionalFilterStringSchema,
	pilotInCommandId: optionalFilterStringSchema,
	aircraftId: optionalFilterStringSchema,
});

export function parseLogsFiltersSearchParams(searchParams: URLSearchParams): LogsListFilters {
	return logsListFiltersSchema.parse({
		dateFrom: searchParams.get(FILTER_PARAM_MAP.dateFrom),
		dateTo: searchParams.get(FILTER_PARAM_MAP.dateTo),
		departurePlaceId: searchParams.get(FILTER_PARAM_MAP.departurePlaceId),
		arrivalPlaceId: searchParams.get(FILTER_PARAM_MAP.arrivalPlaceId),
		pilotInCommandId: searchParams.get(FILTER_PARAM_MAP.pilotInCommandId),
		aircraftId: searchParams.get(FILTER_PARAM_MAP.aircraftId),
	});
}

export function normalizeLogsListFilters(filters: LogsListFilters): LogsListFilters {
	return logsListFiltersSchema.parse(filters);
}

export function hasActiveLogsFilters(filters: LogsListFilters): boolean {
	const normalized = normalizeLogsListFilters(filters);

	return Object.values(normalized).some((value) => value !== undefined);
}

export function buildLogsFiltersHref(
	url: URL,
	filters: LogsListFilters,
	options?: { resetPage?: boolean },
): string {
	const normalized = normalizeLogsListFilters(filters);
	const nextUrl = new URL(url);
	const resetPage = options?.resetPage ?? true;

	for (const [filterKey, paramName] of Object.entries(FILTER_PARAM_MAP) as Array<
		[keyof LogsListFilters, string]
	>) {
		const value = normalized[filterKey];

		if (value === undefined) {
			nextUrl.searchParams.delete(paramName);
			continue;
		}

		nextUrl.searchParams.set(paramName, value);
	}

	if (resetPage) {
		nextUrl.searchParams.delete("page");
	}

	return `${nextUrl.pathname}${nextUrl.search}${nextUrl.hash}`;
}
