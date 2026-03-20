import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import {
  getDesignGallery,
  getFeaturedProjects,
  seedPortfolioTables,
} from "./db";
import { getNeonSqlClient } from "./neon";

dotenv.config();

const app = express();
const port = Number(process.env.API_PORT ?? 8787);

app.use(cors());
app.use(express.json());

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

app.post("/api/seed", async (_req, res) => {
  try {
    const sql = getNeonSqlClient();
    await seedPortfolioTables(sql);

    res.status(201).json({ message: "Database seeded successfully" });
  } catch (error) {
    console.error("Failed to seed database", error);
    res.status(500).json({ message: "Failed to seed database" });
  }
});

app.listen(port, () => {
  console.log(`Neon API running at http://localhost:${port}`);
});
