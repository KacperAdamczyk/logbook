import { z } from "zod";

export interface LogsListFilters {
	dateFrom?: string;
	dateTo?: string;
	departurePlaceId?: string;
	arrivalPlaceId?: string;
	pilotInCommandId?: string;
	aircraftId?: string;
}

const isoDateSchema = z.iso.date();

const FILTER_PARAM_MAP = {
	dateFrom: "from",
	dateTo: "to",
	departurePlaceId: "departure",
	arrivalPlaceId: "arrival",
	pilotInCommandId: "pic",
	aircraftId: "aircraft",
} as const satisfies Record<keyof LogsListFilters, string>;

function isValidIsoDate(value: string): boolean {
	return isoDateSchema.safeParse(value).success;
}

function normalizeOptionalString(value: string | null): string | undefined {
	const normalized = value?.trim();

	if (!normalized) {
		return undefined;
	}

	return normalized;
}

function normalizeOptionalDate(value: string | null): string | undefined {
	const normalized = normalizeOptionalString(value);

	if (!normalized || !isValidIsoDate(normalized)) {
		return undefined;
	}

	return normalized;
}

export function parseLogsFiltersSearchParams(searchParams: URLSearchParams): LogsListFilters {
	return {
		dateFrom: normalizeOptionalDate(searchParams.get(FILTER_PARAM_MAP.dateFrom)),
		dateTo: normalizeOptionalDate(searchParams.get(FILTER_PARAM_MAP.dateTo)),
		departurePlaceId: normalizeOptionalString(searchParams.get(FILTER_PARAM_MAP.departurePlaceId)),
		arrivalPlaceId: normalizeOptionalString(searchParams.get(FILTER_PARAM_MAP.arrivalPlaceId)),
		pilotInCommandId: normalizeOptionalString(searchParams.get(FILTER_PARAM_MAP.pilotInCommandId)),
		aircraftId: normalizeOptionalString(searchParams.get(FILTER_PARAM_MAP.aircraftId)),
	};
}

export function normalizeLogsListFilters(filters: LogsListFilters): LogsListFilters {
	return {
		dateFrom: filters.dateFrom && isValidIsoDate(filters.dateFrom) ? filters.dateFrom : undefined,
		dateTo: filters.dateTo && isValidIsoDate(filters.dateTo) ? filters.dateTo : undefined,
		departurePlaceId: normalizeOptionalString(filters.departurePlaceId ?? null),
		arrivalPlaceId: normalizeOptionalString(filters.arrivalPlaceId ?? null),
		pilotInCommandId: normalizeOptionalString(filters.pilotInCommandId ?? null),
		aircraftId: normalizeOptionalString(filters.aircraftId ?? null),
	};
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
