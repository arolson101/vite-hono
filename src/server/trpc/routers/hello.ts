import { z } from 'zod'
import { createTRPCRouter, publicProcedure } from '../trpc-server'

export const helloRouter = createTRPCRouter({
  world: publicProcedure.input(z.string().nullish()).query(({ input, ctx: { env } }) => {
    return `Hello ${input ?? 'World'}!`
  }),
})
