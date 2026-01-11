PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_flight_log` (
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
	`singlePilotSingleEngineTime` integer NOT NULL,
	`singlePilotMultiEngineTime` integer NOT NULL,
	`multiPilotTime` integer NOT NULL,
	`operationalConditionNightTime` integer NOT NULL,
	`operationalConditionIfrTime` integer NOT NULL,
	`functionPilotInCommandTime` integer NOT NULL,
	`functionCoPilotTime` integer NOT NULL,
	`functionDualTime` integer NOT NULL,
	`functionInstructorTime` integer NOT NULL,
	`takeoffsDay` integer NOT NULL,
	`takeoffsNight` integer NOT NULL,
	`landingsDay` integer NOT NULL,
	`landingsNight` integer NOT NULL,
	`remarks` text NOT NULL,
	CONSTRAINT `fk_flight_log_userId_user_id_fk` FOREIGN KEY (`userId`) REFERENCES `user`(`id`),
	CONSTRAINT `fk_flight_log_departurePlaceId_place_id_fk` FOREIGN KEY (`departurePlaceId`) REFERENCES `place`(`id`),
	CONSTRAINT `fk_flight_log_arrivalPlaceId_place_id_fk` FOREIGN KEY (`arrivalPlaceId`) REFERENCES `place`(`id`),
	CONSTRAINT `fk_flight_log_aircraftId_aircraft_id_fk` FOREIGN KEY (`aircraftId`) REFERENCES `aircraft`(`id`),
	CONSTRAINT `fk_flight_log_pilotInCommandId_pilot_id_fk` FOREIGN KEY (`pilotInCommandId`) REFERENCES `pilot`(`id`)
);
--> statement-breakpoint
INSERT INTO `__new_flight_log`(`id`, `createdAt`, `updatedAt`, `userId`, `departureAt`, `arrivalAt`, `departurePlaceId`, `arrivalPlaceId`, `aircraftId`, `pilotInCommandId`, `totalFlightTime`, `singlePilotSingleEngineTime`, `singlePilotMultiEngineTime`, `multiPilotTime`, `operationalConditionNightTime`, `operationalConditionIfrTime`, `functionPilotInCommandTime`, `functionCoPilotTime`, `functionDualTime`, `functionInstructorTime`, `takeoffsDay`, `takeoffsNight`, `landingsDay`, `landingsNight`, `remarks`) SELECT `id`, `createdAt`, `updatedAt`, `userId`, `departureAt`, `arrivalAt`, `departurePlaceId`, `arrivalPlaceId`, `aircraftId`, `pilotInCommandId`, `totalFlightTime`, `singlePilotSingleEngineTime`, `singlePilotMultiEngineTime`, `multiPilotTime`, `operationalConditionNightTime`, `operationalConditionIfrTime`, `functionPilotInCommandTime`, `functionCoPilotTime`, `functionDualTime`, `functionInstructorTime`, `takeoffsDay`, `takeoffsNight`, `landingsDay`, `landingsNight`, `remarks` FROM `flight_log`;--> statement-breakpoint
DROP TABLE `flight_log`;--> statement-breakpoint
ALTER TABLE `__new_flight_log` RENAME TO `flight_log`;--> statement-breakpoint
PRAGMA foreign_keys=ON;