import { sql } from "drizzle-orm";
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const visitorMessages = sqliteTable("visitor_messages", {
  id: text("id").primaryKey(),
  nickname: text("nickname").notNull(),
  city: text("city"),
  message: text("message").notNull(),
  email: text("email"),
  status: text("status").notNull().default("pending"),
  ipHash: text("ip_hash").notNull(),
  starX: integer("star_x").notNull(),
  starY: integer("star_y").notNull(),
  reply: text("reply"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  moderatedAt: text("moderated_at"),
}, (table) => [
  index("visitor_messages_status_created_idx").on(table.status, table.createdAt),
  index("visitor_messages_ip_created_idx").on(table.ipHash, table.createdAt),
]);

export const divergentWorkspaces = sqliteTable("divergent_workspaces", {
  anonymousId: text("anonymous_id").primaryKey(),
  payload: text("payload").notNull(),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const divergentAssociationFeedback = sqliteTable("divergent_association_feedback", {
  centerLabel: text("center_label").notNull(),
  candidateLabel: text("candidate_label").notNull(),
  distance: text("distance").notNull(),
  action: text("action").notNull(),
  eventDay: text("event_day").notNull(),
  eventCount: integer("event_count").notNull().default(1),
}, (table) => [
  index("divergent_feedback_candidate_idx").on(table.centerLabel, table.eventCount),
]);
