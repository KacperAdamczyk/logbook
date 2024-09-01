import { LogDetails } from "@/components/LogDetails";
import { Modal } from "@nextui-org/modal";

interface Props {
	params: {
		logId: string;
	};
}

export default function LogPage({ params: { logId } }: Props) {
	console.log("Intercepted route");
	return (
		<Modal>
			<section>
				<h1 className="text-xl text-center mb-2">Log</h1>
				<LogDetails logId={logId} />
			</section>
		</Modal>
	);
}
