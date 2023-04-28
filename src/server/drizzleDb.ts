import { drizzle } from "drizzle-orm/planetscale-serverless";
import { connect } from "@planetscale/database";
import { InferModel } from "drizzle-orm";
import { varchar, mysqlTable, timestamp } from "drizzle-orm/mysql-core";

export const shortLink = mysqlTable("ShortLink", {
  id: varchar("id", { length: 255 }).primaryKey(),
  url: varchar("url", { length: 3000 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull(),
  createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
});
export type ShortLink = InferModel<typeof shortLink>;

// create the connection
const connection = connect({
  host: process.env["DATABASE_HOST"],
  username: process.env["DATABASE_USERNAME"],
  password: process.env["DATABASE_PASSWORD"],
});

export const db = drizzle(connection);
