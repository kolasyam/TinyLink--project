import { pgTable, text, varchar, integer, timestamp } from "drizzle-orm/pg-core";

export const links = pgTable("links", {
  code: varchar("code", { length: 8 }).primaryKey(),
  url: text("url").notNull(),
  clicks: integer("clicks").default(0).notNull(),
  last_clicked: timestamp("last_clicked"),
  created_at: timestamp("created_at").defaultNow().notNull()
});
