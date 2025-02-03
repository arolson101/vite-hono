import { defineConfig } from 'drizzle-kit'
import { env } from './src/server/env'

export default defineConfig({
  dialect: 'sqlite',
  schema: './src/server/db/schema',
  dbCredentials: {
    url: env().DB_FILE,
  },
})
