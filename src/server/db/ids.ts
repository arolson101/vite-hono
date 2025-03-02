import { nanoid } from 'nanoid'
import { z } from 'zod'

export const UserId = z.string().brand<'UserId'>().default(nanoid)
export type UserId = z.infer<typeof UserId>
