import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import HeroSection from "@/components/HeroSection";
import PortfolioContent from "@/components/PortfolioContent";
import SiteLoader from "@/components/SiteLoader";

const Index = () => {
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    let minDurationTimer = 0;
    let fallbackTimer = 0;

    const hideLoader = () => {
      minDurationTimer = window.setTimeout(() => {
        setShowLoader(false);
      }, 700);
    };

    if (document.readyState === "complete") {
      hideLoader();
    } else {
      window.addEventListener("load", hideLoader, { once: true });
    }

    fallbackTimer = window.setTimeout(() => {
      setShowLoader(false);
    }, 2600);

    return () => {
      window.removeEventListener("load", hideLoader);
      window.clearTimeout(minDurationTimer);
      window.clearTimeout(fallbackTimer);
    };
  }, []);

  return (
    <main className="bg-background min-h-screen">
      <AnimatePresence>{showLoader ? <SiteLoader /> : null}</AnimatePresence>
      <div className={showLoader ? "pointer-events-none" : ""}>
        <HeroSection />
        <PortfolioContent />
      </div>
    </main>
  );
};

export default Index;
