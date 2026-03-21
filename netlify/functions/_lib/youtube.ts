type ChannelVideoBase = {
  id: number;
  title: string;
  embedUrl: string;
};

export type ChannelVideoWithMetadata = ChannelVideoBase & {
  description: string;
  channelName: string;
  thumbnailUrl: string;
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

const toYouTubeEmbedUrl = (url: string): string => {
  const id = extractYouTubeVideoId(url);
  if (!id) {
    return url;
  }

  return `https://www.youtube.com/embed/${id}`;
};

const toYouTubeWatchUrl = (url: string): string => {
  const id = extractYouTubeVideoId(url);
  if (!id) {
    return url;
  }

  return `https://www.youtube.com/watch?v=${id}`;
};

const toYouTubeThumbnailUrl = (url: string): string => {
  const id = extractYouTubeVideoId(url);
  if (!id) {
    return "";
  }

  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
};

const enrichViaOEmbed = async (videos: ChannelVideoBase[]): Promise<ChannelVideoWithMetadata[]> => {
  const enriched = await Promise.all(
    videos.map(async (video) => {
      const watchUrl = toYouTubeWatchUrl(video.embedUrl);

      try {
        const endpoint = new URL("https://www.youtube.com/oembed");
        endpoint.searchParams.set("url", watchUrl);
        endpoint.searchParams.set("format", "json");

        const response = await fetch(endpoint.toString());
        if (!response.ok) {
          return {
            ...video,
            description: "",
            channelName: "",
            thumbnailUrl: toYouTubeThumbnailUrl(video.embedUrl),
          };
        }

        const payload = (await response.json()) as {
          title?: string;
          author_name?: string;
          thumbnail_url?: string;
        };

        return {
          ...video,
          title: payload.title?.trim() || video.title,
          description: "",
          channelName: payload.author_name?.trim() || "",
          thumbnailUrl: payload.thumbnail_url?.trim() || toYouTubeThumbnailUrl(video.embedUrl),
        };
      } catch {
        return {
          ...video,
          description: "",
          channelName: "",
          thumbnailUrl: toYouTubeThumbnailUrl(video.embedUrl),
        };
      }
    }),
  );

  return enriched;
};

export const enrichChannelVideosWithYouTubeMetadata = async (
  videos: ChannelVideoBase[],
  apiKey: string | undefined,
): Promise<ChannelVideoWithMetadata[]> => {
  const normalizedVideos = videos.map((video) => ({
    ...video,
    embedUrl: toYouTubeEmbedUrl(video.embedUrl),
  }));

  if (!apiKey) {
    return enrichViaOEmbed(normalizedVideos);
  }

  const videoIdByEmbed = new Map<string, string>();
  const ids = normalizedVideos
    .map((video) => {
      const id = extractYouTubeVideoId(video.embedUrl);
      if (id) {
        videoIdByEmbed.set(video.embedUrl, id);
      }
      return id;
    })
    .filter((id): id is string => Boolean(id));

  if (ids.length === 0) {
    return normalizedVideos.map((video) => ({
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
      return enrichViaOEmbed(normalizedVideos);
    }

    const payload = (await response.json()) as {
      items?: Array<{
        id: string;
        snippet?: {
          title?: string;
          description?: string;
          channelTitle?: string;
        };
      }>;
    };

    const metadataById = new Map<string, { title?: string; description?: string; channelName?: string }>();
    for (const item of payload.items ?? []) {
      metadataById.set(item.id, {
        title: item.snippet?.title,
        description: item.snippet?.description,
        channelName: item.snippet?.channelTitle,
      });
    }

    return normalizedVideos.map((video) => {
      const id = videoIdByEmbed.get(video.embedUrl);
      const metadata = id ? metadataById.get(id) : undefined;

      return {
        ...video,
        title: metadata?.title?.trim() || video.title,
        description: metadata?.description?.trim() || "",
        channelName: metadata?.channelName?.trim() || "",
        thumbnailUrl: toYouTubeThumbnailUrl(video.embedUrl),
      };
    });
  } catch {
    return enrichViaOEmbed(normalizedVideos);
  }
};
