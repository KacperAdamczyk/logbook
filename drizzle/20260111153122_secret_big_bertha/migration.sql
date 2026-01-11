ALTER TABLE `flight_log` ADD `singlePilotSingleEngineTime` integer NOT NULL;--> statement-breakpoint
ALTER TABLE `flight_log` ADD `singlePilotMultiEngineTime` integer NOT NULL;--> statement-breakpoint
ALTER TABLE `flight_log` DROP COLUMN `singlePilotEngineType`;--> statement-breakpoint
ALTER TABLE `flight_log` DROP COLUMN `singlePilotTime`;