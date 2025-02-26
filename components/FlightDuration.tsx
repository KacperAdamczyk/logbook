import type { TimeValue } from "@/types/TimeValue";
import { TimeInput } from "@heroui/date-input";
import { Time } from "@internationalized/date";
import { IconClockHour1 } from "@tabler/icons-react";
import type { FC } from "react";

interface Props {
	duration: TimeValue | undefined;
	className?: string;
}

export const FlightDuration: FC<Props> = ({ className, duration }) => {
	const displayValue = duration
		? new Time(duration.hour, duration.minute)
		: null;

	return (
		<TimeInput
			className={className}
			label="Flight Duration"
			value={displayValue}
			isReadOnly
			variant="bordered"
			hourCycle={24}
			startContent={<IconClockHour1 size={20} />}
			tabIndex={-1}
		/>
	);
};
