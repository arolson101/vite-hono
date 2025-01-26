import { Hono } from "hono";
import { renderToString } from "react-dom/server";
import { envMiddleware, EnvVars } from "./env";

const app = new Hono<{
  Bindings: EnvVars;
}>();

app.use(envMiddleware);

app.get("/api/clock", (c) => {
  return c.json({
    var: c.env.MY_VAR,
    time: new Date().toLocaleTimeString(),
  });
});

app.get("*", (c) => {
  const PROD = c.env.NODE_ENV === "production";
  return c.html(
    renderToString(
      <html>
        <head>
          <meta charSet="utf-8" />
          <meta content="width=device-width, initial-scale=1" name="viewport" />
          <link
            rel="stylesheet"
            href="https://cdn.simplecss.org/simple.min.css"
          />
          {PROD ? (
            <script type="module" src="/static/client.js"></script>
          ) : (
            <script type="module" src="/src/client.tsx"></script>
          )}
        </head>
        <body>
          <div id="root"></div>
        </body>
      </html>
    )
  );
});

export default app;
