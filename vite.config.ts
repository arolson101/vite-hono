import build from "@hono/vite-build/node";
import devServer from "@hono/vite-dev-server";
import adapter from "@hono/vite-dev-server/node";
import { defineConfig } from "vite";
import { config } from "dotenv";

export default defineConfig(({ mode }) => {
  if (mode === "client") {
    return {
      build: {
        rollupOptions: {
          input: "./src/client.tsx",
          output: {
            entryFileNames: "static/client.js",
          },
        },
      },
    };
  } else {
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
          entry: "src/index.tsx",
        }),
      ],
    };
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
