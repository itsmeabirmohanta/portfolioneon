import type { NeonQueryFunction } from "@neondatabase/serverless";
import {
  designGallerySeedData,
  featuredProjectSeedData,
} from "./data/portfolio-seed-data";

const createTables = async (sql: NeonQueryFunction<false, false>) => {
  await sql`
    CREATE TABLE IF NOT EXISTS featured_projects (
      id SERIAL PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      case_study_url TEXT NOT NULL,
      prototype_url TEXT NOT NULL,
      image_url TEXT NOT NULL,
      display_order INTEGER NOT NULL DEFAULT 0,
      is_active BOOLEAN NOT NULL DEFAULT TRUE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS design_gallery (
      id SERIAL PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      year_label TEXT NOT NULL,
      image_url TEXT NOT NULL,
      display_order INTEGER NOT NULL DEFAULT 0,
      is_active BOOLEAN NOT NULL DEFAULT TRUE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;
};

export const seedPortfolioTables = async (sql: NeonQueryFunction<false, false>) => {
  await createTables(sql);

  for (const project of featuredProjectSeedData) {
    await sql`
      INSERT INTO featured_projects (
        slug,
        title,
        description,
        case_study_url,
        prototype_url,
        image_url,
        display_order,
        is_active,
        updated_at
      )
      VALUES (
        ${project.slug},
        ${project.title},
        ${project.description},
        ${project.caseStudyUrl},
        ${project.prototypeUrl},
        ${project.imageUrl},
        ${project.displayOrder},
        TRUE,
        NOW()
      )
      ON CONFLICT (slug)
      DO UPDATE SET
        title = EXCLUDED.title,
        description = EXCLUDED.description,
        case_study_url = EXCLUDED.case_study_url,
        prototype_url = EXCLUDED.prototype_url,
        image_url = EXCLUDED.image_url,
        display_order = EXCLUDED.display_order,
        is_active = TRUE,
        updated_at = NOW();
    `;
  }

  for (const item of designGallerySeedData) {
    await sql`
      INSERT INTO design_gallery (
        slug,
        title,
        year_label,
        image_url,
        display_order,
        is_active,
        updated_at
      )
      VALUES (
        ${item.slug},
        ${item.title},
        ${item.year},
        ${item.imageUrl},
        ${item.displayOrder},
        TRUE,
        NOW()
      )
      ON CONFLICT (slug)
      DO UPDATE SET
        title = EXCLUDED.title,
        year_label = EXCLUDED.year_label,
        image_url = EXCLUDED.image_url,
        display_order = EXCLUDED.display_order,
        is_active = TRUE,
        updated_at = NOW();
    `;
  }
};

export type FeaturedProjectRow = {
  id: number;
  title: string;
  description: string;
  case_study_url: string;
  prototype_url: string;
  image_url: string;
};

export type DesignGalleryRow = {
  id: number;
  title: string;
  year_label: string;
  image_url: string;
};

export const getFeaturedProjects = async (sql: NeonQueryFunction<false, false>) => {
  const rows = await sql`
    SELECT id, title, description, case_study_url, prototype_url, image_url
    FROM featured_projects
    WHERE is_active = TRUE
    ORDER BY display_order ASC, id ASC;
  `;

  return rows as FeaturedProjectRow[];
};

export const getDesignGallery = async (sql: NeonQueryFunction<false, false>) => {
  const rows = await sql`
    SELECT id, title, year_label, image_url
    FROM design_gallery
    WHERE is_active = TRUE
    ORDER BY display_order ASC, id ASC;
  `;

  return rows as DesignGalleryRow[];
};
