import { useEffect, useState } from "react";
import heroCloseup from "@/assets/hero-closeup.jpg";

const sectionAnchors = [
  { id: "featured", label: "Featured" },
  { id: "gallery", label: "Gallery" },
  { id: "contact", label: "Contact" },
];

/* ── Pink Starburst ── */
const Starburst = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={className} fill="hsl(330, 100%, 65%)">
    {Array.from({ length: 20 }).map((_, i) => (
      <polygon key={i} points="50,50 47,0 53,0" transform={`rotate(${i * 18} 50 50)`} />
    ))}
  </svg>
);

/* ── Play Button (iridescent) ── */
const PlayButton = () => (
  <div
    className="w-8 h-8 sm:w-10 sm:h-10 md:w-11 md:h-11 lg:w-[58px] lg:h-[58px] rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6"
    style={{
      background: "linear-gradient(140deg, rgba(255,255,255,0.95), rgba(223,230,255,0.78), rgba(198,214,255,0.58))",
    }}
  >
    <svg viewBox="0 0 24 24" fill="hsl(0,0%,4%)" className="w-3 h-3 sm:w-4 sm:h-4 md:w-4 md:h-4 lg:w-5 lg:h-5 ml-0.5 transition-transform duration-300 group-hover:translate-x-0.5">
      <polygon points="6,3 20,12 6,21" />
    </svg>
  </div>
);

/* ── Spiky Circle (outline spikes) ── */
const SpikyCircle = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  const spikes = 24;
  const outerR = 50;
  const innerR = 34;
  const points = Array.from({ length: spikes * 2 })
    .map((_, i) => {
      const angle = (Math.PI * 2 * i) / (spikes * 2);
      const r = i % 2 === 0 ? outerR : innerR;
      return `${50 + r * Math.cos(angle)},${50 + r * Math.sin(angle)}`;
    })
    .join(" ");

  return (
    <div className={`relative group ${className}`}>
      <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full transition-transform duration-500 group-hover:rotate-[14deg]">
        <polygon points={points} fill="none" stroke="hsl(0,0%,25%)" strokeWidth="0.8" />
      </svg>
      <div className="absolute inset-[18%] rounded-full overflow-hidden transition-transform duration-500 group-hover:scale-105">
        {children}
      </div>
    </div>
  );
};

/* ── YouTube Recap Card ── */
const YouTubeCard = () => {
  return (
    <a href="https://youtube.com/playlist?list=LRYRGhlvsSk8oM2gEzuuyCyYrzeWhFeyV1ThU&si=SZx6xki6dapLiEl3" target="_blank" rel="noopener noreferrer" className="group w-[188px] sm:w-[210px] lg:w-[268px] xl:w-[286px] rounded-[14px] sm:rounded-[22px] border border-border/55 bg-card/50 p-2 sm:p-4 lg:p-5 transition-all duration-400 hover:-translate-y-1.5 hover:border-border hover:bg-card/70 hover:shadow-[0_18px_30px_rgba(0,0,0,0.32)] inline-block">
      <div className="flex sm:flex-col items-center sm:items-start gap-2 sm:gap-0">
        {/* Image */}
        <div className="relative w-[58px] h-[58px] sm:w-[98px] sm:h-[98px] lg:w-[104px] lg:h-[104px] flex-shrink-0 rounded-[10px] sm:rounded-2xl overflow-hidden border border-border/60">
          <img src="/YEARLY_REVIEW_2025_V2_544x544.png" alt="2025 recap artwork" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
        </div>
        {/* Text */}
        <div className="flex-1 min-w-0 sm:flex-none sm:mt-3 lg:mt-4 flex flex-col justify-center sm:justify-start">
          <p className="text-foreground text-[16px] sm:text-[28px] lg:text-[30px] leading-none font-black tracking-tight">'25</p>
          <p className="text-foreground font-semibold text-[12px] sm:text-[28px] lg:text-[30px] leading-tight tracking-tight sm:leading-none whitespace-nowrap">YouTube Recap</p>
          <p className="text-muted-foreground text-[10px] sm:text-[13px] lg:text-sm leading-relaxed mt-1.5 sm:mt-2 lg:mt-3 hidden sm:block">
            Good vibes, relaxation &<br />groovy tempos
          </p>
        </div>
      </div>
    </a>
  );
};

const HoverVideoCard = () => {
  return (
    <div
      className="group hidden md:block absolute right-6 lg:right-16 xl:right-[95px] top-[8px] lg:top-[6px] w-[125px] lg:w-[165px] xl:w-[180px] h-[158px] lg:h-[208px] xl:h-[225px] rounded-[26px] overflow-hidden z-20 animate-hero-fade-up-delayed border border-border/45 transition-transform duration-500 hover:translate-y-1 hover:rotate-[1.8deg] hover:scale-[1.02]"
    >
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      >
        <source src="/Graphic_Designer_s_Portfolio_Intro_Video.mp4" type="video/mp4" />
      </video>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/20 to-transparent opacity-70 transition-opacity duration-300 group-hover:opacity-30" />
    </div>
  );
};

/* ── Hero Section ── */
const HeroSection = () => {
  const [activeSection, setActiveSection] = useState("featured");

  useEffect(() => {
    const sections = sectionAnchors
      .map((anchor) => document.getElementById(anchor.id))
      .filter((section): section is HTMLElement => section !== null);

    if (sections.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visibleEntries.length > 0) {
          setActiveSection(visibleEntries[0].target.id);
        }
      },
      { threshold: [0.25, 0.45, 0.65], rootMargin: "-30% 0px -45% 0px" },
    );

    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
      observer.disconnect();
    };
  }, []);

  return (
    <section className="relative min-h-[90vh] lg:min-h-[92vh] overflow-x-clip overflow-y-hidden">
      <div className="mx-auto w-full max-w-[1300px] px-4 sm:px-6 md:px-10 lg:px-12 py-5 sm:py-6 md:py-7 lg:py-7">
        {/* Top name */}
        <p className="text-foreground text-center font-bold text-[20px] sm:text-[26px] md:text-[28px] lg:text-[34px] tracking-[-0.04em] leading-none animate-hero-fade-up">
          abir mahanta
        </p>

        <div className="mt-4 sm:mt-5 md:mt-6 flex flex-row justify-center gap-1.5 sm:gap-2 md:gap-2.5 lg:gap-3 flex-nowrap animate-hero-fade-up-delayed overflow-x-auto px-2 -mx-2 scrollbar-hide">
          {sectionAnchors.map((anchor) => {
            const isActive = activeSection === anchor.id;

            return (
              <a
                key={anchor.id}
                href={`#${anchor.id}`}
                onClick={() => setActiveSection(anchor.id)}
                className={`rounded-full border px-3 sm:px-3.5 md:px-4 py-0.5 sm:py-1 md:py-1.5 text-[10px] sm:text-[11px] md:text-[12px] lg:text-[13px] tracking-[0.08em] uppercase transition-all duration-300 whitespace-nowrap flex-shrink-0 font-medium flex items-center justify-center h-[24px] sm:h-[30px] md:h-auto ${
                  isActive
                    ? "border-foreground/90 bg-foreground text-background shadow-[0_2px_8px_rgba(255,255,255,0.1)]"
                    : "border-border/60 text-muted-foreground hover:border-foreground/70 hover:text-foreground hover:bg-foreground/5"
                }`}
              >
                {anchor.label}
              </a>
            );
          })}
        </div>

        <div className="relative mt-10 sm:mt-12 md:mt-12 lg:mt-14">
          {/* Top collage images */}
          <div className="hidden md:grid absolute left-2 lg:left-14 xl:left-[92px] top-[16px] lg:top-[20px] z-0 grid-cols-1 gap-2 w-[220px] lg:w-[280px] xl:w-[300px] h-[130px] lg:h-[162px] xl:h-[175px] rounded-[24px] overflow-hidden animate-hero-fade-up-delayed transition-transform duration-500 hover:-rotate-[2.4deg] hover:scale-[1.03]">
            <div className="rounded-[20px] overflow-hidden">
              <img src="/IMG_6754.png" alt="Abir with event guest" className="w-full h-full object-cover object-[center_22%] transition-transform duration-500 hover:scale-110" />
            </div>
          </div>

          <HoverVideoCard />

          {/* Headline */}
          <div className="relative z-10 flex flex-col items-center animate-hero-fade-up-slow">
            <h1 className="text-foreground font-black text-[48px] sm:text-[76px] md:text-[116px] lg:text-[138px] xl:text-[152px] leading-[0.88] tracking-[-0.05em] text-center select-none transition-all duration-500 hover:tracking-[-0.045em]">
              Design
            </h1>

            <Starburst className="absolute left-[20%] sm:left-[26%] md:left-[26%] lg:left-[29.5%] top-[20px] sm:top-[60px] md:top-[122px] lg:top-[148px] w-[52px] h-[52px] sm:w-[66px] sm:h-[66px] md:w-[90px] md:h-[90px] lg:w-[106px] lg:h-[106px] z-30 animate-hero-spin-slow transition-transform duration-500 hover:scale-110" />

            <div className="mt-1.5 sm:mt-2 md:mt-1 lg:mt-0 flex items-center gap-1.5 sm:gap-2.5 lg:gap-5">
              <span className="text-foreground font-black text-[48px] sm:text-[76px] md:text-[116px] lg:text-[138px] xl:text-[152px] leading-[0.82] tracking-[-0.05em] select-none">
                &
              </span>

              <div className="hero-pill group flex items-center gap-2 sm:gap-2.5 lg:gap-5 rounded-full border border-border/55 bg-card/20 px-3.5 sm:px-5 md:px-9 lg:px-13 py-2 sm:py-2.5 lg:py-3.5 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)] transition-all duration-400 hover:border-muted-foreground/50 hover:bg-card/35 hover:shadow-[0_16px_28px_rgba(0,0,0,0.35),inset_0_0_0_1px_rgba(255,255,255,0.08)]">
                <span className="text-foreground font-black text-[48px] sm:text-[76px] md:text-[116px] lg:text-[138px] xl:text-[152px] leading-[0.82] tracking-[-0.05em] select-none">
                  Chill
                </span>
                <PlayButton />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom content */}
        <div className="mt-6 sm:mt-8 md:mt-3 lg:mt-4 pb-8 sm:pb-10 md:pb-12 lg:pb-10 animate-hero-fade-up-slow">
          <div className="flex flex-col md:grid md:grid-cols-[minmax(190px,224px)_minmax(300px,1fr)_minmax(210px,260px)] gap-6 sm:gap-8 md:gap-7 lg:gap-8 items-center md:items-end">
            {/* Left: YouTube Recap Card */}
            <div className="flex justify-center md:justify-start w-full md:w-auto">
              <YouTubeCard />
            </div>

            {/* Center: Bio text */}
            <div className="flex items-center justify-center w-full md:w-auto md:-translate-y-10 lg:-translate-y-14">
              <div className="text-center max-w-[560px] px-2 sm:px-4 md:px-0">
                <p className="text-muted-foreground text-[16px] sm:text-[18px] md:text-[21px] lg:text-[24px] leading-[1.4] sm:leading-[1.32] lg:leading-[1.26] tracking-[-0.01em]">
                  Hi, I'm Abir, a designer and developer working at the intersection of visual design and product thinking.
                </p>
                <p className="text-muted-foreground text-[16px] sm:text-[18px] md:text-[21px] lg:text-[24px] leading-[1.4] sm:leading-[1.32] lg:leading-[1.26] tracking-[-0.01em] mt-2.5 sm:mt-3 md:mt-3 lg:mt-4">
                  I create brand systems, social campaigns, and UI/UX products like CPU Simulator, focusing on usability, clarity, and real-world impact.
                </p>
              </div>
            </div>

            {/* Right: Spiky portrait */}
            <div className="flex justify-center md:justify-end w-full md:w-auto">
              <SpikyCircle className="w-[180px] h-[180px] sm:w-[200px] sm:h-[200px] lg:w-[248px] lg:h-[248px]">
                <img src="/Abir%20Mahanta%20-%20profiel.png" alt="Abir portrait" className="w-full h-full object-cover object-top transition-transform duration-500 hover:scale-110" />
              </SpikyCircle>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
