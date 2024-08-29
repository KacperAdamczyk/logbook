import { formatMinutes } from "@/helpers/formatMinutes";
import { Input } from "@nextui-org/react";
import { FC } from "react";

interface Props {
	duration: number | null;
	className?: string;
}

export const FlightDuration: FC<Props> = ({ className, duration }) => {
	const displayValue = duration !== null ? formatMinutes(duration) : "∞";

	return (
		<Input
			className={className}
			label="Flight Duration"
			value={displayValue}
			isReadOnly
			variant="bordered"
		/>
	);
};
