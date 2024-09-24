import type { TimeValue } from "@/types/TimeValue";
import { Time } from "@internationalized/date";
import { TimeInput } from "@nextui-org/react";
import { IconClockHour1 } from "@tabler/icons-react";
import type { FC } from "react";

interface Props {
	duration: TimeValue | null;
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
