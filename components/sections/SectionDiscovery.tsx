"use client";

import { useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import MagneticButton from "@/components/ui-custom/MagneticButton";

gsap.registerPlugin(ScrollTrigger);

interface SectionAxiomProps {
  wireframe: boolean;
  onToggleWireframe: () => void;
}

const NODES = [
  [0, 1, 0],
  [0.894, 0.447, 0],
  [-0.894, 0.447, 0],
  [0.276, 0.447, -0.851],
  [-0.724, 0.447, 0.526],
  [0.724, 0.447, 0.526],
  [-0.276, 0.447, 0.851],
  [0.276, -0.447, 0.851],
  [0.724, -0.447, -0.526],
  [-0.724, -0.447, -0.526],
  [-0.276, -0.447, -0.851],
  [0, -1, 0],
];

export default function SectionAxiom({
  wireframe,
  onToggleWireframe,
}: SectionAxiomProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-15%" });

  useEffect(() => {
    if (!isInView) return;
    const ctx = gsap.context(() => {
      gsap.from(".axiom-heading", {
        y: "108%",
        duration: 1.3,
        stagger: 0.12,
        ease: "power3.out",
      });
      gsap.from(".axiom-body", {
        opacity: 0,
        y: 16,
        duration: 1,
        delay: 0.4,
        stagger: 0.1,
        ease: "power2.out",
      });
      gsap.from(".node-dot", {
        scale: 0,
        opacity: 0,
        duration: 0.5,
        stagger: 0.04,
        delay: 0.6,
        ease: "back.out(2)",
      });
      gsap.from(".axiom-rule", {
        scaleX: 0,
        duration: 1.4,
        delay: 0.2,
        ease: "power3.out",
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [isInView]);

  return (
    <section
      ref={sectionRef}
      data-section="1"
      id="axiom"
      className="section-light px-8 md:px-16 lg:px-24 py-28 md:py-40"
      aria-label="The Idea — signals become concepts"
    >
      <div className="grid-overlay">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="grid-col" />
        ))}
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-16">
          <div className="axiom-rule h-px w-10 bg-threshold-ink/15 origin-left" />
          <span className="t-label text-[0.58rem] text-threshold-muted">
            02 / IDEA — Every breakthrough starts as an isolated signal
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
          <div className="md:col-span-6">
            <div className="overflow-hidden mb-0.5">
              <div className="axiom-heading">
                <h2 className="t-heading text-threshold-ink">The idea</h2>
              </div>
            </div>
            <div className="overflow-hidden mb-0.5">
              <div className="axiom-heading">
                <h2 className="t-heading text-threshold-gold italic">
                  arrives first.
                </h2>
              </div>
            </div>
            <div className="overflow-hidden mb-10">
              <div className="axiom-heading">
                <h2 className="t-heading text-threshold-ink">Alone.</h2>
              </div>
            </div>

            <p className="axiom-body t-body text-threshold-muted max-w-[36ch] mb-5">
              Before a product exists, there is only a signal — a problem seen
              clearly for the first time. Isolated. Unconnected. But already
              carrying the shape of everything it will become.
            </p>
            <p className="axiom-body t-body text-threshold-muted max-w-[36ch] mb-10">
              The best ideas don't arrive complete. They arrive as a single
              compelling question. The work is building everything around it.
            </p>

            <div className="axiom-body flex items-center gap-4">
              <MagneticButton variant="dark" onClick={onToggleWireframe}>
                {wireframe ? "Collapse the Network" : "Reveal the Network"}
              </MagneticButton>
            </div>
            <p className="axiom-body t-mono text-[0.575rem] text-threshold-muted-light mt-3">
              {wireframe
                ? "↑ connections visible in the visualization above"
                : "↑ reveals how the signals connect above"}
            </p>
          </div>

          <div className="md:col-span-6 md:col-start-7">
            <div className="axiom-body">
              <div
                className="relative"
                style={{ aspectRatio: "1/1", maxWidth: "420px" }}
                aria-label="Signal network — ideas as connected nodes"
              >
                <svg
                  viewBox="-1.4 -1.4 2.8 2.8"
                  className="w-full h-full"
                  aria-hidden="true"
                >
                  <circle
                    cx="0"
                    cy="0"
                    r="1.15"
                    fill="none"
                    stroke="var(--ink)"
                    strokeWidth="0.01"
                    strokeOpacity="0.08"
                  />
                  <circle
                    cx="0"
                    cy="0"
                    r="0.7"
                    fill="none"
                    stroke="var(--ink)"
                    strokeWidth="0.006"
                    strokeOpacity="0.05"
                    strokeDasharray="0.04 0.06"
                  />

                  {NODES.map(([x, y, z], i) => {
                    const px = x * 1.1;
                    const py = -y * 1.1;
                    const depth = (z + 1) / 2;
                    return (
                      <g key={i} className="node-dot">
                        <circle
                          cx={px}
                          cy={py}
                          r={0.055 + depth * 0.03}
                          fill={i % 4 === 0 ? "var(--gold)" : "var(--ink)"}
                          opacity={0.25 + depth * 0.65}
                        />
                      </g>
                    );
                  })}

                  <line
                    x1="-0.06"
                    y1="0"
                    x2="0.06"
                    y2="0"
                    stroke="var(--gold)"
                    strokeWidth="0.015"
                    strokeOpacity="0.5"
                  />
                  <line
                    x1="0"
                    y1="-0.06"
                    x2="0"
                    y2="0.06"
                    stroke="var(--gold)"
                    strokeWidth="0.015"
                    strokeOpacity="0.5"
                  />
                  <circle
                    cx="0"
                    cy="0"
                    r="0.025"
                    fill="var(--gold)"
                    opacity="0.7"
                  />
                </svg>

                <div className="absolute bottom-0 left-0 right-0 flex justify-between">
                  <span className="t-mono text-[0.525rem] text-threshold-muted-light">
                    SIGNAL MAP
                  </span>
                  <span className="t-mono text-[0.525rem] text-threshold-muted-light">
                    PRE-CONNECTION PHASE
                  </span>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-3 gap-4">
                {[
                  { n: "01", desc: "core idea" },
                  { n: "∞", desc: "possible paths" },
                  { n: "00", desc: "constraints yet" },
                ].map((s, i) => (
                  <div
                    key={i}
                    className="border-t border-threshold-ink/10 pt-3"
                  >
                    <div className="t-stat text-[clamp(1.5rem,3vw,2.5rem)] text-threshold-ink/85">
                      {s.n}
                    </div>
                    <div className="t-label text-[0.55rem] text-threshold-muted">
                      {s.desc}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
