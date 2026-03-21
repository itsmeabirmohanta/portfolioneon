import { useEffect, useRef, useState } from "react";

type CursorMode = "default" | "link" | "button" | "media" | "text" | "card" | "input";

const MODE_LABELS: Record<CursorMode, string> = {
  default: "glide",
  link: "jump",
  button: "tap",
  media: "view",
  text: "read",
  card: "focus",
  input: "type",
};

const getCursorMode = (target: EventTarget | null): CursorMode => {
  if (!(target instanceof Element)) {
    return "default";
  }

  const customCursorElement = target.closest("[data-cursor]");
  const customCursor = customCursorElement?.getAttribute("data-cursor");
  if (customCursor === "link" || customCursor === "button" || customCursor === "media" || customCursor === "text" || customCursor === "card" || customCursor === "input") {
    return customCursor;
  }

  if (target.closest("input, textarea, select, [contenteditable='true']")) {
    return "input";
  }

  if (target.closest("a[href]")) {
    return "link";
  }

  if (target.closest("button, [role='button'], [type='button'], [type='submit'], [type='reset']")) {
    return "button";
  }

  if (target.closest("img, video, canvas, svg, .project-media")) {
    return "media";
  }

  if (target.closest("article, .card, [class*='card'], .group")) {
    return "card";
  }

  if (target.closest("h1, h2, h3, h4, h5, h6, p, li, blockquote")) {
    return "text";
  }

  return "default";
};

const FunCursor = () => {
  const [enabled, setEnabled] = useState(false);
  const [mode, setMode] = useState<CursorMode>("default");
  const [visible, setVisible] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  const ringRef = useRef<HTMLDivElement | null>(null);
  const dotRef = useRef<HTMLDivElement | null>(null);
  const labelRef = useRef<HTMLDivElement | null>(null);
  const sparkRef = useRef<HTMLDivElement | null>(null);
  const clickTimeoutRef = useRef<number | undefined>(undefined);
  const currentModeRef = useRef<CursorMode>("default");

  useEffect(() => {
    const mediaQuery = window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    const updateEnabled = () => setEnabled(mediaQuery.matches);

    updateEnabled();
    mediaQuery.addEventListener("change", updateEnabled);

    return () => {
      mediaQuery.removeEventListener("change", updateEnabled);
    };
  }, []);

  useEffect(() => {
    if (!enabled) {
      document.body.classList.remove("custom-cursor-enabled");
      return;
    }

    document.body.classList.add("custom-cursor-enabled");

    const current = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const target = { x: current.x, y: current.y };
    let rafId = 0;

    const animate = () => {
      current.x += (target.x - current.x) * 0.22;
      current.y += (target.y - current.y) * 0.22;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${current.x}px, ${current.y}px, 0) translate(-50%, -50%)`;
      }

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${target.x}px, ${target.y}px, 0) translate(-50%, -50%)`;
      }

      if (labelRef.current) {
        labelRef.current.style.transform = `translate3d(${current.x + 16}px, ${current.y + 16}px, 0)`;
      }

      if (sparkRef.current) {
        sparkRef.current.style.transform = `translate3d(${current.x}px, ${current.y}px, 0) translate(-50%, -50%)`;
      }

      rafId = window.requestAnimationFrame(animate);
    };

    const handleMove = (event: PointerEvent) => {
      target.x = event.clientX;
      target.y = event.clientY;
      setVisible((previous) => (previous ? previous : true));
    };

    const handleOver = (event: PointerEvent) => {
      const nextMode = getCursorMode(event.target);
      if (currentModeRef.current !== nextMode) {
        currentModeRef.current = nextMode;
        setMode(nextMode);
      }
    };

    const handleLeave = () => {
      setVisible(false);
      currentModeRef.current = "default";
      setMode("default");
    };

    const handleDown = () => {
      setIsClicking(true);
      if (clickTimeoutRef.current) {
        window.clearTimeout(clickTimeoutRef.current);
      }
      clickTimeoutRef.current = window.setTimeout(() => setIsClicking(false), 180);
    };

    const handleUp = () => {
      setIsClicking(false);
    };

    window.addEventListener("pointermove", handleMove, { passive: true });
    window.addEventListener("pointerover", handleOver, { passive: true });
    window.addEventListener("pointerleave", handleLeave);
    window.addEventListener("blur", handleLeave);
    window.addEventListener("pointerdown", handleDown, { passive: true });
    window.addEventListener("pointerup", handleUp, { passive: true });

    rafId = window.requestAnimationFrame(animate);

    return () => {
      document.body.classList.remove("custom-cursor-enabled");
      window.cancelAnimationFrame(rafId);
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerover", handleOver);
      window.removeEventListener("pointerleave", handleLeave);
      window.removeEventListener("blur", handleLeave);
      window.removeEventListener("pointerdown", handleDown);
      window.removeEventListener("pointerup", handleUp);
      if (clickTimeoutRef.current) {
        window.clearTimeout(clickTimeoutRef.current);
      }
    };
  }, [enabled]);

  if (!enabled) {
    return null;
  }

  return (
    <div className={`fun-cursor ${visible ? "is-visible" : "is-hidden"} mode-${mode} ${isClicking ? "is-clicking" : ""}`} aria-hidden="true">
      <div ref={ringRef} className="fun-cursor-ring" />
      <div ref={dotRef} className="fun-cursor-dot" />
      <div ref={labelRef} className="fun-cursor-label">
        {MODE_LABELS[mode]}
      </div>
      <div ref={sparkRef} className="fun-cursor-spark" />
    </div>
  );
};

export default FunCursor;