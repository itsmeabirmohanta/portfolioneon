import type { Handler, HandlerEvent } from "@netlify/functions";

type HandlerResult = {
  statusCode?: number;
  body: unknown;
  headers?: Record<string, string>;
};

type SecureOptions = {
  methods: Array<"GET" | "POST" | "OPTIONS">;
  rateLimit: {
    max: number;
    windowMs: number;
    key: string;
  };
};

type Bucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, Bucket>();

const SECURITY_HEADERS: Record<string, string> = {
  "Content-Type": "application/json; charset=utf-8",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
  "Cache-Control": "no-store",
};

const parseAllowedOrigins = (): string[] => {
  const raw = process.env.CORS_ALLOWLIST ?? "";
  return raw
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
};

const getOrigin = (event: HandlerEvent): string | null => {
  const value = event.headers.origin || event.headers.Origin;
  return value ?? null;
};

const getClientIp = (event: HandlerEvent): string => {
  const forwardedFor = event.headers["x-forwarded-for"] || event.headers["X-Forwarded-For"];
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  const netlifyIp =
    event.headers["x-nf-client-connection-ip"] ||
    event.headers["X-Nf-Client-Connection-Ip"] ||
    event.headers["client-ip"] ||
    event.headers["Client-Ip"];

  return (netlifyIp ?? "unknown").trim();
};

const buildCorsHeader = (origin: string | null): Record<string, string> => {
  const allowlist = parseAllowedOrigins();

  if (allowlist.length === 0) {
    return {
      "Access-Control-Allow-Origin": origin ?? "*",
      Vary: "Origin",
    };
  }

  if (origin && allowlist.includes(origin)) {
    return {
      "Access-Control-Allow-Origin": origin,
      Vary: "Origin",
    };
  }

  return {};
};

const isOriginAllowed = (origin: string | null): boolean => {
  const allowlist = parseAllowedOrigins();

  if (allowlist.length === 0 || origin === null) {
    return true;
  }

  return allowlist.includes(origin);
};

const applyRateLimit = (event: HandlerEvent, config: SecureOptions["rateLimit"]) => {
  const now = Date.now();
  const ip = getClientIp(event);
  const id = `${config.key}:${ip}`;

  const existing = buckets.get(id);
  if (!existing || existing.resetAt <= now) {
    const fresh: Bucket = {
      count: 1,
      resetAt: now + config.windowMs,
    };
    buckets.set(id, fresh);
    return {
      allowed: true,
      remaining: config.max - 1,
      resetAt: fresh.resetAt,
    };
  }

  existing.count += 1;
  buckets.set(id, existing);

  return {
    allowed: existing.count <= config.max,
    remaining: Math.max(0, config.max - existing.count),
    resetAt: existing.resetAt,
  };
};

const response = (
  statusCode: number,
  body: unknown,
  origin: string | null,
  additionalHeaders: Record<string, string> = {},
) => {
  const corsHeaders = buildCorsHeader(origin);
  return {
    statusCode,
    headers: {
      ...SECURITY_HEADERS,
      ...corsHeaders,
      ...additionalHeaders,
    },
    body: JSON.stringify(body),
  };
};

export const secureJsonHandler = (
  options: SecureOptions,
  logic: (event: HandlerEvent) => Promise<HandlerResult>,
): Handler => {
  return async (event) => {
    const method = (event.httpMethod ?? "GET").toUpperCase();
    const origin = getOrigin(event);

    if (method === "OPTIONS") {
      return {
        statusCode: 204,
        headers: {
          ...SECURITY_HEADERS,
          ...buildCorsHeader(origin),
          "Access-Control-Allow-Methods": options.methods.join(", "),
          "Access-Control-Allow-Headers": "Content-Type, Authorization, X-API-Key",
        },
        body: "",
      };
    }

    if (!options.methods.includes(method as SecureOptions["methods"][number])) {
      return response(405, { message: "Method not allowed" }, origin, {
        Allow: options.methods.join(", "),
      });
    }

    if (!isOriginAllowed(origin)) {
      return response(403, { message: "Origin not allowed" }, origin);
    }

    const limit = applyRateLimit(event, options.rateLimit);
    const limitHeaders = {
      "RateLimit-Limit": String(options.rateLimit.max),
      "RateLimit-Remaining": String(limit.remaining),
      "RateLimit-Reset": String(Math.ceil((limit.resetAt - Date.now()) / 1000)),
    };

    if (!limit.allowed) {
      return response(429, { message: "Too many requests" }, origin, limitHeaders);
    }

    try {
      const result = await logic(event);
      return response(result.statusCode ?? 200, result.body, origin, {
        ...limitHeaders,
        ...(result.headers ?? {}),
      });
    } catch (error) {
      console.error("Unhandled function error", error);
      return response(500, { message: "Internal server error" }, origin, limitHeaders);
    }
  };
};
