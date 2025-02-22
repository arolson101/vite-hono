import { tracked } from '@trpc/server'
import { z } from 'zod'
import { createTRPCRouter, publicProcedure } from '../trpc-server'
import { zAsyncIterable } from '../zAsyncIterable'

export const helloRouter = createTRPCRouter({
  world: publicProcedure.input(z.string().nullish()).query(({ input, ctx: { env } }) => {
    return `Hello ${input ?? 'World'}!`
  }),

  mySubscription: publicProcedure
    .input(
      z.object({
        lastEventId: z.coerce.number().min(0).optional(),
      }),
    )
    .output(
      zAsyncIterable({
        yield: z.object({
          count: z.number(),
        }),
        tracked: true,
      }),
    )
    .subscription(async function* (opts) {
      let index = opts.input.lastEventId ?? 0
      while (true) {
        index++
        yield tracked(index.toString(), {
          count: index,
        })
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    }),
})
