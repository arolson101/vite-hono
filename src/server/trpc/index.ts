import { initTRPC } from '@trpc/server'
import { z } from 'zod'
import { type EnvVars } from '../env'
import { AppDb } from '../types'

export type TRPCContext = {
  env: EnvVars
  db: AppDb
}

const t = initTRPC.context<TRPCContext>().create()

const publicProcedure = t.procedure
const router = t.router

export const appRouter = router({
  hello: publicProcedure.input(z.string().nullish()).query(({ input, ctx: { env } }) => {
    return `Hello ${input ?? 'World'}! (${env.MY_VAR})`
  }),
})

export type AppRouter = typeof appRouter
