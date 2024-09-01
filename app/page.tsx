import { type DropdownLink, LinkDropdown } from "@/components/LinkDropdown";
import { LogsList } from "@/components/LogsList";

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
			<div className="flex justify-end mb-4">
				<LinkDropdown
					mainButtonText="New Log"
					mainButtonHref="/create"
					dropdownLinks={links}
					color="success"
				/>
			</div>
			<LogsList />
		</section>
	);
}
