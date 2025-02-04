CREATE TABLE `aircraft` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`model` text NOT NULL,
	`registration` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
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
CREATE TABLE `allowedUser` (
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
	`email` text NOT NULL,
	`emailVerified` integer,
	`image` text
);
--> statement-breakpoint
CREATE TABLE `log` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`departure_at` integer NOT NULL,
	`arrival_at` integer NOT NULL,
	`departure_place_id` text NOT NULL,
	`arrival_place_id` text NOT NULL,
	`aircraft_id` text NOT NULL,
	`pilot_in_command_id` text NOT NULL,
	`takeoffs_day` integer,
	`takeoffs_night` integer,
	`landings_day` integer,
	`landings_night` integer,
	`singular_times_id` text NOT NULL,
	`cumulated_times_id` text NOT NULL,
	`remarks` text,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`departure_place_id`) REFERENCES `place`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`arrival_place_id`) REFERENCES `place`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`aircraft_id`) REFERENCES `aircraft`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`pilot_in_command_id`) REFERENCES `pilot`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`singular_times_id`) REFERENCES `time`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`cumulated_times_id`) REFERENCES `time`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `place` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`name` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `pilot` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`name` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `simulator` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `time` (
	`id` text PRIMARY KEY NOT NULL,
	`total_flight` integer DEFAULT 0 NOT NULL,
	`single_pilot_single_engine` integer DEFAULT 0 NOT NULL,
	`single_pilot_multi_engine` integer DEFAULT 0 NOT NULL,
	`multi_pilot` integer DEFAULT 0 NOT NULL,
	`operational_condition_night` integer DEFAULT 0 NOT NULL,
	`operational_condition_ifr` integer DEFAULT 0 NOT NULL,
	`function_pilot_in_command` integer DEFAULT 0 NOT NULL,
	`function_co_pilot` integer DEFAULT 0 NOT NULL,
	`function_dual` integer DEFAULT 0 NOT NULL,
	`function_instructor` integer DEFAULT 0 NOT NULL
);
