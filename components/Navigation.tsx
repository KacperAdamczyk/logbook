import { auth } from "@/lib/auth";
import { Button } from "@heroui/button";
import {
	Navbar,
	NavbarBrand,
	NavbarContent,
	NavbarItem,
	NavbarMenu,
	NavbarMenuItem,
	NavbarMenuToggle,
} from "@heroui/navbar";
import { User } from "@heroui/user";
import { headers } from "next/headers";

import Link from "next/link";

const links = [
	{ name: "Logs", href: "/" },
	{ name: "Search", href: "/" },
	{ name: "Aircraft", href: "/" },
	{ name: "Places", href: "/" },
] as const;

export async function Navigation() {
	const session = await auth.api.getSession({ headers: await headers() });
	const userName = session?.user.name;
	return (
		<Navbar maxWidth="xl">
			<NavbarContent>
				<NavbarMenuToggle className="sm:hidden" />
				<NavbarBrand>
					<Link href="/" className="font-bold text-inherit">
						Logbook
					</Link>
				</NavbarBrand>
			</NavbarContent>
			<NavbarContent justify="center" className="hidden sm:flex gap-4">
				{links.map(({ name, href }) => (
					<NavbarItem key={name}>
						<Link color="foreground" href={href}>
							{name}
						</Link>
					</NavbarItem>
				))}
			</NavbarContent>
			<NavbarContent justify="end">
				<User
					className="hidden lg:flex"
					name={userName}
					avatarProps={{ name: userName, isBordered: true }}
				/>
				<NavbarItem>
					<form
						action={async () => {
							"use server";
							await auth.api.signOut({ headers: await headers() });
						}}
					>
						<Button type="submit" color="primary" variant="flat">
							Log Out
						</Button>
					</form>
				</NavbarItem>
			</NavbarContent>
			<NavbarMenu>
				{links.map((item) => (
					<NavbarMenuItem key={item.name}>
						<Link className="w-full" href={item.href} color="foreground">
							NavbarMenuItem {item.name}
						</Link>
					</NavbarMenuItem>
				))}
			</NavbarMenu>
		</Navbar>
	);
}
