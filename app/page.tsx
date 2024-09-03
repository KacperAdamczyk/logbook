import { type DropdownLink, LinkDropdown } from "@/components/LinkDropdown";
import { LogsList } from "@/components/LogsList";
import { RecalculateLogsButton } from "@/components/RecalculateLogsButton";

const links: DropdownLink[] = [
	{
		text: "New Simulator Log",
		href: "/create/simulator",
	},
];

export default function Home() {
	return (
		<section>
			<h1 className="text-xl text-center mb-2">Logs List</h1>
			<div className="flex justify-end mb-4 gap-2">
				<LinkDropdown
					mainButtonText="New Log"
					mainButtonHref="/create"
					dropdownLinks={links}
					color="success"
				/>
				<RecalculateLogsButton />
			</div>
			<LogsList />
		</section>
	);
}
