'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import MagneticButton from '@/components/ui-custom/MagneticButton';

gsap.registerPlugin(ScrollTrigger);

interface SectionVoidProps {
  onBurst: () => void;
}

export default function SectionVoid({ onBurst }: SectionVoidProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.from('.void-word', { y: '110%', duration: 1.4, stagger: 0.18, delay: 0.3 })
        .from('.void-sub', { opacity: 0, y: 14, duration: 1 }, '-=0.6')
        .from('.void-meta', { opacity: 0, duration: 0.8, stagger: 0.12 }, '-=0.5')
        .from('.void-cta', { opacity: 0, y: 10, duration: 0.7 }, '-=0.3');
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const handleCross = () => {
    onBurst();
    const next = document.querySelector('[data-section="1"]');
    if (next) next.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      ref={sectionRef}
      data-section="0"
      id="void"
      className="section-void flex flex-col items-start justify-center px-8 md:px-16 lg:px-24 min-h-screen pt-32 pb-16"
      aria-label="Introduction"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 1 }}
        className="mb-12"
      >
        <span className="t-label text-threshold-parchment/45 text-[0.6rem]">
          THRESHOLD — 01 / ORIGIN
        </span>
      </motion.div>

      <div className="mb-10 max-w-5xl" aria-label="Title: Threshold">
        {['THRES', 'HOLD'].map((word, i) => (
          <div key={i} className="overflow-hidden leading-none">
            <div className="void-word inline-block">
              <h1
                className="t-display"
                style={{
                  color: i === 1 ? 'var(--gold)' : 'var(--parchment)',
                  fontStyle: i === 1 ? 'italic' : 'normal',
                }}
              >
                {word}
              </h1>
            </div>
          </div>
        ))}
      </div>

      <div className="void-sub mb-12 max-w-xs md:max-w-sm">
        <p className="t-body text-threshold-parchment/60 leading-[1.9]">
          Every product begins as a signal in the dark.
          <br />
          This is the moment before it has a name.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-8 mb-14">
        {[
          { label: 'ideas', value: '01' },
          { label: 'connections', value: '∞' },
          { label: 'outcomes', value: '?' },
        ].map((item) => (
          <div key={item.label} className="void-meta">
            <div className="t-stat text-threshold-parchment/20 text-[clamp(2rem,4vw,3.5rem)] leading-none">
              {item.value}
            </div>
            <div className="t-label text-[0.55rem] text-threshold-parchment/35 mt-1">
              {item.label}
            </div>
          </div>
        ))}
      </div>

      <div className="void-cta flex items-center gap-6">
        <MagneticButton variant="primary" onClick={handleCross}>
          Begin the Process
        </MagneticButton>
        <span className="t-mono text-[0.5625rem] text-threshold-parchment/35">
          or scroll to continue
        </span>
      </div>

      <div className="scroll-indicator" aria-hidden="true">
        <div className="scroll-line" />
      </div>

      <div className="absolute bottom-8 right-8 md:right-16" aria-hidden="true">
        <span className="t-mono text-[0.5625rem] text-threshold-parchment/25">
          origin · undefined
        </span>
      </div>
    </section>
  );
}
