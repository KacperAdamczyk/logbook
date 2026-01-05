CREATE TABLE `aircraft` (
	`id` text PRIMARY KEY,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	`userId` text NOT NULL,
	`model` text NOT NULL,
	`registration` text NOT NULL,
	CONSTRAINT `fk_aircraft_userId_user_id_fk` FOREIGN KEY (`userId`) REFERENCES `user`(`id`)
);
--> statement-breakpoint
CREATE TABLE `account` (
	`id` text PRIMARY KEY,
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
	CONSTRAINT `fk_account_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
CREATE TABLE `session` (
	`id` text PRIMARY KEY,
	`expires_at` integer NOT NULL,
	`token` text NOT NULL UNIQUE,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer NOT NULL,
	`ip_address` text,
	`user_agent` text,
	`user_id` text NOT NULL,
	CONSTRAINT `fk_session_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY,
	`name` text NOT NULL,
	`email` text NOT NULL UNIQUE,
	`email_verified` integer DEFAULT false NOT NULL,
	`image` text,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `verification` (
	`id` text PRIMARY KEY,
	`identifier` text NOT NULL,
	`value` text NOT NULL,
	`expires_at` integer NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `flight_log` (
	`id` text PRIMARY KEY,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	`userId` text NOT NULL,
	`departureAt` integer NOT NULL,
	`arrivalAt` integer NOT NULL,
	`departurePlaceId` text NOT NULL,
	`arrivalPlaceId` text NOT NULL,
	`aircraftId` text NOT NULL,
	`pilotInCommandId` text NOT NULL,
	`totalFlightTime` integer NOT NULL,
	`singlePilotType` text,
	`singlePilotTime` integer NOT NULL,
	`multiPilotTime` integer NOT NULL,
	`operationalConditionNightTime` integer NOT NULL,
	`operationalConditionIfrTime` integer NOT NULL,
	`functionPilotInCommandTime` integer NOT NULL,
	`functionCoPilotTime` integer NOT NULL,
	`functionDualTime` integer NOT NULL,
	`functionInstructorTime` integer NOT NULL,
	`takeoffsDay` integer,
	`takeoffsNight` integer,
	`landingsDay` integer,
	`landingsNight` integer,
	`remarks` text,
	CONSTRAINT `fk_flight_log_userId_user_id_fk` FOREIGN KEY (`userId`) REFERENCES `user`(`id`),
	CONSTRAINT `fk_flight_log_departurePlaceId_place_id_fk` FOREIGN KEY (`departurePlaceId`) REFERENCES `place`(`id`),
	CONSTRAINT `fk_flight_log_arrivalPlaceId_place_id_fk` FOREIGN KEY (`arrivalPlaceId`) REFERENCES `place`(`id`),
	CONSTRAINT `fk_flight_log_aircraftId_aircraft_id_fk` FOREIGN KEY (`aircraftId`) REFERENCES `aircraft`(`id`),
	CONSTRAINT `fk_flight_log_pilotInCommandId_pilot_id_fk` FOREIGN KEY (`pilotInCommandId`) REFERENCES `pilot`(`id`)
);
--> statement-breakpoint
CREATE TABLE `pilot` (
	`id` text PRIMARY KEY,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	`userId` text NOT NULL,
	`name` text NOT NULL,
	CONSTRAINT `fk_pilot_userId_user_id_fk` FOREIGN KEY (`userId`) REFERENCES `user`(`id`)
);
--> statement-breakpoint
CREATE TABLE `place` (
	`id` text PRIMARY KEY,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	`userId` text NOT NULL,
	`name` text NOT NULL,
	CONSTRAINT `fk_place_userId_user_id_fk` FOREIGN KEY (`userId`) REFERENCES `user`(`id`)
);
--> statement-breakpoint
CREATE TABLE `simulator_log` (
	`id` text PRIMARY KEY,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	`userId` text NOT NULL,
	`date` integer NOT NULL,
	CONSTRAINT `fk_simulator_log_userId_user_id_fk` FOREIGN KEY (`userId`) REFERENCES `user`(`id`)
);
