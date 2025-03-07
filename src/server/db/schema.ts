// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import {
  index,
  integer,
  boolean,
  pgEnum,
  pgTableCreator,
  timestamp,
  varchar,
  text,
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
    MaxSize: integer("max_size"),
    LimitDate: timestamp("limit_date_to_remove_name_and_not_pay", {
      withTimezone: true,
    }),
    OwnerId: varchar("ownerId", { length: 255 }).notNull(),
  },
  (example) => ({
    nameIndex: index("name_idx").on(example.Id),
    ownerIndex: index("owner_idx").on(example.OwnerId),
  }),
);

export const ListingEventTypeEnum = pgEnum("type", [
  ListingEventType.ADD.toString(),
  ListingEventType.REMOVE.toString(),
]);

export const listingEvents = createTable(
  "listing_events",
  {
    listingId: varchar("listing_id", { length: 255 }).notNull(),
    userId: varchar("user_id", { length: 255 }).notNull(),
    date: timestamp("date", { withTimezone: true }).notNull(),
    isInvitee: boolean("is_invitee").notNull(),
    type: ListingEventTypeEnum("type").default(ListingEventType.ADD.toString()),
  },
  (example) => ({
    nameIndex: index("listing_id_idx").on(example.listingId),
  }),
);
