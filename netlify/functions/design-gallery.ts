import type { Handler } from "@netlify/functions";
import { neon } from "@neondatabase/serverless";
import { secureJsonHandler } from "./_lib/security";

export const handler: Handler = secureJsonHandler(
  {
    methods: ["GET", "OPTIONS"],
    rateLimit: {
      key: "design-gallery",
      max: 120,
      windowMs: 60_000,
    },
  },
  async () => {
    const connectionString = process.env.DATABASE_URL;

    if (!connectionString) {
      return {
        statusCode: 500,
        body: { message: "DATABASE_URL is not configured" },
      };
    }

    try {
      const sql = neon(connectionString);
      const rows = await sql`
        SELECT id, title, year_label, image_url
        FROM design_gallery
        WHERE is_active = TRUE
        ORDER BY display_order ASC, id ASC;
      `;

      const gallery = rows.map((item) => ({
        id: item.id,
        title: item.title,
        year: item.year_label,
        image: item.image_url,
      }));

      return {
        statusCode: 200,
        body: gallery,
      };
    } catch (error) {
      console.error("Failed to fetch design gallery", error);
      return {
        statusCode: 500,
        body: { message: "Failed to fetch design gallery" },
      };
    }
  },
);
