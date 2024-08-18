CREATE TABLE `aircraft` (
	`id` text PRIMARY KEY NOT NULL,
	`model` text NOT NULL,
	`registration` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `account` (
	`userId` text NOT NULL,
	`type` text NOT NULL,
	`provider` text NOT NULL,
	`providerAccountId` text NOT NULL,
	`refresh_token` text,
	`access_token` text,
	`expires_at` integer,
	`token_type` text,
	`scope` text,
	`id_token` text,
	`session_state` text,
	PRIMARY KEY(`provider`, `providerAccountId`),
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `allowed_user` (
	`email` text PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE `session` (
	`sessionToken` text PRIMARY KEY NOT NULL,
	`userId` text NOT NULL,
	`expires` integer NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text,
	`email` text,
	`emailVerified` integer,
	`image` text
);
--> statement-breakpoint
CREATE TABLE `log` (
	`id` text PRIMARY KEY NOT NULL,
	`departure_at` integer NOT NULL,
	`arrival_at` integer NOT NULL,
	`departure_place` text NOT NULL,
	`arrival_place` text NOT NULL,
	`aircraft` text NOT NULL,
	`pilot_in_command` text NOT NULL,
	`single_pilot_time_single_engine` integer,
	`single_pilot_time_multi_engine` integer,
	`multi_pilot_time` integer,
	`total_flight_time` integer,
	`takeoffs_day` integer,
	`takeoffs_night` integer,
	`landings_day` integer,
	`landings_night` integer,
	`operational_condition_time_night` integer,
	`operational_condition_time_ifr` integer,
	`function_time_pilot_in_command` integer,
	`function_time_co_pilot` integer,
	`function_time_dual` integer,
	`function_time_instructor` integer,
	FOREIGN KEY (`departure_place`) REFERENCES `place`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`arrival_place`) REFERENCES `place`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`aircraft`) REFERENCES `aircraft`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`pilot_in_command`) REFERENCES `pilot`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `place` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `pilot` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `simulator` (
	`id` text PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);