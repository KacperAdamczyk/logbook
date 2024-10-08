import { Navigation } from "@/components/Navigation";
import { Providers } from "@/components/Providers";
import { cn } from "@nextui-org/react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import type { ReactNode } from "react";
import { Toaster } from "sonner";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

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
		<html lang="en" className="dark">
			<body className={cn("min-h-screen bg-background", inter.className)}>
				<Providers>
					<Navigation />
					<main className="max-w-7xl mx-auto p-2">{children}</main>
					<Toaster position="top-center" richColors expand />
					{modal}
				</Providers>
			</body>
		</html>
	);
}
