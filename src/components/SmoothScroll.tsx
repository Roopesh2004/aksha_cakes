"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { gsap } from "gsap";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Check if we are running in the browser
    if (typeof window === "undefined") return;

    // Register ScrollTrigger plugin with GSAP
    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      gestureOrientation: "vertical",
    });

    // Synchronize Lenis scrolling with ScrollTrigger calculations
    lenis.on("scroll", () => {
      ScrollTrigger.update();
    });

    // Synchronize GSAP ticker with Lenis requestAnimationFrame
    const updateRaf = (time: number) => {
      lenis.raf(time * 1000); // Lenis expects milliseconds, GSAP ticker uses seconds
    };
    
    gsap.ticker.add(updateRaf);

    // Clean up
    return () => {
      gsap.ticker.remove(updateRaf);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
