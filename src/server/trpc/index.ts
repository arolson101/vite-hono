import { initTRPC } from '@trpc/server'
import { z } from 'zod'
import { type EnvVars } from '../env'

export type HonoContext = {
  env: EnvVars
}

const t = initTRPC.context<HonoContext>().create()

const publicProcedure = t.procedure
const router = t.router

export const appRouter = router({
  hello: publicProcedure.input(z.string().nullish()).query(({ input, ctx: { env } }) => {
    return `Hello ${input ?? 'World'}! (${env.MY_VAR})`
  }),
})

export type AppRouter = typeof appRouter
