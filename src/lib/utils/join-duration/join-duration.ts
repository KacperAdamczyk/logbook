export function joinDuration([hours, minutes]: readonly [number, number]): string {
	const hh = hours.toString().padStart(2, "0");
	const mm = minutes.toString().padStart(2, "0");

	return `${hh}${mm}`;
}
