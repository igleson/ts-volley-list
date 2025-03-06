// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import {
  index,
  integer,
  pgTableCreator,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

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
    id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
    name: varchar("name", { length: 255 }).notNull(),
    maxSize: integer("max_size"),
    limitDate: timestamp("limit_date_to_remove_name_and_not_pay", {
      withTimezone: true,
    }),
    ownerId: varchar("ownerId", { length: 255 }).notNull(),
  },
  (example) => ({
    nameIndex: index("name_idx").on(example.id),
    ownerIndex: index("owner_idx").on(example.ownerId),
  }),
);
