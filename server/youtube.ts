export type ChannelVideoBase = {
  id: number;
  title: string;
  embedUrl: string;
};

export type ChannelVideoWithMetadata = ChannelVideoBase & {
  description: string;
};

const extractYouTubeVideoId = (url: string): string | null => {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.toLowerCase();

    if (host.includes("youtube.com")) {
      if (parsed.pathname.startsWith("/embed/")) {
        const id = parsed.pathname.split("/")[2];
        return id || null;
      }

      if (parsed.pathname === "/watch") {
        return parsed.searchParams.get("v");
      }
    }

    if (host.includes("youtu.be")) {
      const id = parsed.pathname.replace(/^\//, "").trim();
      return id || null;
    }
  } catch {
    return null;
  }

  return null;
};

export const enrichChannelVideosWithYouTubeMetadata = async (
  videos: ChannelVideoBase[],
  apiKey: string | undefined,
): Promise<ChannelVideoWithMetadata[]> => {
  if (!apiKey) {
    return videos.map((video) => ({
      ...video,
      description: "",
    }));
  }

  const videoIdByEmbed = new Map<string, string>();
  const ids = videos
    .map((video) => {
      const id = extractYouTubeVideoId(video.embedUrl);
      if (id) {
        videoIdByEmbed.set(video.embedUrl, id);
      }
      return id;
    })
    .filter((id): id is string => Boolean(id));

  if (ids.length === 0) {
    return videos.map((video) => ({
      ...video,
      description: "",
    }));
  }

  const uniqueIds = Array.from(new Set(ids));
  const endpoint = new URL("https://www.googleapis.com/youtube/v3/videos");
  endpoint.searchParams.set("part", "snippet");
  endpoint.searchParams.set("id", uniqueIds.join(","));
  endpoint.searchParams.set("key", apiKey);

  try {
    const response = await fetch(endpoint.toString());
    if (!response.ok) {
      return videos.map((video) => ({
        ...video,
        description: "",
      }));
    }

    const payload = (await response.json()) as {
      items?: Array<{
        id: string;
        snippet?: {
          title?: string;
          description?: string;
        };
      }>;
    };

    const metadataById = new Map<string, { title?: string; description?: string }>();
    for (const item of payload.items ?? []) {
      metadataById.set(item.id, {
        title: item.snippet?.title,
        description: item.snippet?.description,
      });
    }

    return videos.map((video) => {
      const id = videoIdByEmbed.get(video.embedUrl);
      const metadata = id ? metadataById.get(id) : undefined;

      return {
        ...video,
        title: metadata?.title?.trim() || video.title,
        description: metadata?.description?.trim() || "",
      };
    });
  } catch {
    return videos.map((video) => ({
      ...video,
      description: "",
    }));
  }
};
