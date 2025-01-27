import { Hono } from "hono";
import { envMiddleware, EnvVars } from "./env";
import { logger } from "hono/logger";

const app = new Hono<{
  Bindings: EnvVars;
}>();

if (process.env.NODE_ENV === "development") {
  app.use("*", logger());
}

app.use(envMiddleware);

app.get("/api/clock", (c) => {
  return c.json({
    var: c.env.MY_VAR,
    time: new Date().toLocaleTimeString(),
  });
});

export default app;
