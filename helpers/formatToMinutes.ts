export const formatToMinutes = (time: string): number => {
	const [hours, minutes] = time.split(":").map(Number);

	return hours * 60 + minutes;
};
