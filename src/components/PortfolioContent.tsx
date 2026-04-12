import { motion, useScroll, useTransform } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { fetchChannelVideos, fetchFeaturedProjects, fetchGalleryItems } from "@/lib/portfolio-api";

const motionEase = [0.22, 1, 0.36, 1] as const;

const SectionTitle = ({ label }: { label: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 22 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.55 }}
    transition={{ duration: 0.65, ease: motionEase }}
    className="mb-6 sm:mb-8 md:mb-10 lg:mb-12"
  >
    <p className="text-foreground text-[20px] sm:text-[28px] md:text-[44px] lg:text-[52px] leading-[1] sm:leading-[0.95] md:leading-[0.88] tracking-[-0.045em] font-black">
      {label}
    </p>
  </motion.div>
);

const cardReveal = {
  hidden: { opacity: 0, y: 28, scale: 0.985 },
  show: (index: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      delay: index * 0.08,
      ease: motionEase,
    },
  }),
};

const sectionReveal = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: motionEase,
    },
  },
};

type SkeletonImageProps = {
  src: string;
  alt: string;
  className: string;
  priority?: boolean;
  onMetadata?: (width: number, height: number) => void;
};

const SkeletonImage = ({ src, alt, className, priority = false, onMetadata }: SkeletonImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="relative h-full w-full bg-secondary/35">
      {!isLoaded ? <div className="absolute inset-0 animate-skeleton-shimmer" /> : null}
      <img
        src={src}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
        onLoad={(event) => {
          const { naturalWidth, naturalHeight } = event.currentTarget;
          if (naturalWidth > 0 && naturalHeight > 0) {
            onMetadata?.(naturalWidth, naturalHeight);
          }
          setIsLoaded(true);
        }}
        onError={() => setIsLoaded(true)}
        className={`${className} transition-[opacity,filter,transform] duration-700 ${
          isLoaded ? "opacity-100 blur-0" : "opacity-0 blur-sm"
        }`}
      />
    </div>
  );
};

const PortfolioContent = () => {
  const featuredRef = useRef<HTMLElement | null>(null);
  const videosRef = useRef<HTMLElement | null>(null);
  const galleryRef = useRef<HTMLElement | null>(null);
  const [galleryImageDims, setGalleryImageDims] = useState<Record<number, { width: number; height: number }>>({});
  const [activeVideoPlayers, setActiveVideoPlayers] = useState<Record<number, boolean>>({});

  const {
    data: featuredProjects = [],
    isLoading: isFeaturedLoading,
    isError: isFeaturedError,
  } = useQuery({
    queryKey: ["featured-projects"],
    queryFn: fetchFeaturedProjects,
  });

  const {
    data: galleryItems = [],
    isLoading: isGalleryLoading,
    isError: isGalleryError,
  } = useQuery({
    queryKey: ["design-gallery"],
    queryFn: fetchGalleryItems,
  });

  const {
    data: channelVideos = [],
    isLoading: isVideosLoading,
    isError: isVideosError,
  } = useQuery({
    queryKey: ["channel-videos"],
    queryFn: fetchChannelVideos,
  });

  const { scrollYProgress: featuredProgress } = useScroll({
    target: featuredRef,
    offset: ["start end", "end start"],
  });
  const { scrollYProgress: galleryProgress } = useScroll({
    target: galleryRef,
    offset: ["start end", "end start"],
  });
  const { scrollYProgress: videosProgress } = useScroll({
    target: videosRef,
    offset: ["start end", "end start"],
  });

  const featuredParallaxY = useTransform(featuredProgress, [0, 1], [26, -26]);
  const featuredGlowLeftY = useTransform(featuredProgress, [0, 1], [0, -44]);
  const featuredGlowRightY = useTransform(featuredProgress, [0, 1], [0, 54]);
  const videosParallaxY = useTransform(videosProgress, [0, 1], [14, -14]);
  const galleryParallaxY = useTransform(galleryProgress, [0, 1], [18, -18]);

  return (
    <>
      <motion.section
        id="featured"
        ref={featuredRef}
        style={{ y: featuredParallaxY }}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.12 }}
        variants={sectionReveal}
        className="relative mx-auto w-full max-w-[1240px] px-4 sm:px-6 md:px-10 lg:px-12 pt-10 sm:pt-12 md:pt-16 lg:pt-20 overflow-hidden scroll-mt-20"
      >
        {/* Ambient glows */}
        <motion.div
          style={{ y: featuredGlowLeftY }}
          className="pointer-events-none absolute -left-20 top-20 h-64 w-64 rounded-full bg-accent/8 blur-3xl animate-pulse-soft"
        />
        <motion.div
          style={{ y: featuredGlowRightY }}
          className="pointer-events-none absolute -right-16 top-1/3 h-72 w-72 rounded-full bg-secondary/35 blur-3xl animate-drift-y"
        />

        {/* Header */}
        <SectionTitle label="Featured work" />

        {/* Skeleton loaders */}
        {isFeaturedLoading ? (
          <div className="space-y-4 md:space-y-5">
            {/* Hero skeleton */}
            <div className="relative overflow-hidden flex flex-col md:flex-row rounded-[22px] sm:rounded-[26px] border border-white/10 bg-[#0a0a0a] min-h-[420px] md:h-[480px]">
              <div className="w-full md:w-3/5 lg:w-[66%] h-[280px] md:h-full relative bg-secondary/20">
                <div className="absolute inset-0 animate-skeleton-shimmer" />
              </div>
              <div className="w-full md:w-2/5 lg:w-[34%] p-6 sm:p-8 md:p-10 flex flex-col justify-center space-y-4">
                <div className="h-3 w-28 rounded-full bg-white/10" />
                <div className="h-8 sm:h-10 w-3/4 rounded-lg bg-white/10" />
                <div className="h-4 w-full rounded-md bg-white/8" />
                <div className="h-4 w-2/3 rounded-md bg-white/8" />
              </div>
            </div>
            {/* Grid skeletons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
              {[0, 1].map((i) => (
                <div key={i} className="relative flex flex-col overflow-hidden rounded-[20px] border border-white/10 bg-[#0a0a0a]">
                  <div className="w-full h-[220px] sm:h-[240px] relative bg-secondary/20">
                    <div className="absolute inset-0 animate-skeleton-shimmer" />
                  </div>
                  <div className="p-5 flex flex-col space-y-3">
                    <div className="h-5 w-2/3 rounded-md bg-white/10" />
                    <div className="h-3 w-full rounded-sm bg-white/5" />
                    <div className="h-3 w-3/4 rounded-sm bg-white/5" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {isFeaturedError ? (
          <p className="mb-6 text-sm text-destructive">Unable to load featured projects right now.</p>
        ) : null}

        {/* ── Projects layout ── */}
        {featuredProjects.length > 0 && !isFeaturedLoading && (
          <div className="space-y-3 sm:space-y-4 md:space-y-5">

            {/* ── Hero card (first project) ── */}
            <motion.article
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.15 }}
              variants={cardReveal}
              custom={0}
              key={featuredProjects[0].id}
              className="group flex flex-col md:flex-row overflow-hidden rounded-[20px] sm:rounded-[24px] md:rounded-[28px] border border-white/10 bg-[#0a0a0a] transition-all duration-500 hover:border-white/20 hover:shadow-[0_20px_50px_rgba(0,0,0,0.4)]"
            >
              {/* Image half */}
              <div className="relative w-full md:w-[60%] lg:w-[66%] h-[280px] sm:h-[360px] md:h-auto overflow-hidden">
                <SkeletonImage
                  src={featuredProjects[0].image}
                  alt={featuredProjects[0].title}
                  priority
                  className="w-full h-full object-cover transition-transform duration-700 will-change-transform group-hover:scale-[1.03]"
                />
                {/* Light scrim for just the top badge instead of heavy overlay */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent h-1/3" />
                {/* Hover shimmer */}
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(255,255,255,0.06),transparent_55%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                
                {/* Index + badge pinned to top-left of image */}
                <div className="absolute top-4 left-4 sm:top-5 sm:left-5 md:top-6 md:left-6 flex items-center gap-2">
                  <span className="inline-flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full bg-black/70 border border-white/15 text-[9px] sm:text-[10px] font-bold text-white/90 backdrop-blur-md">
                    01
                  </span>
                  <span className="rounded-full bg-black/70 border border-white/15 px-2.5 py-[3px] text-[9px] sm:text-[10px] uppercase tracking-[0.18em] text-white/80 backdrop-blur-md">
                    Featured
                  </span>
                </div>
              </div>

              {/* Text half */}
              <div className="w-full md:w-[40%] lg:w-[34%] flex flex-col justify-center p-6 sm:p-8 md:p-8 lg:p-10 xl:p-12 border-t md:border-t-0 md:border-l border-white/10 bg-[#0d0d0d] relative">
                {/* Soft glow in corner */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-3xl rounded-full pointer-events-none" />
                
                <h3 className="text-white text-[24px] xs:text-[28px] sm:text-[32px] lg:text-[40px] leading-[1.05] tracking-[-0.03em] font-black">
                  {featuredProjects[0].title}
                </h3>
                <p className="mt-3 sm:mt-4 text-white/65 text-[13px] sm:text-[14px] lg:text-[15px] leading-[1.6] line-clamp-4">
                  {featuredProjects[0].description}
                </p>

                {/* CTAs */}
                <div className="mt-5 sm:mt-6 lg:mt-8 flex flex-wrap items-center gap-2.5">
                  <a
                    href={featuredProjects[0].prototypeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-[38px] lg:min-h-[42px] items-center gap-1.5 rounded-full border border-white/90 bg-white px-4 sm:px-5 py-2 text-[13px] lg:text-[14px] font-semibold text-black transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/90 active:scale-95 hover:shadow-[0_8px_20px_rgba(0,0,0,0.6)]"
                  >
                    View prototype
                    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
                      <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </a>
                  {featuredProjects[0].caseStudyUrl ? (
                    <a
                      href={featuredProjects[0].caseStudyUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex min-h-[38px] lg:min-h-[42px] items-center gap-1.5 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 px-4 sm:px-5 py-2 text-[13px] lg:text-[14px] font-medium text-white transition-colors active:scale-95"
                    >
                      Case study
                    </a>
                  ) : null}
                </div>
              </div>
            </motion.article>

            {/* ── Bento grid (remaining projects) ── */}
            {featuredProjects.length > 1 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-5">
                {featuredProjects.slice(1).map((project, i) => {
                  const displayIndex = i + 2;
                  const indexLabel = String(displayIndex).padStart(2, "0");
                  return (
                    <motion.article
                      initial="hidden"
                      whileInView="show"
                      viewport={{ once: true, amount: 0.18 }}
                      variants={cardReveal}
                      custom={displayIndex}
                      key={project.id}
                      className="group flex flex-col overflow-hidden rounded-[18px] sm:rounded-[22px] md:rounded-[24px] border border-white/10 bg-[#0a0a0a] transition-all duration-400 hover:-translate-y-[3px] hover:border-white/20 hover:shadow-[0_18px_40px_rgba(0,0,0,0.45)]"
                    >
                      {/* Image Top Half */}
                      <div className="relative h-[200px] sm:h-[220px] md:h-[250px] w-full overflow-hidden border-b border-white/5">
                        <SkeletonImage
                          src={project.image}
                          alt={project.title}
                          className="w-full h-full object-cover transition-transform duration-500 will-change-transform group-hover:scale-[1.05]"
                        />
                        {/* Light scrim for just the top badge visibility */}
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent h-1/2" />
                        {/* Hover shimmer */}
                        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(255,255,255,0.05),transparent_52%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                        {/* Index badge pinned to top */}
                        <div className="absolute top-3 left-3 sm:top-4 sm:left-4 flex items-center gap-1.5">
                          <span className="inline-flex h-[22px] w-[22px] items-center justify-center rounded-full bg-black/75 border border-white/15 text-[8px] sm:text-[9px] font-bold text-white/85 backdrop-blur-md">
                            {indexLabel}
                          </span>
                          <span className="rounded-full bg-black/70 border border-white/12 px-2 py-[2px] text-[8px] sm:text-[9px] uppercase tracking-[0.15em] text-white/70 backdrop-blur-md">
                            Featured
                          </span>
                        </div>
                      </div>

                      {/* Text Bottom Half */}
                      <div className="flex flex-col flex-1 p-4 sm:p-5 md:p-6 bg-[#0d0d0d] relative">
                        {/* Soft subtle highlight layer on hover */}
                        <div className="absolute inset-0 bg-white/[0.02] opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none" />
                        
                        <h3 className="text-white text-[19px] sm:text-[21px] md:text-[23px] leading-[1.1] tracking-[-0.025em] font-black z-10">
                          {project.title}
                        </h3>
                        <p className="mt-1.5 sm:mt-2 text-white/60 text-[12px] sm:text-[13px] leading-[1.5] line-clamp-2 z-10">
                          {project.description}
                        </p>

                        <div className="mt-auto pt-4 sm:pt-5 z-10">
                          <div className="flex flex-wrap items-center gap-2">
                            <a
                              href={project.prototypeUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex min-h-[32px] sm:min-h-[34px] items-center gap-1 rounded-full border border-white/75 bg-white px-3.5 py-1.5 text-[11px] sm:text-[12px] font-medium text-black transition-all duration-300 active:scale-95 hover:bg-white/90 hover:shadow-[0_6px_16px_rgba(0,0,0,0.5)]"
                            >
                              Prototype
                              <svg viewBox="0 0 16 16" className="h-2.5 w-2.5 sm:h-3 sm:w-3 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                                <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            </a>
                            {project.caseStudyUrl ? (
                              <a
                                href={project.caseStudyUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex min-h-[32px] sm:min-h-[34px] items-center rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-[11px] sm:text-[12px] text-white transition-colors active:scale-95 hover:bg-white/10 hover:border-white/20"
                              >
                                Case study
                              </a>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </motion.article>
                  );
                })}
              </div>
            )}

          </div>
        )}
      </motion.section>

      <motion.section
        id="videos"
        ref={videosRef}
        style={{ y: videosParallaxY }}
        initial={false}
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionReveal}
        className="mx-auto w-full max-w-[1240px] px-4 sm:px-6 md:px-10 lg:px-12 pt-12 sm:pt-14 md:pt-18 lg:pt-22 scroll-mt-20"
      >
        <SectionTitle label="Channel Videos" />

        {isVideosLoading ? <p className="mb-6 text-sm text-muted-foreground">Loading videos...</p> : null}
        {isVideosError ? <p className="mb-6 text-sm text-destructive">Unable to load videos right now.</p> : null}

        <motion.div
          initial={false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.65, ease: motionEase }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6"
        >
          {channelVideos.map((video, index) => (
            <motion.article
              initial={false}
              whileInView="show"
              viewport={{ once: true, amount: 0.28 }}
              variants={cardReveal}
              custom={index}
              key={video.id}
              className="group relative overflow-hidden rounded-[18px] sm:rounded-[22px] border border-border/55 bg-card/18 p-3 sm:p-4 transition-all duration-400 hover:-translate-y-1 hover:border-border/80 hover:bg-card/30 hover:shadow-[0_20px_36px_rgba(0,0,0,0.34)]"
            >
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(255,255,255,0.08),transparent_52%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

              <div className="relative mt-3 overflow-hidden rounded-[14px] border border-border/60 bg-black/40 aspect-video">
                {activeVideoPlayers[video.id] ? (
                  <iframe
                    src={`${video.embedUrl}?autoplay=1&rel=0&modestbranding=1`}
                    title={video.title}
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    referrerPolicy="strict-origin-when-cross-origin"
                    className="h-full w-full"
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setActiveVideoPlayers((current) => ({ ...current, [video.id]: true }));
                    }}
                    className="relative h-full w-full overflow-hidden"
                    aria-label={`Play ${video.title}`}
                  >
                    <img
                      src={video.thumbnailUrl}
                      alt={video.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-black/25" />
                    <div className="pointer-events-none absolute left-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/25 bg-white/15 backdrop-blur-md flex items-center justify-center shadow-[0_14px_24px_rgba(0,0,0,0.4)]">
                      <svg viewBox="0 0 24 24" className="h-6 w-6 text-white fill-current translate-x-[1px]" aria-hidden="true">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </button>
                )}
              </div>

              <div className="relative mt-3 min-w-0 rounded-[12px] border border-border/45 bg-black/20 px-3 py-2.5 sm:px-3.5 sm:py-3">
                <h4 className="text-foreground text-[15px] sm:text-[16px] leading-[1.35] font-semibold tracking-[-0.01em] break-words whitespace-normal">
                  {video.title}
                </h4>
                {video.channelName ? (
                  <p className="mt-1 break-words text-[11px] sm:text-[12px] uppercase tracking-[0.12em] text-muted-foreground/90">
                    {video.channelName}
                  </p>
                ) : null}
              </div>

              <a
                href="https://www.youtube.com/@itsmeabirmohanta"
                target="_blank"
                rel="noreferrer"
                className="relative mt-3 inline-flex items-center justify-center rounded-full border border-border/70 px-3.5 py-1.5 text-[12px] sm:text-[13px] text-muted-foreground transition-colors hover:border-foreground/60 hover:text-foreground"
              >
                Open channel
              </a>
            </motion.article>
          ))}
        </motion.div>
      </motion.section>

      <motion.section
        id="gallery"
        ref={galleryRef}
        style={{ y: galleryParallaxY }}
        initial={false}
        whileInView="show"
        viewport={{ once: true, amount: 0.18 }}
        variants={sectionReveal}
        className="mx-auto w-full max-w-[1240px] px-4 sm:px-6 md:px-10 lg:px-12 pt-12 sm:pt-14 md:pt-18 lg:pt-22 scroll-mt-20"
      >
        <SectionTitle label="Design Gallery" />

        {isGalleryLoading ? <p className="mb-6 text-sm text-muted-foreground">Loading gallery...</p> : null}
        {isGalleryError ? <p className="mb-6 text-sm text-destructive">Unable to load gallery right now.</p> : null}

        <motion.div
          initial={false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.65, ease: motionEase }}
          className="columns-1 ms:columns-2 md:columns-2 lg:columns-3 xl:columns-3 2xl:columns-3 gap-3 sm:gap-4 md:gap-5 xl:gap-6"
        >
          {galleryItems.map((item, index) => (
            (() => {
              const dims = galleryImageDims[item.id];
              const aspectRatio = dims ? dims.width / dims.height : 1.2;
              const displayedAspectRatio = Math.min(aspectRatio, 2.1);
              const isLandscapeCard = aspectRatio >= 1.35;
              const isUltraLandscapeCard = aspectRatio >= 1.8;

              return (
                <motion.article
                  initial={false}
                  whileInView="show"
                  viewport={{ once: true, amount: 0.25 }}
                  variants={cardReveal}
                  custom={index}
                  key={item.id}
                  className="group mb-3 break-inside-avoid ms:mb-4 md:mb-5 xl:mb-6 [perspective:1400px]"
                >
                  <div
                    className="relative h-auto rounded-[16px] sm:rounded-[20px] border border-border/55 transition-all duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] group-hover:-translate-y-1 group-hover:border-border/80 group-hover:shadow-[0_20px_32px_rgba(0,0,0,0.3)]"
                    style={{
                      aspectRatio: `${displayedAspectRatio} / 1`,
                    }}
                  >
                    <div className="absolute inset-0 overflow-hidden rounded-[16px] sm:rounded-[20px] [backface-visibility:hidden] bg-card/18">
                      <div className="h-full w-full overflow-hidden rounded-[16px] sm:rounded-[20px] border border-border/60 bg-secondary/30">
                        <SkeletonImage
                          src={item.image}
                          alt={item.title}
                          onMetadata={(width, height) => {
                            setGalleryImageDims((current) => {
                              if (current[item.id]?.width === width && current[item.id]?.height === height) {
                                return current;
                              }
                              return { ...current, [item.id]: { width, height } };
                            });
                          }}
                          className={`h-full w-full transition-transform duration-500 ${
                            isLandscapeCard
                              ? "object-contain bg-black/35 p-1 sm:p-1.5 group-hover:scale-[1.01]"
                              : "object-cover group-hover:scale-[1.08]"
                          }`}
                        />
                      </div>
                    </div>

                    <div
                      className={`absolute inset-0 min-w-0 overflow-hidden rounded-[16px] sm:rounded-[20px] border border-border/65 bg-[linear-gradient(150deg,rgba(0,0,0,0.78),rgba(17,17,17,0.94))] [backface-visibility:hidden] [transform:rotateY(180deg)] flex flex-col justify-between ${
                        isLandscapeCard ? "p-3 sm:p-4" : "p-4 sm:p-5"
                      }`}
                    >
                      <div className="min-w-0 min-h-0 overflow-hidden">
                        <p className="inline-flex max-w-full rounded-full border border-border/60 px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                          Gallery Detail
                        </p>
                        <h4
                          className={`mt-2.5 sm:mt-3 text-foreground leading-[1.08] tracking-[-0.02em] font-bold break-words overflow-hidden [display:-webkit-box] [-webkit-box-orient:vertical] ${
                            isUltraLandscapeCard
                              ? "text-[16px] sm:text-[18px] [-webkit-line-clamp:2]"
                              : isLandscapeCard
                                ? "text-[18px] sm:text-[20px] [-webkit-line-clamp:2]"
                                : "text-[20px] sm:text-[22px] [-webkit-line-clamp:3]"
                          }`}
                        >
                          {item.title}
                        </h4>
                      </div>
                      <div className="shrink-0 pt-2 sm:pt-2.5">
                        <p className="text-[12px] uppercase tracking-[0.14em] text-muted-foreground">Year</p>
                        <p className="mt-1 text-[16px] sm:text-[18px] text-foreground font-semibold">{item.year}</p>
                      </div>
                    </div>
                  </div>
                </motion.article>
              );
            })()
          ))}
        </motion.div>
      </motion.section>

      <motion.footer
        id="contact"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionReveal}
        className="mx-auto w-full max-w-[1240px] px-4 sm:px-6 md:px-10 lg:px-12 pt-12 sm:pt-14 md:pt-18 lg:pt-22 pb-10 sm:pb-12 md:pb-16 scroll-mt-20"
      >
        <SectionTitle label="Let's get together" />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.6, ease: motionEase }}
          className="relative overflow-hidden rounded-[24px] sm:rounded-[30px] md:rounded-[34px] border border-white/15 bg-[linear-gradient(145deg,rgba(255,255,255,0.09),rgba(255,255,255,0.02)),linear-gradient(180deg,rgba(0,0,0,0.76),rgba(0,0,0,0.9))] p-4 sm:p-6 md:p-8 lg:p-10 backdrop-blur-xl"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(255,255,255,0.14)_0,transparent_42%),radial-gradient(circle_at_80%_72%,rgba(255,255,255,0.08)_0,transparent_40%)]" />
          <div className="pointer-events-none absolute inset-0 opacity-30 mix-blend-screen bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.24)_0.7px,transparent_0.9px)] bg-[size:3px_3px]" />

          <div className="relative grid gap-4 sm:gap-5 md:gap-6 lg:grid-cols-12">
            <div className="lg:col-span-7 rounded-[18px] sm:rounded-[22px] border border-white/15 bg-white/[0.03] p-4 sm:p-5 md:p-6 lg:p-7">
              <p className="inline-flex w-full sm:w-auto items-center justify-center text-center rounded-full border border-white/20 bg-black/35 px-2.5 sm:px-3 py-1 text-[9px] sm:text-[10px] md:text-[11px] leading-tight uppercase tracking-[0.14em] sm:tracking-[0.18em] text-white/80">
                Available for freelance + full-time
              </p>

              <h3 className="mt-4 text-foreground text-[25px] sm:text-[34px] md:text-[42px] lg:text-[52px] leading-[0.94] tracking-[-0.045em] font-black text-balance">
                Have an idea? Let's turn it into a visual story people remember.
              </h3>

              <p className="mt-3.5 max-w-[56ch] text-[14px] sm:text-[15px] md:text-[17px] leading-[1.45] text-white/74">
                Share the brief, timeline, and platform. I will reply quickly with a practical direction and a clean execution plan.
              </p>

              <div className="mt-5 sm:mt-6 grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 max-w-[560px]">
                <a
                  href="mailto:abirmediagroup@gmail.com"
                  className="inline-flex w-full items-center justify-center rounded-full border border-white/80 bg-white px-5 py-3 text-[14px] md:text-[15px] font-semibold text-black transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/90 hover:shadow-[0_12px_24px_rgba(0,0,0,0.34)]"
                >
                  Start a project
                </a>
                <a
                  href="/AbirMahanta_Resume.pdf"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex w-full items-center justify-center rounded-full border border-white/30 bg-white/[0.05] px-5 py-3 text-[14px] md:text-[15px] text-white transition-colors hover:border-white/55 hover:bg-white/[0.12]"
                >
                  View resume
                </a>
              </div>

              <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] sm:text-[12px] tracking-[0.04em] text-white/70">
                <span className="rounded-full border border-white/15 bg-black/30 px-3 py-1.5 text-center">Branding</span>
                <span className="rounded-full border border-white/15 bg-black/30 px-3 py-1.5 text-center">Social Creative</span>
                <span className="rounded-full border border-white/15 bg-black/30 px-3 py-1.5 text-center col-span-2 sm:col-span-1">UI/UX Systems</span>
              </div>
            </div>

            <div className="lg:col-span-5 rounded-[18px] sm:rounded-[22px] border border-white/15 bg-black/35 p-4 sm:p-5 md:p-6 backdrop-blur-md">
              <p className="text-[11px] uppercase tracking-[0.18em] text-white/70">Connect</p>
              <div className="mt-3 grid grid-cols-1 gap-2.5 text-[14px] md:text-[15px]">
                <a
                  href="mailto:abirmediagroup@gmail.com"
                  className="rounded-[12px] border border-white/20 bg-white/[0.04] px-3.5 py-3 text-white transition-colors hover:border-white/45 hover:bg-white/[0.1] break-words"
                >
                  abirmediagroup@gmail.com
                </a>
                <a
                  href="https://www.linkedin.com/in/itsmeabirmohanta"
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-[12px] border border-white/20 bg-white/[0.04] px-3.5 py-3 text-white/85 transition-colors hover:border-white/45 hover:bg-white/[0.1] hover:text-white"
                >
                  LinkedIn
                </a>
                <a
                  href="https://abirmohanta.super.site/"
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-[12px] border border-white/20 bg-white/[0.04] px-3.5 py-3 text-white/85 transition-colors hover:border-white/45 hover:bg-white/[0.1] hover:text-white"
                >
                  Portfolio archive
                </a>
              </div>

              <div className="mt-4 sm:mt-5 rounded-[14px] border border-white/15 bg-black/45 px-3.5 py-3">
                <p className="text-[10px] uppercase tracking-[0.16em] text-white/60">Response window</p>
                <p className="mt-1.5 text-[14px] sm:text-[15px] text-white">Usually within 24 hours</p>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2">
                <div className="rounded-[12px] border border-white/15 bg-black/30 px-3 py-2.5">
                  <p className="text-[10px] uppercase tracking-[0.14em] text-white/60">Location</p>
                  <p className="mt-1 text-[13px] text-white/85">India</p>
                </div>
                <div className="rounded-[12px] border border-white/15 bg-black/30 px-3 py-2.5">
                  <p className="text-[10px] uppercase tracking-[0.14em] text-white/60">Timezone</p>
                  <p className="mt-1 text-[13px] text-white/85">IST (UTC+5:30)</p>
                </div>
              </div>
            </div>
          </div>

          <p className="relative mt-5 sm:mt-6 md:mt-7 text-[11px] md:text-[13px] text-white/58">
            © 2026 Abir Mahanta. All rights reserved.
          </p>
        </motion.div>
      </motion.footer>
    </>
  );
};

export default PortfolioContent;
