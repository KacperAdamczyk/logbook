import { Navigation } from "@/components/Navigation";
import { Providers } from "@/components/Providers";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
	title: "Logbook",
	description: "App that stores your logs",
};

export default function RootLayout({
	children,
	modal,
}: Readonly<{
	children: ReactNode;
	modal: ReactNode;
}>) {
	return (
		<Providers>
			<Navigation />
			<main className="max-w-7xl mx-auto p-2">{children}</main>
			{modal}
		</Providers>
	);
}
