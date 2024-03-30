import {
timestamp,
  text,
  primaryKey,
 integer,
 pgTableCreator,
 index,
 uniqueIndex
} from "drizzle-orm/pg-core"
import type { AdapterAccount } from '@auth/core/adapters'
import { type InferInsertModel, type InferSelectModel } from "drizzle-orm";

export const projectTable = pgTableCreator(
  (name) => `short-link_${name}`,
);

export const users = projectTable("user", {
 id: text("id").notNull().primaryKey(),
 name: text("name"),
 email: text("email").notNull(),
 emailVerified: timestamp("emailVerified", { mode: "date" }),
 image: text("image"),
})

export const accounts = projectTable(
"account",
{
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  type: text("type").$type<AdapterAccount["type"]>().notNull(),
  provider: text("provider").notNull(),
  providerAccountId: text("providerAccountId").notNull(),
  refresh_token: text("refresh_token"),
  access_token: text("access_token"),
  expires_at: integer("expires_at"),
  token_type: text("token_type"),
  scope: text("scope"),
   id_token: text("id_token"),
  session_state: text("session_state"),
},
(account) => ({
  compoundKey: primaryKey({ columns: [account.provider, account.providerAccountId] }),
})
)

export const sessions = projectTable("session", {
 sessionToken: text("sessionToken").notNull().primaryKey(),
 userId: text("userId")
   .notNull()
   .references(() => users.id, { onDelete: "cascade" }),
 expires: timestamp("expires", { mode: "date" }).notNull(),
})

export const verificationTokens = projectTable(
 "verificationToken",
 {
   identifier: text("identifier").notNull(),
   token: text("token").notNull(),
   expires: timestamp("expires", { mode: "date" }).notNull(),
 },
 (vt) => ({
   compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
 })
)

export const shortLinks = projectTable(
  "shortLink",
  {
    id: text("id").primaryKey(),
    url: text("url").notNull(),
    slug: text("slug").notNull(),
    createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
    userId: text("userId").references(() => users.id),
  },
  (shortLinks) => ({
    slugIdx: uniqueIndex("short-link_shortLink_slug_idx").on(shortLinks.slug),
    userIdIdx: index("short-link_shortLink_userId_idx").on(shortLinks.userId),
  }),
);
export type SelectShortLink = InferSelectModel<typeof shortLinks>;
export type InsertShortLink = InferInsertModel<typeof shortLinks>;
