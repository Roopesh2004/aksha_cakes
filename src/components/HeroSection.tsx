"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowDown } from "lucide-react";

const TOTAL_FRAMES = 201;

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  color: string;
}

const LOADING_MESSAGES = [
  "Sourcing organic ingredients...",
  "Measuring premium Belgian chocolate...",
  "Whisking eggless cloud sponge...",
  "Piping artisan buttercream details...",
  "Chilling velvet chocolate ganache...",
  "Adding edible gold leaf accents...",
  "Ready to reveal the masterpiece..."
];

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  // Refs for tracking animation state inside continuous loop
  const currentFrameIndex = useRef(0);
  const mouseOffset = useRef({ x: 0, y: 0 });
  const targetMouseOffset = useRef({ x: 0, y: 0 });
  const particles = useRef<Particle[]>([]);

  // Format frame filename: ezgif-frame-001.jpg to ezgif-frame-201.jpg
  const getFrameUrl = (index: number) => {
    const formattedNum = String(index).padStart(3, "0");
    return `/cake_video/ezgif-frame-${formattedNum}.jpg`;
  };

  // 1. Preload all frame images
  useEffect(() => {
    let loadedCount = 0;
    const loadedImages: HTMLImageElement[] = [];

    const loadSequence = async () => {
      const promises = Array.from({ length: TOTAL_FRAMES }, (_, i) => {
        return new Promise<HTMLImageElement>((resolve) => {
          const img = new Image();
          img.src = getFrameUrl(i + 1);
          img.onload = () => {
            loadedCount++;
            setProgress(Math.floor((loadedCount / TOTAL_FRAMES) * 100));
            resolve(img);
          };
          img.onerror = () => {
            // Gracefully handle load error to not freeze loader
            loadedCount++;
            setProgress(Math.floor((loadedCount / TOTAL_FRAMES) * 100));
            resolve(img);
          };
          loadedImages[i] = img;
        });
      });

      await Promise.all(promises);
      setImages(loadedImages);
      // Extra buffer for elegant loader transition
      setTimeout(() => {
        setLoading(false);
      }, 600);
    };

    loadSequence();
  }, []);

  // Get dynamic loader messages
  const getLoaderMessage = (p: number) => {
    const step = Math.min(Math.floor(p / 15), LOADING_MESSAGES.length - 1);
    return LOADING_MESSAGES[step];
  };

  // Helper function to render a single frame onto the canvas
  const renderFrame = (index: number) => {
    const canvas = canvasRef.current;
    if (!canvas || images.length === 0) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clamp index to prevent loading out-of-bounds frame on overscroll or reverse scroll
    const clampedIndex = Math.max(0, Math.min(Math.floor(index), images.length - 1));
    const img = images[clampedIndex];
    if (!img) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Cover scale drawing (object-fit: cover for canvas)
    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth || img.width;
    const ih = img.naturalHeight || img.height;

    if (iw === 0 || ih === 0) return;

    const imgRatio = iw / ih;
    const canvasRatio = cw / ch;

    let drawWidth = cw;
    let drawHeight = ch;
    let offsetX = 0;
    let offsetY = 0;

    if (imgRatio > canvasRatio) {
      drawWidth = ch * imgRatio;
      offsetX = (cw - drawWidth) / 2;
    } else {
      drawHeight = cw / imgRatio;
      offsetY = (ch - drawHeight) / 2;
    }

    // Apply mouse parallax offset (max 25px offset)
    const px = mouseOffset.current.x * 25;
    const py = mouseOffset.current.y * 25;

    // Scale up slightly to mask canvas edges during parallax shifts
    const baseScale = 1.05;
    const finalW = drawWidth * baseScale;
    const finalH = drawHeight * baseScale;
    const finalX = offsetX - (finalW - drawWidth) / 2 + px;
    const finalY = offsetY - (finalH - drawHeight) / 2 + py;

    ctx.drawImage(img, finalX, finalY, finalW, finalH);
  };

  // 2. Initialize gold sparkle particles
  const initParticles = (width: number, height: number) => {
    const pArr: Particle[] = [];
    const count = 40;
    const colors = [
      "rgba(230, 197, 148, 0.4)", // Champagne gold spark
      "rgba(245, 230, 211, 0.3)", // Soft cream dust
      "rgba(212, 175, 55, 0.4)",   // Metallic gold spark
      "rgba(247, 231, 206, 0.5)"   // Warm gold dust
    ];

    for (let i = 0; i < count; i++) {
      pArr.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2 + 0.8,
        speedX: (Math.random() - 0.5) * 0.4,
        speedY: -Math.random() * 0.6 - 0.2, // Drifting upwards
        opacity: Math.random() * 0.7 + 0.2,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }
    particles.current = pArr;
  };

  // 3. Track mouse movement for parallax depth
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth) - 0.5;
      const y = (e.clientY / innerHeight) - 0.5;
      targetMouseOffset.current = { x, y };
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // 4. GSAP ScrollTrigger Integration
  useEffect(() => {
    if (loading || images.length === 0) return;

    gsap.registerPlugin(ScrollTrigger);

    const canvas = canvasRef.current;
    if (!canvas) return;

    // Handle high density displays (DPI)
    const updateCanvasSize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
      }
      renderFrame(currentFrameIndex.current);
    };

    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);

    // Initial gold sparkles initialization
    initParticles(canvas.width, canvas.height);

    // Frame tween object
    const scrollObj = { frame: 0 };

    // B. Scroll Trigger synchronization
    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top 64px", // Align with sticky top offset (64px header height)
      end: "bottom bottom",
      scrub: 1.2, // Smoothes the scrub lag for buttery visuals
      onUpdate: (self) => {
        const targetFrame = Math.max(0, Math.min(Math.floor(self.progress * (TOTAL_FRAMES - 1)), TOTAL_FRAMES - 1));
        
        // Tween frame index to smooth out scroll velocity jumps
        gsap.to(scrollObj, {
          frame: targetFrame,
          duration: 0.4,
          overwrite: "auto",
          onUpdate: () => {
            currentFrameIndex.current = Math.max(0, Math.min(Math.floor(scrollObj.frame), TOTAL_FRAMES - 1));
          }
        });
      }
    });

    // C. Subtle cinematic zoom-in effect on scroll
    gsap.to(canvas, {
      scale: 1.1,
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 64px", // Align with sticky top offset (64px header height)
        end: "bottom bottom",
        scrub: true,
      }
    });

    return () => {
      window.removeEventListener("resize", updateCanvasSize);
      trigger.kill();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [loading, images]);

  // 5. Continuous 60fps Animation Loop (Parallax + Particles + Rendering)
  useEffect(() => {
    if (loading || images.length === 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    const tick = () => {
      // Linear interpolation (lerp) for smooth mouse movement
      mouseOffset.current.x += (targetMouseOffset.current.x - mouseOffset.current.x) * 0.08;
      mouseOffset.current.y += (targetMouseOffset.current.y - mouseOffset.current.y) * 0.08;

      // Draw the cake frame
      renderFrame(currentFrameIndex.current);

      // Render floating gold sparks/particles
      const w = canvas.width;
      const h = canvas.height;
      
      ctx.save();
      ctx.globalCompositeOperation = "screen"; // glowing blending mode

      particles.current.forEach((p) => {
        // Update positions
        p.y += p.speedY;
        p.x += p.speedX;

        // Wrap around borders
        if (p.y < 0) {
          p.y = h;
          p.x = Math.random() * w;
        }
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;

        // Draw radial glow particle
        ctx.beginPath();
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
        gradient.addColorStop(0, p.color);
        gradient.addColorStop(0.3, p.color.replace(/[\d.]+\)$/, `${p.opacity * 0.5})`));
        gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
        
        ctx.fillStyle = gradient;
        ctx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.restore();

      animId = requestAnimationFrame(tick);
    };

    tick();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [loading, images]);

  // Framer Motion text animation configs
  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 70,
        damping: 15
      }
    }
  };

  const handleExplore = () => {
    // Scroll down past the pinned hero section (container height is 250vh)
    const target = containerRef.current?.getBoundingClientRect().bottom;
    if (target !== undefined) {
      window.scrollTo({
        top: window.scrollY + target - 80, // offset header height if fixed
        behavior: "smooth"
      });
    }
  };

  return (
    <div ref={containerRef} className="relative h-[250vh] w-full bg-[#12090B] select-none">
      {/* Pinned Viewport Container (sticky top-16 matches the header height of 64px) */}
      <div className="sticky top-16 h-[calc(100vh-4rem)] w-full overflow-hidden flex items-center justify-center">
        
        {/* Canvas for cinematic video scrub */}
        <canvas 
          ref={canvasRef} 
          className="absolute inset-0 w-full h-full block origin-center pointer-events-none"
        />

        {/* Luxury dark vignettes for cinematic depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#12090B]/60 via-transparent to-[#12090B]/90 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,#12090B_100%)] opacity-85 pointer-events-none" />

        {/* Text Overlay Section */}
        <AnimatePresence>
          {!loading && (
            <div className="relative z-10 max-w-5xl mx-auto px-6 text-center text-white w-full flex flex-col justify-center items-center h-full">
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="show"
                className="space-y-3 sm:space-y-4 md:space-y-6 max-h-[85vh] flex flex-col justify-center items-center"
              >
                {/* Premium Small Pill Badge */}
                <motion.div
                  variants={fadeInUp}
                  className="inline-flex items-center space-x-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-lg px-4 py-1 text-[10px] sm:text-xs font-extrabold tracking-widest text-[#FF7AA2] uppercase"
                >
                  <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-[#FF7AA2] animate-pulse" />
                  <span>Aksha Cakes Haute Bakery</span>
                </motion.div>

                {/* Main luxury header */}
                <motion.h1
                  variants={fadeInUp}
                  className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-light tracking-tight leading-none text-white drop-shadow-lg"
                >
                  Crafted for Every <br />
                  <span className="font-extrabold italic bg-gradient-to-r from-[#FFD6E0] via-white to-[#FF7AA2] bg-clip-text text-transparent">
                    Celebration
                  </span>
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                  variants={fadeInUp}
                  className="max-w-xl sm:max-w-2xl mx-auto font-sans text-sm sm:text-base md:text-lg lg:text-xl text-white/80 font-light tracking-wide leading-relaxed drop-shadow"
                >
                  Premium cakes designed to turn moments into memories.
                </motion.p>

                {/* Call To Action Buttons */}
                <motion.div
                  variants={fadeInUp}
                  className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 md:gap-6 pt-2 sm:pt-4 w-full sm:w-auto"
                >
                  <motion.button
                    whileHover={{ 
                      scale: 1.05, 
                      backgroundColor: "#FFD6E0",
                      boxShadow: "0 0 25px rgba(255, 122, 162, 0.4)" 
                    }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleExplore}
                    className="w-full sm:w-auto rounded-full bg-white text-[#12090B] font-extrabold text-xs sm:text-sm md:text-base px-6 sm:px-8 py-3 sm:py-4 tracking-widest transition-all uppercase cursor-pointer shadow-xl"
                  >
                    Explore Collection
                  </motion.button>
                  
                  <motion.a
                    whileHover={{ 
                      scale: 1.05, 
                      borderColor: "rgba(255, 122, 162, 0.8)", 
                      backgroundColor: "rgba(255, 122, 162, 0.15)" 
                    }}
                    whileTap={{ scale: 0.95 }}
                    href="https://wa.me/919999999999?text=Hi%20Aksha%20Cakes%2C%20I%20would%20like%20to%20build%20a%20custom%20premium%20cake%21"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto rounded-full border border-white/20 bg-black/25 backdrop-blur-sm text-white font-extrabold text-xs sm:text-sm md:text-base px-6 sm:px-8 py-3 sm:py-4 tracking-widest transition-all uppercase cursor-pointer text-center shadow-lg hover:shadow-pink-900/10"
                  >
                    Build Your Cake
                  </motion.a>
                </motion.div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Draggable Scroll down Indicator */}
        <AnimatePresence>
          {!loading && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 1, repeat: Infinity, repeatType: "reverse" }}
              className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-2 text-white/50 cursor-pointer pointer-events-none"
            >
              <span className="text-[10px] uppercase font-bold tracking-widest">Scroll to Explore</span>
              <ArrowDown className="w-4 h-4 text-[#FF7AA2]" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Fullscreen luxury preloader */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#12090B] px-6"
          >
            {/* Elegant Luxury loading backdrop logo */}
            <div className="relative mb-12 flex flex-col items-center space-y-3">
              <motion.div
                animate={{ scale: [1, 1.05, 1], opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 bg-[#FF7AA2]/5 rounded-full blur-3xl w-48 h-48 -translate-x-1/4 -translate-y-1/4"
              />
              <span className="font-serif text-3xl md:text-4xl font-extrabold tracking-widest text-[#FF7AA2]">AKSHA CAKES</span>
              <span className="text-[10px] md:text-xs font-semibold tracking-[0.3em] text-[#FFD6E0] uppercase">Haute Patisserie</span>
            </div>

            {/* Custom styled progress indicators */}
            <div className="w-full max-w-xs space-y-4">
              <div className="flex justify-between items-center text-xs font-mono text-white/60">
                <span className="font-medium animate-pulse">{getLoaderMessage(progress)}</span>
                <span className="font-bold text-[#FF7AA2]">{String(progress).padStart(2, "0")}%</span>
              </div>

              {/* Progress track */}
              <div className="h-[2px] w-full bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#FF7AA2] via-[#FFD6E0] to-white"
                  initial={{ width: "0%" }}
                  animate={{ width: `${progress}%` }}
                  transition={{ ease: "easeOut", duration: 0.1 }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
