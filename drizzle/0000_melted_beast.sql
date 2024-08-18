CREATE TABLE `aircraft` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`model` text NOT NULL,
	`registration` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `accounts` (
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
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `allowed_users` (
	`email` text PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`sessionToken` text PRIMARY KEY NOT NULL,
	`userId` text NOT NULL,
	`expires` integer NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text,
	`email` text NOT NULL,
	`emailVerified` integer,
	`image` text
);
--> statement-breakpoint
CREATE TABLE `logs` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`departure_at` integer NOT NULL,
	`arrival_at` integer NOT NULL,
	`departure_place_id` text NOT NULL,
	`arrival_place_id` text NOT NULL,
	`aircraft_id` text NOT NULL,
	`pilot_in_command_id` text NOT NULL,
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
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`departure_place_id`) REFERENCES `places`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`arrival_place_id`) REFERENCES `places`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`aircraft_id`) REFERENCES `aircraft`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`pilot_in_command_id`) REFERENCES `pilots`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `places` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`name` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `pilots` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`name` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `simulators` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
