import type { Handler } from "@netlify/functions";
import { neon } from "@neondatabase/serverless";

export const handler: Handler = async () => {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "DATABASE_URL is not configured" }),
    };
  }

  try {
    const sql = neon(connectionString);
    const rows = await sql`
      SELECT id, title, description, case_study_url, prototype_url, image_url
      FROM featured_projects
      WHERE is_active = TRUE
      ORDER BY display_order ASC, id ASC;
    `;

    const projects = rows.map((row) => ({
      id: row.id,
      title: row.title,
      description: row.description,
      caseStudyUrl: row.case_study_url,
      prototypeUrl: row.prototype_url,
      image: row.image_url,
    }));

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(projects),
    };
  } catch (error) {
    console.error("Failed to fetch featured projects", error);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "Failed to fetch featured projects" }),
    };
  }
};
