import { useEffect, useState } from "react";
import heroPainting from "@/assets/hero-painting.jpg";
import heroCloseup from "@/assets/hero-closeup.jpg";
import youtubeRecap from "@/assets/youtube-recap.jpg";
import heroPortrait from "@/assets/hero-portrait.jpg";

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
    className="w-10 h-10 sm:w-11 sm:h-11 lg:w-[58px] lg:h-[58px] rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6"
    style={{
      background: "linear-gradient(140deg, rgba(255,255,255,0.95), rgba(223,230,255,0.78), rgba(198,214,255,0.58))",
    }}
  >
    <svg viewBox="0 0 24 24" fill="hsl(0,0%,4%)" className="w-4 h-4 lg:w-5 lg:h-5 ml-0.5 transition-transform duration-300 group-hover:translate-x-0.5">
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
    <div className="group w-[210px] lg:w-[224px] rounded-[22px] border border-border/55 bg-card/50 p-4 lg:p-5 transition-all duration-400 hover:-translate-y-1.5 hover:border-border hover:bg-card/70 hover:shadow-[0_18px_30px_rgba(0,0,0,0.32)]">
      <div className="relative w-[98px] h-[98px] lg:w-[104px] lg:h-[104px] rounded-2xl overflow-hidden border border-border/60">
        <img src={youtubeRecap} alt="YouTube Recap" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
      </div>
      <div className="mt-3.5 lg:mt-4">
        <p className="text-foreground text-[28px] lg:text-[30px] leading-none font-black tracking-tight">'23</p>
        <p className="text-foreground font-semibold text-[28px] lg:text-[30px] leading-none tracking-tight">YouTube Recap</p>
        <p className="text-muted-foreground text-[13px] lg:text-sm leading-relaxed mt-2.5 lg:mt-3">
          Good vibes, relaxation &<br />groovy tempos
        </p>
      </div>
    </div>
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
    <section className="relative min-h-screen bg-background overflow-x-clip overflow-y-hidden">
      <div className="mx-auto w-full max-w-[1300px] px-6 md:px-10 lg:px-12 py-8 md:py-9 lg:py-10">
        {/* Top name */}
        <p className="text-foreground text-center font-bold text-[22px] sm:text-[28px] lg:text-[34px] tracking-[-0.04em] leading-none animate-hero-fade-up">
          abir mahanta
        </p>

        <div className="mt-5 md:mt-6 flex justify-center gap-2.5 sm:gap-3 animate-hero-fade-up-delayed">
          {sectionAnchors.map((anchor) => {
            const isActive = activeSection === anchor.id;

            return (
              <a
                key={anchor.id}
                href={`#${anchor.id}`}
                onClick={() => setActiveSection(anchor.id)}
                className={`rounded-full border px-4 py-1.5 text-[12px] sm:text-[13px] tracking-[0.08em] uppercase transition-all duration-300 ${
                  isActive
                    ? "border-foreground/80 bg-foreground text-background"
                    : "border-border/70 text-muted-foreground hover:border-foreground/60 hover:text-foreground"
                }`}
              >
                {anchor.label}
              </a>
            );
          })}
        </div>

        <div className="relative mt-14 md:mt-16 lg:mt-20">
          {/* Top collage images */}
          <div className="hidden md:grid absolute left-2 lg:left-14 xl:left-[92px] top-[16px] lg:top-[20px] z-0 grid-cols-1 gap-2 w-[220px] lg:w-[280px] xl:w-[300px] h-[130px] lg:h-[162px] xl:h-[175px] rounded-[24px] overflow-hidden animate-hero-fade-up-delayed transition-transform duration-500 hover:-rotate-[2.4deg] hover:scale-[1.03]">
            <div className="rounded-[20px] overflow-hidden">
              <img src={heroPainting} alt="Painting graffiti" className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" />
            </div>
          </div>

          <HoverVideoCard />

          {/* Headline */}
          <div className="relative z-10 flex flex-col items-center animate-hero-fade-up-slow">
            <h1 className="text-foreground font-black text-[64px] sm:text-[92px] md:text-[116px] lg:text-[154px] xl:text-[170px] leading-[0.88] tracking-[-0.05em] text-center select-none transition-all duration-500 hover:tracking-[-0.045em]">
              Design
            </h1>

            <Starburst className="absolute left-[17%] sm:left-[24%] md:left-[26%] lg:left-[29.5%] top-[78px] sm:top-[108px] md:top-[136px] lg:top-[168px] w-[62px] h-[62px] sm:w-[74px] sm:h-[74px] lg:w-[106px] lg:h-[106px] z-30 animate-hero-spin-slow transition-transform duration-500 hover:scale-110" />

            <div className="mt-1 lg:mt-0 flex items-center gap-2.5 sm:gap-3 lg:gap-5">
              <span className="text-foreground font-black text-[64px] sm:text-[92px] md:text-[116px] lg:text-[154px] xl:text-[170px] leading-[0.82] tracking-[-0.05em] select-none">
                &
              </span>

              <div className="hero-pill group flex items-center gap-2.5 sm:gap-3 lg:gap-5 rounded-full border border-border/55 bg-card/20 px-5 sm:px-7 md:px-9 lg:px-13 py-2.5 sm:py-3 lg:py-3.5 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)] transition-all duration-400 hover:border-muted-foreground/50 hover:bg-card/35 hover:shadow-[0_16px_28px_rgba(0,0,0,0.35),inset_0_0_0_1px_rgba(255,255,255,0.08)]">
                <span className="text-foreground font-black text-[64px] sm:text-[92px] md:text-[116px] lg:text-[154px] xl:text-[170px] leading-[0.82] tracking-[-0.05em] select-none">
                  Chill
                </span>
                <PlayButton />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom content */}
        <div className="-mt-3 md:-mt-8 lg:-mt-10 pb-14 md:pb-16 lg:pb-20 animate-hero-fade-up-slow">
          <div className="grid grid-cols-1 md:grid-cols-[minmax(190px,224px)_minmax(300px,1fr)_minmax(210px,260px)] gap-8 md:gap-7 lg:gap-12 items-end">
            {/* Left: YouTube Recap Card */}
            <div className="flex justify-center md:justify-start">
              <YouTubeCard />
            </div>

            {/* Center: Bio text */}
            <div className="flex items-center justify-center -mt-1 md:-mt-7 lg:-mt-10">
              <div className="text-center max-w-[560px] px-2 md:px-0">
                <p className="text-muted-foreground text-[19px] sm:text-[21px] lg:text-[27px] leading-[1.26] tracking-[-0.01em]">
                  Hi! I'm Abir, a Graphic Designer crafting brand visuals, social campaigns, and long-form design systems across digital and print.
                </p>
                <p className="text-muted-foreground text-[19px] sm:text-[21px] lg:text-[27px] leading-[1.26] tracking-[-0.01em] mt-3 lg:mt-6">
                  I also build UI/UX products like CPU Simulator and EDU Revolution.
                </p>
              </div>
            </div>

            {/* Right: Spiky portrait */}
            <div className="flex justify-center md:justify-end">
              <SpikyCircle className="w-[200px] h-[200px] lg:w-[248px] lg:h-[248px]">
                <img src={heroPortrait} alt="Harsha portrait" className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" />
              </SpikyCircle>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
