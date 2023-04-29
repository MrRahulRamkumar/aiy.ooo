import { env } from "@/env.mjs";
import { drizzle } from "drizzle-orm/planetscale-serverless";
import { connect } from "@planetscale/database";
import type { InferModel } from "drizzle-orm";
import { varchar, mysqlTable, timestamp } from "drizzle-orm/mysql-core";

export const user = mysqlTable("User", {
  id: varchar("id", { length: 191 }).primaryKey(),
  name: varchar("name", { length: 191 }),
  email: varchar("email", { length: 191 }),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: varchar("image", { length: 191 }),
});
export type User = InferModel<typeof user>;

export const shortLink = mysqlTable("ShortLink", {
  id: varchar("id", { length: 191 }).primaryKey(),
  url: varchar("url", { length: 3000 }).notNull(),
  slug: varchar("slug", { length: 191 }).notNull(),
  createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
  userId: varchar("userId", { length: 191 }).references(() => user.id),
});
export type ShortLink = InferModel<typeof shortLink>;
export type ShortLinkInsert = InferModel<typeof shortLink, "insert">;

// create the connection
const connection = connect({
  host: process.env["DATABASE_HOST"],
  username: process.env["DATABASE_USERNAME"],
  password: process.env["DATABASE_PASSWORD"],
});

export const db = drizzle(connection);
