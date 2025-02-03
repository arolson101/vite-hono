import { createEnv } from '@t3-oss/env-core'
import 'dotenv/config'
import { z } from 'zod'

type RuntimeEnv = Record<string, string | boolean | number | undefined>

export const parseEnv = (runtimeEnv: RuntimeEnv) =>
  createEnv({
    /**
     * Define the schema for your environment variables. This is a Zod schema
     * that will be used to validate the environment variables.
     */
    server: {
      NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
      PORT: z.number().default(9999),
      LOG_LEVEL: z.enum(['trace', 'debug', 'info', 'warn', 'error', 'fatal']).default('info'),
      MY_VAR: z.string(),
    },

    /**
     * What object holds the environment variables at runtime. This is usually
     * `process.env` or `import.meta.env`.
     */
    runtimeEnv,

    /**
     * By default, this library will feed the environment variables directly to
     * the Zod validator.
     *
     * This means that if you have an empty string for a value that is supposed
     * to be a number (e.g. `PORT=` in a ".env" file), Zod will incorrectly flag
     * it as a type mismatch violation. Additionally, if you have an empty string
     * for a value that is supposed to be a string with a default value (e.g.
     * `DOMAIN=` in an ".env" file), the default value will never be applied.
     *
     * In order to solve these issues, we recommend that all new projects
     * explicitly specify this option as true.
     */
    emptyStringAsUndefined: true,
  })

export type EnvVars = ReturnType<typeof parseEnv>
export const env = () => parseEnv(process.env)
