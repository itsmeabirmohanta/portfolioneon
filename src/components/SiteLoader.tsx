import { motion } from "framer-motion";

const SiteLoader = () => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } }}
      className="fixed inset-0 z-[80] flex items-center justify-center bg-background"
      aria-live="polite"
      aria-label="Website loading"
      role="status"
    >
      <div className="pointer-events-none absolute left-[-8vw] top-[18vh] h-56 w-56 rounded-full bg-accent/16 blur-3xl animate-pulse-soft" />
      <div className="pointer-events-none absolute right-[-6vw] bottom-[14vh] h-64 w-64 rounded-full bg-secondary/70 blur-3xl animate-drift-y" />

      <div className="relative w-[min(88vw,560px)] text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-muted-foreground text-[11px] uppercase tracking-[0.24em]">Loading website</p>
          <h2 className="mt-3 text-foreground text-[46px] sm:text-[64px] leading-[0.86] tracking-[-0.055em] font-black">
            Design
          </h2>
          <div className="mt-1 flex items-center justify-center gap-2">
            <span className="text-foreground text-[40px] sm:text-[54px] leading-none tracking-[-0.045em] font-black">&</span>
            <motion.span
              animate={{ y: [0, -2, 0] }}
              transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
              className="text-foreground text-[40px] sm:text-[54px] leading-none tracking-[-0.045em] font-black"
            >
              Chill
            </motion.span>
          </div>
        </motion.div>

        <div className="mt-10 h-[3px] w-full rounded-full bg-secondary/60 overflow-hidden">
          <motion.div
            initial={{ x: "-70%" }}
            animate={{ x: "170%" }}
            transition={{ repeat: Infinity, duration: 1.05, ease: "easeInOut" }}
            className="h-full w-1/3 rounded-full bg-gradient-to-r from-foreground/0 via-foreground to-foreground/0"
          />
        </div>

        <p className="mt-4 text-[12px] text-muted-foreground tracking-[0.08em]">curating projects and gallery</p>
      </div>
    </motion.div>
  );
};

export default SiteLoader;
