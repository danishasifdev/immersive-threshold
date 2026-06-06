"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import MagneticButton from "@/components/ui-custom/MagneticButton";

gsap.registerPlugin(ScrollTrigger);

interface SectionEdgeProps {
  wireframe: boolean;
  onToggleWireframe: () => void;
}

const CONNECTIONS = [
  [0, 1],
  [0, 2],
  [0, 3],
  [0, 4],
  [0, 5],
  [1, 2],
  [2, 4],
  [4, 6],
  [5, 6],
  [3, 5],
  [1, 7],
  [2, 9],
  [3, 8],
  [4, 9],
  [5, 7],
  [6, 10],
  [7, 11],
  [8, 11],
  [9, 11],
  [10, 11],
];

const NODES_2D = [
  [160, 30],
  [90, 80],
  [230, 80],
  [250, 145],
  [70, 145],
  [200, 145],
  [130, 175],
  [200, 215],
  [270, 250],
  [90, 250],
  [130, 285],
  [160, 330],
];

const CONNECTION_TYPES = [
  { role: "User need", count: 5 },
  { role: "Team dependency", count: 4 },
  { role: "Technical constraint", count: 3 },
  { role: "Market signal", count: 3 },
];

export default function SectionEdge({
  wireframe,
  onToggleWireframe,
}: SectionEdgeProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-15%" });

  useEffect(() => {
    if (!isInView) return;
    const ctx = gsap.context(() => {
      gsap.from(".edge-heading", {
        y: "108%",
        duration: 1.3,
        stagger: 0.1,
        ease: "power3.out",
      });
      gsap.from(".edge-line-svg", {
        strokeDashoffset: 200,
        strokeDasharray: 200,
        duration: 1.4,
        stagger: 0.05,
        delay: 0.3,
        ease: "power2.out",
      });
      gsap.from(".edge-body", {
        opacity: 0,
        y: 14,
        duration: 1,
        delay: 0.5,
        ease: "power2.out",
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [isInView]);

  const proceed = () => {
    const next = document.querySelector('[data-section="3"]');
    if (next) next.scrollIntoView({ behavior: "smooth" });
  };

  const ref = useRef(null);
  const [active, setActive] = useState(false);
  const [key, setKey] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(false);
          setKey((prev) => prev + 1);
          setTimeout(() => setActive(true), 50);
        } else {
          setActive(false);
        }
      },
      { threshold: 0.4 },
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return (
    <section
      ref={sectionRef}
      data-section="2"
      id="edge"
      className="section-light px-8 md:px-16 lg:px-24 py-28 md:py-40"
      aria-label="Connection — relationships create structure"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-16">
          <div className="h-px w-10 bg-threshold-ink/10" />
          <span className="t-label text-[0.58rem] text-threshold-muted">
            03 / CONNECTION — Relationships are the architecture
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 items-start">
          <div ref={ref} className="md:col-span-5 edge-body">
            <div className="relative" aria-label="Relationship network diagram">
              <svg
                key={key} // 🔥 THIS is what makes it restart cleanly
                viewBox="0 0 320 360"
                className="w-full"
                style={{ maxHeight: "460px" }}
                aria-hidden="true"
              >
                {CONNECTIONS.map(([a, b], i) => (
                  <line
                    key={i}
                    className={`edge-line-svg ${active ? "animate-line" : ""}`}
                    x1={NODES_2D[a][0]}
                    y1={NODES_2D[a][1]}
                    x2={NODES_2D[b][0]}
                    y2={NODES_2D[b][1]}
                    stroke={i < 5 ? "#8B7355" : "var(--ink)"}
                    strokeWidth={i < 5 ? "1.2" : "0.7"}
                    strokeOpacity={i < 5 ? 0.7 : 0.25}
                    style={{
                      animationDelay: active ? `${i * 0.08}s` : "0s",
                    }}
                  />
                ))}

                {NODES_2D.map(([x, y], i) => (
                  <circle
                    key={i}
                    cx={x}
                    cy={y}
                    r="3.5"
                    fill={i === 0 || i === 11 ? "#8B7355" : "var(--ink)"}
                    opacity={i === 0 || i === 11 ? 0.85 : 0.4}
                  />
                ))}

                <text
                  x="4"
                  y="356"
                  fontSize="9"
                  fill="var(--ink)"
                  opacity="0.25"
                  fontFamily="var(--font-dm-mono)"
                >
                  DEPENDENCY MAP — SYSTEM ARCHITECTURE
                </text>
                <text
                  x="4"
                  y="366"
                  fontSize="9"
                  fill="var(--ink)"
                  opacity="0.2"
                  fontFamily="var(--font-dm-mono)"
                >
                  each node connects to exactly 5 others
                </text>
              </svg>
            </div>
          </div>

          <div className="md:col-span-6 md:col-start-7">
            <div className="overflow-hidden mb-1">
              <div className="edge-heading">
                <h2 className="t-heading text-threshold-ink">
                  Ideas don't scale.
                </h2>
              </div>
            </div>
            <div className="overflow-hidden mb-12">
              <div className="edge-heading">
                <h2 className="t-heading text-threshold-gold italic">
                  Relationships do.
                </h2>
              </div>
            </div>

            <p className="edge-body t-body text-threshold-muted max-w-[38ch] mb-6">
              A product is not a single idea. It is the network of decisions
              that surround it — user needs mapped to technical constraints,
              team capabilities aligned with market timing.
            </p>
            <p className="edge-body t-body text-threshold-muted max-w-[38ch] mb-10">
              The strongest systems are not the ones with the most connections.
              They are the ones where every connection is intentional. Where
              nothing is wasted. Where every dependency earns its place.
            </p>

            <div className="edge-body mb-10">
              <div className="t-label text-[0.58rem] text-threshold-muted tracking-[0.2em] mb-3">
                DEPENDENCY TYPES
              </div>
              <div className="flex flex-col gap-3">
                {CONNECTION_TYPES.map((type, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <div
                          key={j}
                          className="w-2 h-2"
                          style={{
                            background:
                              j < type.count
                                ? "var(--gold)"
                                : "rgba(21,21,21,0.1)",
                          }}
                        />
                      ))}
                    </div>
                    <span className="t-mono text-[0.55rem] text-threshold-muted">
                      {type.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="edge-body flex items-center gap-5">
              <MagneticButton variant="dark" onClick={proceed}>
                Build the System →
              </MagneticButton>
              <MagneticButton variant="ghost" onClick={onToggleWireframe}>
                {wireframe ? "[ hide connections ]" : "[ show connections ]"}
              </MagneticButton>
            </div>
            <p className="edge-body t-mono text-[0.55rem] text-threshold-muted-light mt-3">
              ↑ controls the visualization above
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
