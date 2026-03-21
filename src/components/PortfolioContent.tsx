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
        viewport={{ once: true, amount: 0.16 }}
        variants={sectionReveal}
        className="relative mx-auto w-full max-w-[1240px] px-4 sm:px-6 md:px-10 lg:px-12 pt-10 sm:pt-12 md:pt-16 lg:pt-20 overflow-hidden scroll-mt-20"
      >
        <motion.div
          style={{ y: featuredGlowLeftY }}
          className="pointer-events-none absolute -left-20 top-20 h-48 w-48 rounded-full bg-accent/10 blur-3xl animate-pulse-soft"
        />
        <motion.div
          style={{ y: featuredGlowRightY }}
          className="pointer-events-none absolute -right-16 top-1/3 h-56 w-56 rounded-full bg-secondary/40 blur-3xl animate-drift-y"
        />
        <SectionTitle label="Featured work" />

        {isFeaturedLoading ? (
          <p className="mb-6 text-sm text-muted-foreground">Loading featured projects...</p>
        ) : null}
        {isFeaturedError ? (
          <p className="mb-6 text-sm text-destructive">Unable to load featured projects right now.</p>
        ) : null}

        <div className="grid gap-4 md:gap-5 lg:gap-6">
          {featuredProjects.map((project, index) => (
            <motion.article
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.28 }}
              variants={cardReveal}
              custom={index}
              key={project.id}
              className="group relative grid gap-4 sm:gap-5 md:grid-cols-12 rounded-[20px] sm:rounded-[24px] border border-border/55 bg-card/18 p-4 sm:p-5 md:p-7 lg:p-8 transition-all duration-400 hover:-translate-y-1 hover:border-border/85 hover:bg-card/35 hover:shadow-[0_22px_42px_rgba(0,0,0,0.3)]"
            >
              <div className="pointer-events-none absolute inset-0 rounded-[24px] bg-[radial-gradient(circle_at_20%_0%,rgba(255,255,255,0.08),transparent_55%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

              <div className={`${index % 2 === 1 ? "md:col-span-7 md:order-2" : "md:col-span-7"} relative`}>
                <div className="mb-4 flex items-center gap-2">
                  <span className="rounded-full border border-border/70 px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                    Featured Project
                  </span>
                  <span className="h-px flex-1 bg-border/60" />
                </div>
                <h3 className="text-foreground text-[22px] sm:text-[32px] md:text-[44px] lg:text-[50px] leading-[1] sm:leading-[0.95] md:leading-[0.9] tracking-[-0.047em] font-black">
                  {project.title}
                </h3>
                <p className="mt-2.5 sm:mt-3.5 text-muted-foreground text-[14px] sm:text-[16px] md:text-[20px] leading-[1.4] sm:leading-[1.36] md:leading-[1.32] max-w-[54ch]">
                  {project.description}
                </p>
                <div className="mt-5 flex flex-wrap items-center gap-2.5 text-[12px] sm:text-[13px] md:text-sm">
                  <a
                    href={project.prototypeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center text-center rounded-full border border-border/70 px-3.5 py-1.5 text-muted-foreground transition-colors hover:border-foreground/60 hover:text-foreground"
                  >
                    View prototype
                  </a>
                </div>
              </div>

              <div className={`${index % 2 === 1 ? "md:col-span-5 md:order-1" : "md:col-span-5"} project-media relative rounded-[16px] sm:rounded-[18px] overflow-hidden border border-border/60 h-[200px] sm:h-[240px] md:h-[280px] lg:h-[300px]`}>
                <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-background/35 via-transparent to-transparent" />
                <SkeletonImage
                  src={project.image}
                  alt={project.title}
                  priority={index === 0}
                  className="w-full h-full object-cover group-hover:scale-105"
                />
              </div>
            </motion.article>
          ))}
        </div>
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

              <div className="relative mb-3 flex items-center gap-2">
                <span className="rounded-full border border-border/70 px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                  YouTube
                </span>
                <span className="h-px flex-1 bg-border/60" />
              </div>

              <h4 className="relative text-foreground text-[18px] sm:text-[20px] leading-[1.06] tracking-[-0.03em] font-bold">
                {video.title}
              </h4>

              {video.description ? (
                <p className="relative mt-2 text-[12px] sm:text-[13px] leading-[1.45] text-muted-foreground">
                  {video.description.length > 170
                    ? `${video.description.slice(0, 170).trim()}...`
                    : video.description}
                </p>
              ) : null}

              <div className="relative mt-3 overflow-hidden rounded-[14px] border border-border/60 bg-black/40 aspect-video">
                <iframe
                  src={video.embedUrl}
                  title={video.title}
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                  className="h-full w-full"
                />
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
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5"
        >
          {galleryItems.map((item, index) => (
            (() => {
              const dims = galleryImageDims[item.id];
              const aspectRatio = dims ? dims.width / dims.height : 1.2;

              return (
                <motion.article
                  initial={false}
                  whileInView="show"
                  viewport={{ once: true, amount: 0.25 }}
                  variants={cardReveal}
                  custom={index}
                  key={item.id}
                  className="group [perspective:1400px]"
                >
                  <div
                    className="relative h-auto rounded-[16px] sm:rounded-[20px] border border-border/55 transition-all duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] group-hover:-translate-y-1 group-hover:border-border/80 group-hover:shadow-[0_20px_32px_rgba(0,0,0,0.3)]"
                    style={{
                      aspectRatio: `${aspectRatio} / 1`,
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
                          className="h-full w-full object-cover group-hover:scale-[1.08]"
                        />
                      </div>
                    </div>

                    <div className="absolute inset-0 rounded-[16px] sm:rounded-[20px] border border-border/65 bg-[linear-gradient(150deg,rgba(0,0,0,0.78),rgba(17,17,17,0.94))] p-4 sm:p-5 [backface-visibility:hidden] [transform:rotateY(180deg)] flex flex-col justify-between">
                      <div>
                        <p className="inline-flex rounded-full border border-border/60 px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                          Gallery Detail
                        </p>
                        <h4 className="mt-3 text-foreground text-[20px] sm:text-[22px] leading-[1.05] tracking-[-0.03em] font-bold">
                          {item.title}
                        </h4>
                      </div>
                      <div>
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
                  className="rounded-[12px] border border-white/20 bg-white/[0.04] px-3.5 py-3 text-white transition-colors hover:border-white/45 hover:bg-white/[0.1]"
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
