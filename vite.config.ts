import devServer, { defaultOptions } from "@hono/vite-dev-server";
import adapter from "@hono/vite-dev-server/node";
import { defineConfig } from "vite";
import { config } from "dotenv";
import { createHtmlPlugin } from "vite-plugin-html";
import react from "@vitejs/plugin-react";
import { parseEnv } from "./src/server/env";
import tsconfigPaths from "vite-tsconfig-paths";

type ModeType = "development" | "client" | "server";

// validate env vars before starting
config();
parseEnv(process.env);

export default defineConfig(({ mode }) => {
  switch (mode as ModeType) {
    case "client":
    case "development":
      return {
        mode: mode === "client" ? "production " : "development",
        build: {
          outDir: "./dist/public",
          emptyOutDir: false,
        },
        plugins: [
          tsconfigPaths(),
          react({
            babel: {
              plugins: ["babel-plugin-react-compiler"],
            },
          }),
          createHtmlPlugin({
            minify: true,
            entry: "src/client.tsx",
            template: "index.html",
            inject: {
              data: {
                title: "test",
              },
            },
          }),
          mode === "development" &&
            devServer({
              env() {
                const result = config({
                  override: true,
                  // debug: true,
                });
                if (result.error) {
                  throw result.error;
                }
                return result.parsed!;
              },
              adapter,
              entry: "src/server/hono.tsx",
              exclude: [
                ...defaultOptions.exclude!, //
                /.*\.html$/,
              ],
            }),
        ],
        server: {
          port: 9999,
        },
      };

    default:
      throw new Error(`Unexpected mode: ${mode}`);
  }
});
