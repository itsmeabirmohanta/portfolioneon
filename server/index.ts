import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import hpp from "hpp";
import {
  getChannelVideos,
  getDesignGallery,
  getFeaturedProjects,
  seedPortfolioTables,
} from "./db";
import { getNeonSqlClient } from "./neon";
import { enrichChannelVideosWithYouTubeMetadata } from "./youtube";

dotenv.config();

const app = express();
const port = Number(process.env.API_PORT ?? 8787);
const isProduction = process.env.NODE_ENV === "production";

const allowedOrigins = (process.env.CORS_ALLOWLIST ?? "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.disable("x-powered-by");
app.set("trust proxy", 1);

app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  }),
);

app.use(hpp());

app.use(
  cors({
    origin: (
      origin: string | undefined,
      callback: (error: Error | null, allow?: boolean) => void,
    ) => {
      if (!origin) {
        callback(null, true);
        return;
      }

      if (allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("Origin not allowed by CORS"));
    },
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-API-Key"],
    maxAge: 600,
  }),
);

app.use(express.json({ limit: "100kb" }));

const apiLimiter = rateLimit({
  windowMs: 60_000,
  limit: 120,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { message: "Too many requests, please try again later." },
});

app.use("/api", apiLimiter);

const requireSeedApiKey: express.RequestHandler = (req, res, next) => {
  const expectedKey = process.env.SEED_API_KEY;

  if (!isProduction && !expectedKey) {
    next();
    return;
  }

  if (!expectedKey) {
    res.status(500).json({ message: "SEED_API_KEY is not configured" });
    return;
  }

  const providedKey = req.header("x-api-key");
  if (providedKey !== expectedKey) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  next();
};

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.get("/api/featured-projects", async (_req, res) => {
  try {
    const sql = getNeonSqlClient();
    const projects = await getFeaturedProjects(sql);

    res.json(
      projects.map((project) => ({
        id: project.id,
        title: project.title,
        description: project.description,
        caseStudyUrl: project.case_study_url,
        prototypeUrl: project.prototype_url,
        image: project.image_url,
      })),
    );
  } catch (error) {
    console.error("Failed to fetch featured projects", error);
    res.status(500).json({ message: "Failed to fetch featured projects" });
  }
});

app.get("/api/design-gallery", async (_req, res) => {
  try {
    const sql = getNeonSqlClient();
    const gallery = await getDesignGallery(sql);

    res.json(
      gallery.map((item) => ({
        id: item.id,
        title: item.title,
        year: item.year_label,
        image: item.image_url,
      })),
    );
  } catch (error) {
    console.error("Failed to fetch design gallery", error);
    res.status(500).json({ message: "Failed to fetch design gallery" });
  }
});

app.get("/api/channel-videos", async (_req, res) => {
  try {
    const sql = getNeonSqlClient();
    const videos = await getChannelVideos(sql);
    const enrichedVideos = await enrichChannelVideosWithYouTubeMetadata(
      videos.map((video) => ({
        id: video.id,
        title: video.title,
        embedUrl: video.embed_url,
      })),
      process.env.YOUTUBE_API_KEY,
    );

    res.json(
      enrichedVideos.map((video) => ({
        id: video.id,
        title: video.title,
        description: video.description,
        channelName: video.channelName,
        thumbnailUrl: video.thumbnailUrl,
        embedUrl: video.embedUrl,
      })),
    );
  } catch (error) {
    console.error("Failed to fetch channel videos", error);
    res.status(500).json({ message: "Failed to fetch channel videos" });
  }
});

app.post("/api/seed", requireSeedApiKey, async (_req, res) => {
  try {
    const sql = getNeonSqlClient();
    await seedPortfolioTables(sql);

    res.status(201).json({ message: "Database seeded successfully" });
  } catch (error) {
    console.error("Failed to seed database", error);
    res.status(500).json({ message: "Failed to seed database" });
  }
});

app.use((error: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  if (error.message.includes("CORS")) {
    res.status(403).json({ message: "Origin not allowed" });
    return;
  }

  console.error("Unexpected API error", error);
  res.status(500).json({ message: "Internal server error" });
});

app.listen(port, () => {
  console.log(`Neon API running at http://localhost:${port}`);
});
