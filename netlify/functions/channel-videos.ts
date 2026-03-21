import type { Handler } from "@netlify/functions";
import { neon } from "@neondatabase/serverless";
import { secureJsonHandler } from "./_lib/security";
import { enrichChannelVideosWithYouTubeMetadata } from "./_lib/youtube";

export const handler: Handler = secureJsonHandler(
  {
    methods: ["GET", "OPTIONS"],
    rateLimit: {
      key: "channel-videos",
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
        SELECT id, title, embed_url
        FROM channel_videos
        WHERE is_active = TRUE
        ORDER BY display_order ASC, id ASC;
      `;

      const enrichedVideos = await enrichChannelVideosWithYouTubeMetadata(
        rows.map((video) => ({
          id: video.id,
          title: video.title,
          embedUrl: video.embed_url,
        })),
        process.env.YOUTUBE_API_KEY,
      );

      const videos = enrichedVideos.map((video) => ({
        id: video.id,
        title: video.title,
        description: video.description,
        embedUrl: video.embedUrl,
      }));

      return {
        statusCode: 200,
        body: videos,
      };
    } catch (error) {
      console.error("Failed to fetch channel videos", error);
      return {
        statusCode: 500,
        body: { message: "Failed to fetch channel videos" },
      };
    }
  },
);
