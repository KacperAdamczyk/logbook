import { InterceptModal } from "@/components/InterceptModal";
import { LogDetails } from "@/components/LogDetails";

interface Props {
	params: {
		logId: string;
	};
}

export default function LogPage({ params: { logId } }: Props) {
	return (
		<InterceptModal size="5xl">
			<section>
				<h1 className="text-xl text-center mb-2">Log</h1>
				<LogDetails logId={logId} />
			</section>
		</InterceptModal>
	);
}
