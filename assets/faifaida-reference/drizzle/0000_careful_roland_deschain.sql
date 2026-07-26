CREATE TABLE `visitor_messages` (
	`id` text PRIMARY KEY NOT NULL,
	`nickname` text NOT NULL,
	`city` text,
	`message` text NOT NULL,
	`email` text,
	`status` text DEFAULT 'pending' NOT NULL,
	`ip_hash` text NOT NULL,
	`star_x` integer NOT NULL,
	`star_y` integer NOT NULL,
	`reply` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`moderated_at` text
);
--> statement-breakpoint
CREATE INDEX `visitor_messages_status_created_idx` ON `visitor_messages` (`status`,`created_at`);--> statement-breakpoint
CREATE INDEX `visitor_messages_ip_created_idx` ON `visitor_messages` (`ip_hash`,`created_at`);