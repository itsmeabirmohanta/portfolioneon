# Device Compatibility Quick Reference

## Quick Setup Checklist
- ✅ Enhanced HTML meta tags for all platforms
- ✅ PWA manifest.json added
- ✅ Windows browserconfig.xml added  
- ✅ Device detection hook with 25+ capabilities
- ✅ Device-specific CSS media queries
- ✅ Tailwind breakpoints for all devices
- ✅ Notch safe area support (iPhone X+)
- ✅ Touch target optimization (44x44px)
- ✅ Dark mode & accessibility preferences
- ✅ Cross-browser tested

## Common Usage Patterns

### Detect Mobile & Show Different UI
```tsx
import { useIsMobile } from "@/hooks/use-device-info";

export function Navigation() {
  const isMobile = useIsMobile();
  
  return isMobile ? <MobileNav /> : <DesktopNav />;
}
```

### Apply Touch-Friendly Padding
```tsx
// In component
<button className="px-4 py-2 touch:px-6 touch:py-3">Button</button>

// Or use device hook
const { hasTouch } = useDeviceInfo();
```

### Optimize for Landscape Mode
```jsx
<div className="flex flex-col md:flex-row sm-landscape:flex-row">
  {/* Single column on mobile, multi-column on tablet+ or small landscape */}
</div>
```

### Respect User Motion Preferences
```tsx
import { usePrefersReducedMotion } from "@/hooks/use-device-info";

export function AnimatedComponent() {
  const prefersReducedMotion = usePrefersReducedMotion();
  
  return (
    <div className={prefersReducedMotion ? "" : "animate-pulse"}>
      Content
    </div>
  );
}
```

### Support Safe Areas (Notches)
```tsx
// CSS
<div className="p-4 safe-left safe-right safe-top">Padded with safe areas</div>

// Tailwind
<div className="pt-safe-top pl-safe-left pr-safe-right">Content</div>
```

### Dark Mode Support
```tsx
const { isDarkMode } = useDeviceInfo();

<div className={isDarkMode ? "bg-black" : "bg-white"}>
  {isDarkMode ? "🌙" : "☀️"}
</div>
```

### Get Full Device Info
```tsx
const info = useDeviceInfo();
// {
//   isMobile: boolean
//   isTablet: boolean
//   isDesktop: boolean
//   isIOS: boolean
//   isAndroid: boolean
//   isWindows: boolean
//   isMac: boolean
//   isLinux: boolean
//   hasTouch: boolean
//   orientation: "portrait" | "landscape"
//   devicePixelRatio: number
//   screenWidth: number
//   screenHeight: number
//   isLandscape: boolean
//   isPortrait: boolean
//   isSafari: boolean
//   isChrome: boolean
//   isFirefox: boolean
//   isEdge: boolean
//   supportsWebP: boolean
//   supportsWebM: boolean
//   supportsHEIC: boolean
//   isDarkMode: boolean
//   prefersReducedMotion: boolean
// }
```

## Tailwind Breakpoint Guide

| Class | Breakpoint | Use Case |
|-------|-----------|----------|
| `xs:` | 320px | Extra small phones |
| `sm:` | 640px | Small phones/landscape |
| `md:` | 768px | Tablets portrait |
| `lg:` | 1024px | Tablets landscape, laptops |
| `xl:` | 1280px | Large monitors |
| `2xl:` | 1536px | Ultra-wide displays |
| `touch:` | Touch pointer | Touch devices |
| `no-touch:` | Fine pointer | Mouse/trackpad |
| `dark-mode:` | Dark theme | Dark color scheme |
| `light-mode:` | Light theme | Light color scheme |
| `reduced-motion:` | Motion disabled | Accessibility preference |
| `high-contrast:` | High contrast | Accessibility preference |

## Example Responsive Layout
```tsx
export function ResponsiveLayout() {
  return (
    <div className="
      grid 
      grid-cols-1 
      sm:grid-cols-2 
      lg:grid-cols-3 
      gap-4 
      touch:gap-6
      sm-landscape:grid-cols-3
      p-4 
      safe-left 
      safe-right
    ">
      {/* Content */}
    </div>
  );
}
```

## Testing Checklist

### Phone Testing
- [ ] Test on iPhone (Safari)
- [ ] Test on Android (Chrome)
- [ ] Test portrait orientation
- [ ] Test landscape orientation
- [ ] Test notch/safe areas
- [ ] Test dark mode
- [ ] Test reduced motion
- [ ] Test touch interactions

### Tablet Testing
- [ ] Test iPad portrait
- [ ] Test iPad landscape
- [ ] Test Android tablet
- [ ] Test split-screen mode

### Desktop Testing
- [ ] Test on Windows
- [ ] Test on macOS
- [ ] Test on Linux
- [ ] Test on Chrome
- [ ] Test on Safari
- [ ] Test on Firefox
- [ ] Test on Edge
- [ ] Test with reduced motion enabled
- [ ] Test with high contrast enabled

### Accessibility Testing
- [ ] Screen reader (NVDA, JAWS, VoiceOver)
- [ ] Keyboard navigation only
- [ ] High contrast mode
- [ ] Reduced motion mode
- [ ] Color contrast checker (WCAG AA)
- [ ] Touch target size (minimum 44x44px)

## Performance Tips

1. **Images**: Provide WebP with fallback
   ```tsx
   <picture>
     <source srcSet="image.webp" type="image/webp" />
     <img src="image.png" alt="fallback" />
   </picture>
   ```

2. **Responsive Images**: Use srcset
   ```tsx
   <img 
     srcSet="small.png 640w, large.png 1280w"
     sizes="(max-width: 640px) 100vw, 80vw"
     src="large.png"
     alt="responsive"
   />
   ```

3. **Lazy Load**: Use native lazy loading
   ```tsx
   <img loading="lazy" src="..." alt="..." />
   ```

4. **Code Splitting**: Load device-specific code
   ```tsx
   const MobileComponent = lazy(() => import("./Mobile"));
   ```

## Browser Support Matrix

| Feature | Chrome | Firefox | Safari | Edge | IE11 |
|---------|--------|---------|--------|------|------|
| Viewport meta | ✅ | ✅ | ✅ | ✅ | ✅ |
| Touch detection | ✅ | ✅ | ✅ | ✅ | ⚠️ |
| Safe areas | ✅ | ✅ | ✅ | ✅ | ❌ |
| WebP | ✅ | ✅ | ❌ | ✅ | ❌ |
| CSS Grid | ✅ | ✅ | ✅ | ✅ | ❌ |
| Flexbox | ✅ | ✅ | ✅ | ✅ | ⚠️ |
| Dark mode media | ✅ | ✅ | ✅ | ✅ | ❌ |
| Reduce motion | ✅ | ✅ | ✅ | ✅ | ❌ |

## Need Help?

See [DEVICE_COMPATIBILITY.md](DEVICE_COMPATIBILITY.md) for detailed documentation.
