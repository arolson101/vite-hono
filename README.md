# vite-hono

A template repo for building a SPA react/hono application

# Packages

- hono
- vite
- react
- tanstack-router

# guides

- https://github.com/honojs/vite-plugins/tree/main/packages/dev-server
- https://blog.devgenius.io/full-stack-development-with-vite-and-hono-1b8c26f48956
- https://www.youtube.com/watch?v=sNh9PoM9sUE&t=2580s
- https://github.com/marbemac/ssrx/tree/main/examples/tanstack-router-simple

# where I left it

- I got the streaming react rendering to work, I had to hack the tanstack
  router script elements (by copying the file from tanstack start) but ultimately
  it doesn't work at runtime. The html looks ok AFAICT but the runtime gives me:
  ```
  Invariant failed: Expected to find a dehydrated data on window.__TSR_SSR__.dehydrated... but we did not. Please file an issue!
  ```
- hono ssg is probably working fine. I was going to write a vite plugin to add
  the output to the rollup build (copying and enhancing @hono/vite-ssg) but
  couldn't get past the tanstack router troubles
