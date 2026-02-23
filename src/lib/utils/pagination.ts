export interface PaginationRange {
	startIndex: number;
	endIndex: number;
	totalPages: number;
}

export function parsePageSearchParam(value: string | null): number {
	if (!value) {
		return 1;
	}

	const parsed = Number(value);

	if (!Number.isInteger(parsed) || parsed < 1) {
		return 1;
	}

	return parsed;
}

export function getPaginationRange(params: {
	currentPage: number;
	pageSize: number;
	totalCount: number;
	itemCount: number;
}): PaginationRange {
	const { currentPage, pageSize, totalCount, itemCount } = params;
	const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

	if (itemCount === 0) {
		return {
			startIndex: 0,
			endIndex: 0,
			totalPages,
		};
	}

	const startIndex = (currentPage - 1) * pageSize + 1;

	return {
		startIndex,
		endIndex: Math.min(startIndex + itemCount - 1, totalCount),
		totalPages,
	};
}

export function buildPageHref(url: URL, nextPage: number, paramName = "page"): string {
	const nextUrl = new URL(url);

	if (nextPage <= 1) {
		nextUrl.searchParams.delete(paramName);
	} else {
		nextUrl.searchParams.set(paramName, String(nextPage));
	}

	return `${nextUrl.pathname}${nextUrl.search}${nextUrl.hash}`;
}
