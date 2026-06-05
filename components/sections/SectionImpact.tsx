'use client';

import { useEffect, useRef } from 'react';
import { useInView } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import MagneticButton from '@/components/ui-custom/MagneticButton';

gsap.registerPlugin(ScrollTrigger);

interface SectionInhabitProps {
  orbitEnabled: boolean;
  onToggleOrbit: () => void;
  onDissolve: () => void;
}

const PRODUCT_PRINCIPLES = [
  ['Scalability', 'Handles load it was never designed for'],
  ['Adaptability', 'Bends without breaking under changing conditions'],
  ['Coherence', 'Every part serves the same purpose'],
  ['Resilience', 'Degrades gracefully. Recovers fast.'],
  ['Efficiency', 'No wasted motion. No redundant structure.'],
  ['Longevity', 'Built to outlast the problem that created it'],
  ['Emergence', 'The whole is greater than the sum of its parts'],
  ['Trust', 'Users stop thinking about it. They just use it.'],
];

export default function SectionInhabit({ orbitEnabled, onToggleOrbit, onDissolve }: SectionInhabitProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-15%' });

  useEffect(() => {
    if (!isInView) return;
    const ctx = gsap.context(() => {
      gsap.from('.inhabit-heading', { y: '108%', duration: 1.3, stagger: 0.12, ease: 'power3.out' });
      gsap.from('.inhabit-body', { opacity: 0, y: 14, duration: 1, delay: 0.4, ease: 'power2.out', stagger: 0.1 });
      gsap.from('.inhabit-spec', { opacity: 0, x: -10, duration: 0.8, delay: 0.5, stagger: 0.08, ease: 'power2.out' });
    }, sectionRef);
    return () => ctx.revert();
  }, [isInView]);

  return (
    <section
      ref={sectionRef}
      data-section="4"
      id="inhabit"
      className="section-void px-8 md:px-16 lg:px-24 py-28 md:py-40"
      aria-label="Product — the completed system in the world"
    >
      <div className="max-w-7xl mx-auto">

        <div className="flex items-center gap-4 mb-16">
          <div className="h-px w-10 bg-threshold-parchment/25" />
          <span className="t-label text-[0.58rem] text-threshold-parchment/50">
            05 / PRODUCT — It ships. Now it belongs to the world.
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 items-start">

          <div className="md:col-span-6">
            <div className="overflow-hidden mb-0.5">
              <div className="inhabit-heading">
                <h2 className="t-heading text-threshold-parchment">The system</h2>
              </div>
            </div>
            <div className="overflow-hidden mb-0.5">
              <div className="inhabit-heading">
                <h2 className="t-heading text-threshold-gold italic">is complete.</h2>
              </div>
            </div>
            <div className="overflow-hidden mb-12">
              <div className="inhabit-heading">
                <h2 className="t-heading text-threshold-parchment">Now inhabit it.</h2>
              </div>
            </div>

            <p className="inhabit-body t-body text-threshold-parchment/60 max-w-[38ch] mb-8">
              A product exists in the world differently than it existed in the
              design. Users find edges you never anticipated. They use it in
              ways you never imagined. They find its limits.
            </p>
            <p className="inhabit-body t-body text-threshold-parchment/60 max-w-[38ch] mb-12">
              Enable free exploration to move through the system from any angle.
              Then — when it has been fully examined — release it.
              Let it become what it needs to become next.
            </p>

            <div className="inhabit-body flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <MagneticButton variant="primary" onClick={onToggleOrbit}>
                {orbitEnabled ? '[ Lock View ]' : '[ Explore Freely ]'}
              </MagneticButton>
              <MagneticButton variant="ghost" onClick={onDissolve}>
                Release it →
              </MagneticButton>
            </div>
            <p className="inhabit-body t-mono text-[0.55rem] text-threshold-parchment/35 mt-3">
              {orbitEnabled ? '↑ drag the 3D scene above to explore' : '↑ free exploration enables drag-to-rotate'}
            </p>
          </div>

          {/* Right — product principles with boosted readability */}
          <div className="md:col-span-5 md:col-start-8">
            <div className="inhabit-body mb-6">
              <div className="t-label text-[0.58rem] text-threshold-parchment/45 mb-4">
                PROPERTIES OF A WELL-BUILT SYSTEM
              </div>
              {PRODUCT_PRINCIPLES.map(([key, val], i) => (
                <div
                  key={i}
                  className="inhabit-spec py-3 border-b border-threshold-parchment/10"
                >
                  <div className="flex justify-between items-start gap-4">
                    <span className="t-mono text-[0.6rem] text-threshold-parchment/75 shrink-0">{key}</span>
                    <span className="t-mono text-[0.55rem] text-threshold-parchment/45 text-right">{val}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
