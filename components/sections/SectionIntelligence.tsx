"use client";

import { useEffect, useRef } from "react";
import { useInView } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import MagneticButton from "@/components/ui-custom/MagneticButton";

gsap.registerPlugin(ScrollTrigger);

interface SectionFormProps {
  roughness: number;
  metalness: number;
  onRoughnessChange: (v: number) => void;
  onMetalnessChange: (v: number) => void;
}

function getSystemLabel(roughness: number, metalness: number): string {
  if (roughness > 0.7 && metalness < 0.3) return "early prototype";
  if (roughness > 0.5) return "internal beta";
  if (metalness > 0.6) return "production-hardened";
  if (metalness > 0.3) return "launch-ready";
  return "design iteration";
}

export default function SectionForm({
  roughness,
  metalness,
  onRoughnessChange,
  onMetalnessChange,
}: SectionFormProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-15%" });

  useEffect(() => {
    if (!isInView) return;
    const ctx = gsap.context(() => {
      gsap.from(".form-heading", {
        y: "108%",
        duration: 1.3,
        stagger: 0.1,
        ease: "power3.out",
      });
      gsap.from(".form-body", {
        opacity: 0,
        y: 14,
        duration: 1,
        delay: 0.4,
        ease: "power2.out",
        stagger: 0.1,
      });
      gsap.from(".form-rule", {
        scaleX: 0,
        duration: 1.4,
        delay: 0.3,
        ease: "power3.out",
        stagger: 0.1,
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [isInView]);

  const navigateNext = () => {
    const next = document.querySelector('[data-section="4"]');
    if (next) next.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      ref={sectionRef}
      data-section="3"
      id="form"
      className="relative px-8 md:px-16 lg:px-24 py-28 md:py-40 min-h-screen"
      style={{
        backdropFilter: "blur(1px)",
      }}
      aria-label="System — tuning the product"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-16">
          <div className="form-rule h-px w-10 bg-threshold-ink/15 origin-left" />
          <span className="t-label text-[0.58rem] text-threshold-muted">
            04 / SYSTEM — How it responds to the world defines what it is
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 items-start">
          <div className="md:col-span-6">
            <div className="overflow-hidden mb-0.5">
              <div className="form-heading">
                <h2 className="t-heading text-threshold-ink">
                  Structure exists.
                </h2>
              </div>
            </div>
            <div className="overflow-hidden mb-0.5">
              <div className="form-heading">
                <h2 className="t-heading text-threshold-gold italic">
                  Now define
                </h2>
              </div>
            </div>
            <div className="overflow-hidden mb-12">
              <div className="form-heading">
                <h2 className="t-heading text-threshold-ink">
                  how it behaves.
                </h2>
              </div>
            </div>

            <p className="form-body t-body text-threshold-muted max-w-[38ch] mb-5">
              A system's architecture is invisible to the people who use it.
              What they experience is how it responds — fast or slow, rigid or
              adaptive, finished or rough at the edges.
            </p>
            <p className="form-body t-body text-threshold-muted max-w-[38ch] mb-12">
              These controls shape the live model above. Each position
              represents a different product decision — how much polish, how
              much structural strength. Every value is a tradeoff.
            </p>
            <div className="form-body">
              <MagneticButton variant="dark" onClick={navigateNext}>
                Ship the Product →
              </MagneticButton>
            </div>
          </div>

          <div className="md:col-span-5 md:col-start-8">
            <div className="form-body">
              {/* Surface Polish */}
              <div className="mb-10">
                <div className="flex justify-between items-baseline mb-4">
                  <label
                    htmlFor="roughness-slider"
                    className="t-label text-[0.6rem] text-threshold-muted"
                  >
                    SURFACE POLISH
                  </label>
                  <span className="t-mono text-[0.6rem] text-threshold-gold">
                    {roughness.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center gap-4 mb-2">
                  <span className="t-mono text-[0.5rem] text-threshold-muted-light">
                    RAW
                  </span>
                  <input
                    id="roughness-slider"
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={roughness}
                    onChange={(e) =>
                      onRoughnessChange(parseFloat(e.target.value))
                    }
                    className="threshold-slider flex-1"
                    data-cursor="hover"
                    aria-label="Surface polish: 0 is rough prototype, 1 is polished product"
                  />
                  <span className="t-mono text-[0.5rem] text-threshold-muted-light">
                    REFINED
                  </span>
                </div>
                <div className="h-[2px] rounded-sm bg-threshold-ink/8 overflow-hidden">
                  <div
                    className="h-full bg-threshold-gold transition-[width] duration-100"
                    style={{ width: `${roughness * 100}%` }}
                  />
                </div>
              </div>

              {/* Structural Integrity */}
              <div className="mb-12">
                <div className="flex justify-between items-baseline mb-4">
                  <label
                    htmlFor="metalness-slider"
                    className="t-label text-[0.6rem] text-threshold-muted"
                  >
                    STRUCTURAL INTEGRITY
                  </label>
                  <span className="t-mono text-[0.6rem] text-threshold-gold">
                    {metalness.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center gap-4 mb-2">
                  <span className="t-mono text-[0.5rem] text-threshold-muted-light">
                    FRAGILE
                  </span>
                  <input
                    id="metalness-slider"
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={metalness}
                    onChange={(e) =>
                      onMetalnessChange(parseFloat(e.target.value))
                    }
                    className="threshold-slider flex-1"
                    data-cursor="hover"
                    aria-label="Structural integrity: 0 is fragile, 1 is production-grade"
                  />
                  <span className="t-mono text-[0.5rem] text-threshold-muted-light">
                    HARDENED
                  </span>
                </div>
                <div className="h-[2px] rounded-sm bg-threshold-ink/8 overflow-hidden">
                  <div
                    className="h-full bg-threshold-slate transition-[width] duration-100"
                    style={{ width: `${metalness * 100}%` }}
                  />
                </div>
              </div>

              {/* Product state readout */}
              <div className="border-t border-threshold-ink/10 pt-5">
                <div className="t-label text-[0.58rem] text-threshold-muted mb-1">
                  CURRENT BUILD STATE
                </div>
                <div className="t-mono text-[0.625rem] text-threshold-ink/60">
                  polish: {roughness.toFixed(3)} · integrity:{" "}
                  {metalness.toFixed(3)}
                </div>
                <div className="t-mono text-[0.575rem] text-threshold-gold mt-2">
                  {getSystemLabel(roughness, metalness)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
