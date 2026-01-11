ALTER TABLE `flight_log` RENAME COLUMN `singlePilotType` TO `singlePilotEngineType`;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_aircraft` (
	`id` text PRIMARY KEY,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	`userId` text NOT NULL,
	`model` text NOT NULL,
	`registration` text NOT NULL,
	CONSTRAINT `fk_aircraft_userId_user_id_fk` FOREIGN KEY (`userId`) REFERENCES `user`(`id`),
	CONSTRAINT `aircraft_userId_registration_unique` UNIQUE(`userId`,`registration`)
);
--> statement-breakpoint
INSERT INTO `__new_aircraft`(`id`, `createdAt`, `updatedAt`, `userId`, `model`, `registration`) SELECT `id`, `createdAt`, `updatedAt`, `userId`, `model`, `registration` FROM `aircraft`;--> statement-breakpoint
DROP TABLE `aircraft`;--> statement-breakpoint
ALTER TABLE `__new_aircraft` RENAME TO `aircraft`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_pilot` (
	`id` text PRIMARY KEY,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	`userId` text NOT NULL,
	`name` text NOT NULL,
	CONSTRAINT `fk_pilot_userId_user_id_fk` FOREIGN KEY (`userId`) REFERENCES `user`(`id`),
	CONSTRAINT `pilot_userId_name_unique` UNIQUE(`userId`,`name`)
);
--> statement-breakpoint
INSERT INTO `__new_pilot`(`id`, `createdAt`, `updatedAt`, `userId`, `name`) SELECT `id`, `createdAt`, `updatedAt`, `userId`, `name` FROM `pilot`;--> statement-breakpoint
DROP TABLE `pilot`;--> statement-breakpoint
ALTER TABLE `__new_pilot` RENAME TO `pilot`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_place` (
	`id` text PRIMARY KEY,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	`userId` text NOT NULL,
	`name` text NOT NULL,
	CONSTRAINT `fk_place_userId_user_id_fk` FOREIGN KEY (`userId`) REFERENCES `user`(`id`),
	CONSTRAINT `place_userId_name_unique` UNIQUE(`userId`,`name`)
);
--> statement-breakpoint
INSERT INTO `__new_place`(`id`, `createdAt`, `updatedAt`, `userId`, `name`) SELECT `id`, `createdAt`, `updatedAt`, `userId`, `name` FROM `place`;--> statement-breakpoint
DROP TABLE `place`;--> statement-breakpoint
ALTER TABLE `__new_place` RENAME TO `place`;--> statement-breakpoint
PRAGMA foreign_keys=ON;