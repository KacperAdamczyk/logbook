import { formatMinutes } from "@/helpers/formatMinutes";
import { parseTime } from "@internationalized/date";
import { Input, TimeInput } from "@nextui-org/react";
import { IconClockHour1 } from "@tabler/icons-react";
import { FC } from "react";

interface Props {
	duration: number | null;
	className?: string;
}

export const FlightDuration: FC<Props> = ({ className, duration }) => {
	const displayValue = duration ? parseTime(formatMinutes(duration)) : null;

	return (
		<TimeInput
			className={className}
			label="Flight Duration"
			value={displayValue}
			isReadOnly
			variant="bordered"
			hourCycle={24}
			startContent={<IconClockHour1 size={20} />}
		/>
	);
};
