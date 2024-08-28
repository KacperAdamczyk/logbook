import { formatMinutes } from "@/helpers/formatMinutes";
import { useFlightDuration } from "@/hooks/useFlightDuration";
import { Input } from "@nextui-org/react";
import { FC } from "react";

export const FlightDuration: FC = () => {
	const duration = useFlightDuration();

	const displayValue = duration ? formatMinutes(duration) : "-";

	return (
		<Input
			label="Flight Duration"
			value={displayValue}
			isReadOnly
			variant="bordered"
		/>
	);
};
