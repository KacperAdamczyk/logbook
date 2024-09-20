import { CreateLog } from "@/components/CreateLog";

export default function CreateLogPage() {
	return (
		<section>
			<h1 className="text-xl text-center mb-2">Create New Log</h1>
			<CreateLog onSuccessRedirect="/" />;
		</section>
	);
}
