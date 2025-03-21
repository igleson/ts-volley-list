// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import {
  primaryKey,
  index,
  integer,
  boolean,
  pgEnum,
  pgTableCreator,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { ListingEventType } from "~/models/ListingEvent";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `ts-volley-list_${name}`);

export const listings = createTable(
  "listing",
  {
    Id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
    Name: varchar("name", { length: 255 }).notNull(),
    MaxSize: integer("max_size").notNull(),
    LimitDate: timestamp("limit_date_to_remove_name_and_not_pay", {
      withTimezone: true,
    }),
    OwnerId: varchar("ownerId", { length: 255 }).notNull(),
    CreatedDate: timestamp("created_date", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    nameIndex: index("name_idx").on(table.Id),
    ownerIndex: index("owner_idx").on(table.OwnerId),
  }),
);

export const ListingEventTypeEnum = pgEnum("type", [
  ListingEventType.ADD.toString(),
  ListingEventType.REMOVE.toString(),
]);

export const listingEvents = createTable(
  "listing_events",
  {
    listingId: integer("listing_id").notNull(),
    userId: varchar("user_id", { length: 255 }).notNull(),
    date: timestamp("date", { withTimezone: true }).notNull().defaultNow(),
    isInvitee: boolean("is_invitee").notNull(),
    inviteeName: varchar("invitee_name", { length: 255 }),
    type: ListingEventTypeEnum("type")
      .default(ListingEventType.ADD.toString())
      .notNull(),
  },
  (table) => ({
    primaryKey: primaryKey({
      columns: [table.listingId, table.inviteeName, table.userId, table.date],
    }),
    nameIndex: index("listing_id_idx").on(table.listingId),
  }),
);
