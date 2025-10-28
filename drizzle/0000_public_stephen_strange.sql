CREATE TABLE `aircraft` (
	`id` text PRIMARY KEY NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	`userId` text NOT NULL,
	`model` text NOT NULL,
	`registration` text NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `account` (
	`id` text PRIMARY KEY NOT NULL,
	`account_id` text NOT NULL,
	`provider_id` text NOT NULL,
	`user_id` text NOT NULL,
	`access_token` text,
	`refresh_token` text,
	`id_token` text,
	`access_token_expires_at` integer,
	`refresh_token_expires_at` integer,
	`scope` text,
	`password` text,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `session` (
	`id` text PRIMARY KEY NOT NULL,
	`expires_at` integer NOT NULL,
	`token` text NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer NOT NULL,
	`ip_address` text,
	`user_agent` text,
	`user_id` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `session_token_unique` ON `session` (`token`);--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`email_verified` integer DEFAULT false NOT NULL,
	`image` text,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
CREATE TABLE `verification` (
	`id` text PRIMARY KEY NOT NULL,
	`identifier` text NOT NULL,
	`value` text NOT NULL,
	`expires_at` integer NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `flight_log` (
	`id` text PRIMARY KEY NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	`userId` text NOT NULL,
	`departureAt` integer NOT NULL,
	`arrivalAt` integer NOT NULL,
	`departurePlaceId` text NOT NULL,
	`arrivalPlaceId` text NOT NULL,
	`aircraftId` text NOT NULL,
	`pilotInCommandId` text NOT NULL,
	`totalFlight` integer DEFAULT 0 NOT NULL,
	`singlePilotSingleEngine` integer DEFAULT 0 NOT NULL,
	`singlePilotMultiEngine` integer DEFAULT 0 NOT NULL,
	`multiPilot` integer DEFAULT 0 NOT NULL,
	`operationalConditionNight` integer DEFAULT 0 NOT NULL,
	`operationalConditionIfr` integer DEFAULT 0 NOT NULL,
	`functionPilotInCommand` integer DEFAULT 0 NOT NULL,
	`functionCoPilot` integer DEFAULT 0 NOT NULL,
	`functionDual` integer DEFAULT 0 NOT NULL,
	`functionInstructor` integer DEFAULT 0 NOT NULL,
	`takeoffsDay` integer,
	`takeoffsNight` integer,
	`landingsDay` integer,
	`landingsNight` integer,
	`remarks` text,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`departurePlaceId`) REFERENCES `place`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`arrivalPlaceId`) REFERENCES `place`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`aircraftId`) REFERENCES `aircraft`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`pilotInCommandId`) REFERENCES `pilot`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `pilot` (
	`id` text PRIMARY KEY NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	`userId` text NOT NULL,
	`name` text NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `place` (
	`id` text PRIMARY KEY NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	`userId` text NOT NULL,
	`name` text NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `simulator_log` (
	`id` text PRIMARY KEY NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	`userId` text NOT NULL,
	`date` integer NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE VIEW `log_view` AS select "id" from "flight_log" union all select "id" from "simulator_log";