import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read root .env or web .env.local to ensure NEXT_PUBLIC_ variables are always available to client
function loadEnvVariables() {
  const envFiles = [
    path.resolve(__dirname, "../../.env"),
    path.resolve(__dirname, ".env.local"),
    path.resolve(__dirname, ".env"),
  ];

  const env = {};
  for (const file of envFiles) {
    if (fs.existsSync(file)) {
      try {
        const content = fs.readFileSync(file, "utf-8");
        for (const line of content.split("\n")) {
          const trimmed = line.trim();
          if (!trimmed || trimmed.startsWith("#")) continue;
          const idx = trimmed.indexOf("=");
          if (idx !== -1) {
            const key = trimmed.slice(0, idx).trim();
            const val = trimmed.slice(idx + 1).trim();
            if (key.startsWith("FIREBASE_") || key.startsWith("NEXT_PUBLIC_FIREBASE_") || key.startsWith("MST_") || key === "CHAIN_ID") {
              env[key] = val;
              if (key.startsWith("FIREBASE_")) {
                env[`NEXT_PUBLIC_${key}`] = val;
              }
            }
          }
        }
      } catch {
        // Ignore read errors
      }
    }
  }
  return env;
}

const customEnv = loadEnvVariables();

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: customEnv,
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
