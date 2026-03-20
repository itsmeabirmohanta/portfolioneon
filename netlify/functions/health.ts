import type { Handler } from "@netlify/functions";
import { secureJsonHandler } from "./_lib/security";

export const handler: Handler = secureJsonHandler(
  {
    methods: ["GET", "OPTIONS"],
    rateLimit: {
      key: "health",
      max: 240,
      windowMs: 60_000,
    },
  },
  async () => ({
    statusCode: 200,
    body: { ok: true },
  }),
);
