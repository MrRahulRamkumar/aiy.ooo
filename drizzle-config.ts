
import { defineConfig } from 'drizzle-kit'
import { env } from '@/env.mjs'

export default defineConfig({
 schema: "./src/server/db/schema.ts",
  driver: 'pg',
  dbCredentials: {
    connectionString: env.DATABASE_URL,
  },
  tablesFilter: ["short-link_*"],
  verbose: true,
  strict: true,
})