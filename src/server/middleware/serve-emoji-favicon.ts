// adapted from https://github.com/w3cj/stoker/blob/main/src/middlewares/serve-emoji-favicon.ts
import type { MiddlewareHandler } from 'hono'

const serveEmojiFavicon = (emoji: string, emojiDev?: string): MiddlewareHandler => {
  return async (c, next) => {
    if (emojiDev && import.meta.env.DEV) emoji = emojiDev
    if (c.req.path === '/favicon.ico') {
      c.header('Content-Type', 'image/svg+xml')
      return c.body(
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" x="-0.1em" font-size="90">${emoji}</text></svg>`,
      )
    }
    return next()
  }
}

export default serveEmojiFavicon
