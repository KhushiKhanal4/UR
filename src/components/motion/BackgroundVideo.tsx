"use client";

import { useEffect, useRef } from "react";

/**
 * Muted, looping decorative video.
 * - Plays only while on screen (saves CPU/battery), and never downloads until near the viewport
 *   unless `eager` is set.
 * - Respects prefers-reduced-motion: the poster frame stays static.
 * - Phones get a lighter 720p file via <source media>.
 */
export function BackgroundVideo({
  eager = false,
  className = "",
  style,
}: {
  eager?: boolean;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduceMotion.matches) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (video.preload === "none") {
            video.preload = "auto";
            video.load();
          }
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { rootMargin: "200px 0px" },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      aria-hidden
      tabIndex={-1}
      muted
      loop
      playsInline
      disablePictureInPicture
      preload={eager ? "auto" : "none"}
      poster="/images/wave-poster.webp"
      className={`pointer-events-none object-cover ${className}`}
      style={style}
    >
      <source src="/videos/wave-1280.webm" type="video/webm" media="(min-width: 768px)" />
      <source src="/videos/wave-1280.mp4" type="video/mp4" media="(min-width: 768px)" />
      <source src="/videos/wave-720.mp4" type="video/mp4" />
    </video>
  );
}
