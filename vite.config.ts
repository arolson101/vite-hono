import build from "@hono/vite-build/node";
import devServer from "@hono/vite-dev-server";
import adapter from "@hono/vite-dev-server/node";
import { defineConfig } from "vite";
import { config } from "dotenv";

export default defineConfig(({ mode }) => {
  switch (mode) {
    case "client":
      return {
        build: {
          emptyOutDir: false,
          rollupOptions: {
            input: "./src/client.tsx",
            output: {
              entryFileNames: "static/client.js",
            },
          },
        },
      };
    case "development":
      return {
        ssr: {
          external: ["react", "react-dom"],
        },
        plugins: [
          build({
            outputDir: "server-build",
          }),
          devServer({
            env,
            adapter,
            entry: "src/server/hono.tsx",
          }),
        ],
      };
    default:
      throw new Error(`Unknown mode: ${mode}`);
  }
});

function env() {
  const result = config({
    override: true,
    // debug: true,
    encoding: "utf8",
  });
  if (result.error) {
    throw result.error;
  }
  return result.parsed!;
}
