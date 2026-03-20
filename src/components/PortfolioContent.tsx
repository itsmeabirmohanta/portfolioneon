import { motion, useScroll, useTransform } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { fetchFeaturedProjects, fetchGalleryItems } from "@/lib/portfolio-api";

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
};

const SkeletonImage = ({ src, alt, className, priority = false }: SkeletonImageProps) => {
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
        onLoad={() => setIsLoaded(true)}
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
  const galleryRef = useRef<HTMLElement | null>(null);

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

  const { scrollYProgress: featuredProgress } = useScroll({
    target: featuredRef,
    offset: ["start end", "end start"],
  });
  const { scrollYProgress: galleryProgress } = useScroll({
    target: galleryRef,
    offset: ["start end", "end start"],
  });

  const featuredParallaxY = useTransform(featuredProgress, [0, 1], [26, -26]);
  const featuredGlowLeftY = useTransform(featuredProgress, [0, 1], [0, -44]);
  const featuredGlowRightY = useTransform(featuredProgress, [0, 1], [0, 54]);
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
                    href={project.caseStudyUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-border/70 px-3.5 py-1.5 text-foreground transition-colors hover:border-foreground/70 hover:bg-foreground hover:text-background"
                  >
                    Read case study
                  </a>
                  <a
                    href={project.prototypeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-border/70 px-3.5 py-1.5 text-muted-foreground transition-colors hover:border-foreground/60 hover:text-foreground"
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
            <motion.article
              initial={false}
              whileInView="show"
              viewport={{ once: true, amount: 0.25 }}
              variants={cardReveal}
              custom={index}
              key={item.id}
              className="group rounded-[16px] sm:rounded-[20px] border border-border/55 bg-card/18 p-3 sm:p-3.5 md:p-4 transition-all duration-300 hover:-translate-y-1 hover:border-border/80 hover:bg-card/35 hover:shadow-[0_18px_30px_rgba(0,0,0,0.26)]"
            >
              <div className="overflow-hidden rounded-[14px] border border-border/60 bg-secondary/30">
                <SkeletonImage
                  src={item.image}
                  alt={item.title}
                  className="h-[220px] md:h-[250px] w-full object-cover group-hover:scale-[1.07]"
                />
              </div>
              <h4 className="mt-3 text-foreground text-[19px] sm:text-[21px] leading-[1.05] tracking-[-0.03em] font-bold">
                {item.title}
              </h4>
              <p className="mt-1.5 text-muted-foreground text-[13px] sm:text-sm">{item.year}</p>
            </motion.article>
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
          className="relative overflow-hidden rounded-[24px] sm:rounded-[28px] border border-border/65 bg-gradient-to-br from-card/45 via-card/28 to-secondary/35 p-5 sm:p-7 md:p-9"
        >
          <div className="pointer-events-none absolute -left-24 -top-24 h-60 w-60 rounded-full bg-accent/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-28 right-0 h-72 w-72 rounded-full bg-secondary/55 blur-3xl" />
          <div className="relative grid gap-6 md:gap-8 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <p className="inline-flex items-center rounded-full border border-border/70 bg-background/40 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                Available for freelance + full-time
              </p>
              <h3 className="mt-4 text-foreground text-[28px] sm:text-[36px] md:text-[46px] lg:text-[54px] leading-[0.94] tracking-[-0.045em] font-black">
                Have an idea? Let's turn it into a visual story people remember.
              </h3>
              <p className="mt-4 max-w-[58ch] text-[14px] sm:text-[16px] md:text-[18px] leading-[1.45] text-muted-foreground">
                Share the brief, timeline, and platform. I will reply quickly with a practical direction and a clean execution plan.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <a
                  href="mailto:abirmediagroup@gmail.com"
                  className="inline-flex items-center rounded-full border border-foreground/90 bg-foreground px-5 py-2.5 text-[14px] md:text-[15px] font-semibold text-background transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_24px_rgba(0,0,0,0.28)]"
                >
                  Start a project
                </a>
                <a
                  href="/AbirMahanta_Resume.pdf"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center rounded-full border border-border/80 bg-background/40 px-5 py-2.5 text-[14px] md:text-[15px] text-foreground transition-colors hover:border-foreground/70 hover:bg-background/75"
                >
                  View resume
                </a>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-[18px] border border-border/65 bg-background/45 p-4 sm:p-5 backdrop-blur-sm">
                <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Connect</p>
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5 text-[14px] md:text-[15px]">
                  <a
                    href="mailto:abirmediagroup@gmail.com"
                    className="rounded-[12px] border border-border/70 bg-card/55 px-3.5 py-2.5 text-foreground transition-colors hover:border-foreground/60"
                  >
                    abirmediagroup@gmail.com
                  </a>
                  <a
                    href="https://www.linkedin.com/in/itsmeabirmohanta"
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-[12px] border border-border/70 bg-card/55 px-3.5 py-2.5 text-muted-foreground transition-colors hover:border-foreground/60 hover:text-foreground"
                  >
                    LinkedIn
                  </a>
                  <a
                    href="https://abirmahanta.super.site"
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-[12px] border border-border/70 bg-card/55 px-3.5 py-2.5 text-muted-foreground transition-colors hover:border-foreground/60 hover:text-foreground"
                  >
                    Portfolio archive
                  </a>
                </div>
              </div>
            </div>
          </div>

          <p className="relative mt-7 text-xs md:text-[13px] text-muted-foreground">© 2026 Abir Mahanta. All rights reserved.</p>
        </motion.div>
      </motion.footer>
    </>
  );
};

export default PortfolioContent;
