DROP INDEX IF EXISTS `aircraft_user_registration_idx`;--> statement-breakpoint
CREATE UNIQUE INDEX `aircraft_user_registration_model_idx` ON `aircraft` (`userId`,`registration`,`model`);