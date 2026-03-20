export type FeaturedProject = {
  id: number;
  title: string;
  description: string;
  caseStudyUrl: string;
  prototypeUrl: string;
  image: string;
};

export type GalleryItem = {
  id: number;
  title: string;
  year: string;
  image: string;
};

const apiBaseUrl = import.meta.env.DEV
  ? (import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8787")
  : "";

const fetchJson = async <T>(path: string): Promise<T> => {
  const response = await fetch(`${apiBaseUrl}${path}`);

  if (!response.ok) {
    throw new Error(`Request failed for ${path}`);
  }

  return (await response.json()) as T;
};

export const fetchFeaturedProjects = () => fetchJson<FeaturedProject[]>("/api/featured-projects");

export const fetchGalleryItems = () => fetchJson<GalleryItem[]>("/api/design-gallery");
