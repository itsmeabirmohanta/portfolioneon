import { useEffect, useState } from "react";

export interface DeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  isWindows: boolean;
  isMac: boolean;
  isLinux: boolean;
  hasTouch: boolean;
  orientation: "portrait" | "landscape";
  devicePixelRatio: number;
  screenWidth: number;
  screenHeight: number;
  isLandscape: boolean;
  isPortrait: boolean;
  isSafari: boolean;
  isChrome: boolean;
  isFirefox: boolean;
  isEdge: boolean;
  supportsWebP: boolean;
  supportsWebM: boolean;
  supportsHEIC: boolean;
  isDarkMode: boolean;
  prefersReducedMotion: boolean;
}

const MOBILE_BREAKPOINT = 640;
const TABLET_BREAKPOINT = 1024;

export function useDeviceInfo(): DeviceInfo {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>(() => getDeviceInfo());

  useEffect(() => {
    const handleResize = () => setDeviceInfo(getDeviceInfo());
    const handleOrientationChange = () => setDeviceInfo(getDeviceInfo());

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleOrientationChange);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleOrientationChange);
    };
  }, []);

  return deviceInfo;
}

function getDeviceInfo(): DeviceInfo {
  const legacyNavigator = navigator as Navigator & { msMaxTouchPoints?: number };
  const userAgent = navigator.userAgent.toLowerCase();
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  const orientation = screenWidth > screenHeight ? "landscape" : "portrait";

  // Platform detection
  const isIOS = /iphone|ipad|ipod/.test(userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const isAndroid = /android/.test(userAgent);
  const isWindows = /win/.test(userAgent);
  const isMac = /mac/.test(userAgent);
  const isLinux = /linux/.test(userAgent);

  // Device type detection
  const isTablet =
    /ipad|android(?!.*mobi)|(android.*tablet)|(up.browser|up.link|mmp|symbian|smartphone|midp|wap|phone|android|netfront)/.test(
      userAgent
    ) && screenWidth >= TABLET_BREAKPOINT - 100;
  const isMobile = screenWidth <= MOBILE_BREAKPOINT || (/mobi|phone/.test(userAgent) && screenWidth < TABLET_BREAKPOINT);
  const isDesktop = !isMobile && !isTablet;

  // Browser detection
  const isSafari = /safari/.test(userAgent) && !/chrome/.test(userAgent);
  const isChrome = /chrome/.test(userAgent);
  const isFirefox = /firefox/.test(userAgent);
  const isEdge = /edg/.test(userAgent);

  // Capability detection
  const hasTouch =
    typeof window !== "undefined" &&
    ("ontouchstart" in window || navigator.maxTouchPoints > 0 || (legacyNavigator.msMaxTouchPoints ?? 0) > 0);

  const devicePixelRatio = window.devicePixelRatio || 1;
  const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Format detection
  const supportsWebP = checkWebPSupport();
  const supportsWebM = checkWebMSupport();
  const supportsHEIC = checkHEICSupport();

  return {
    isMobile,
    isTablet,
    isDesktop,
    isIOS,
    isAndroid,
    isWindows,
    isMac,
    isLinux,
    hasTouch,
    orientation,
    devicePixelRatio,
    screenWidth,
    screenHeight,
    isLandscape: orientation === "landscape",
    isPortrait: orientation === "portrait",
    isSafari,
    isChrome,
    isFirefox,
    isEdge,
    supportsWebP,
    supportsWebM,
    supportsHEIC,
    isDarkMode,
    prefersReducedMotion,
  };
}

function checkWebPSupport(): boolean {
  if (typeof window === "undefined") return false;
  const canvas = document.createElement("canvas");
  canvas.width = 1;
  canvas.height = 1;
  return canvas.toDataURL("image/webp").indexOf("image/webp") === 0;
}

function checkWebMSupport(): boolean {
  if (typeof window === "undefined") return false;
  const video = document.createElement("video");
  return video.canPlayType("video/webm") !== "";
}

function checkHEICSupport(): boolean {
  if (typeof window === "undefined") return false;
  const image = document.createElement("img");
  return image.currentSrc && image.currentSrc.includes(".heic");
}

// Quick device type check hooks for convenience
export function useIsMobile() {
  const { isMobile } = useDeviceInfo();
  return isMobile;
}

export function useIsTablet() {
  const { isTablet } = useDeviceInfo();
  return isTablet;
}

export function useIsDesktop() {
  const { isDesktop } = useDeviceInfo();
  return isDesktop;
}

export function useHasTouch() {
  const { hasTouch } = useDeviceInfo();
  return hasTouch;
}

export function useOrientation() {
  const { orientation } = useDeviceInfo();
  return orientation;
}

export function useIsDarkMode() {
  const { isDarkMode } = useDeviceInfo();
  return isDarkMode;
}

export function usePrefersReducedMotion() {
  const { prefersReducedMotion } = useDeviceInfo();
  return prefersReducedMotion;
}
