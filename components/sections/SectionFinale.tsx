'use client';

import { useEffect, useRef } from 'react';
import { useInView } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import MagneticButton from '@/components/ui-custom/MagneticButton';

gsap.registerPlugin(ScrollTrigger);

interface SectionReturnProps {
  onBeginAgain: () => void;
}

export default function SectionReturn({ onBeginAgain }: SectionReturnProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-10%' });

  useEffect(() => {
    if (!isInView) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.from('.return-heading', { y: '108%', duration: 1.4, stagger: 0.15 })
        .from('.return-body', { opacity: 0, y: 16, duration: 1, stagger: 0.1 }, '-=0.6')
        .from('.return-rule', { scaleX: 0, duration: 1.5 }, '-=0.8')
        .from('.return-cta', { opacity: 0, y: 10, duration: 0.8, stagger: 0.1 }, '-=0.4')
        .from('.return-footer', { opacity: 0, duration: 1 }, '-=0.2');
    }, sectionRef);
    return () => ctx.revert();
  }, [isInView]);

  return (
    <section
      ref={sectionRef}
      data-section="5"
      id="return"
      className="section-void flex flex-col items-center justify-center text-center px-8 md:px-16 lg:px-24 py-32 min-h-screen"
      aria-label="Impact — the cycle of creation continues"
    >
      <div className="max-w-4xl mx-auto w-full">

        <div className="flex items-center justify-center gap-4 mb-16">
          <div className="h-px w-8 bg-threshold-parchment/25" />
          <span className="t-label text-[0.58rem] text-threshold-parchment/45">
            06 / IMPACT — Every ending is a new starting point
          </span>
          <div className="h-px w-8 bg-threshold-parchment/25" />
        </div>

        <div className="mb-6">
          {['The product', 'ships.', 'The idea', 'evolves.'].map((word, i) => (
            <div key={i} className="overflow-hidden inline-block mr-[0.25em]">
              <span
                className="return-heading inline-block t-hero"
                style={{
                  color: i === 1 || i === 3 ? 'var(--gold)' : 'var(--parchment)',
                  fontStyle: i === 1 || i === 3 ? 'italic' : 'normal',
                }}
              >
                {word}
              </span>
            </div>
          ))}
        </div>

        <div className="return-rule mx-auto my-12 h-px w-24 bg-threshold-parchment/12 origin-center" />

        <p className="return-body t-body mx-auto mb-5 text-threshold-parchment/60 max-w-[44ch] leading-[2]">
          What you witnessed here — from signal to connection, from connection
          to system, from system to product — is not a metaphor. It is the
          actual shape of how things get built.
        </p>
        <p className="return-body t-body mx-auto mb-16 text-threshold-parchment/60 max-w-[44ch] leading-[2]">
          Every version ships carrying the architecture of its origins.
          Every team that built it leaves an invisible structure behind.
          The next version begins where this one ends — at the threshold.
        </p>

        <div className="return-cta flex flex-col sm:flex-row items-center justify-center gap-5 mb-24">
          <MagneticButton variant="primary" onClick={onBeginAgain}>
            Begin the Process Again
          </MagneticButton>
          <MagneticButton variant="ghost">
            View the work →
          </MagneticButton>
        </div>

        <div className="return-body mb-16">
          <div className="t-label text-[0.55rem] text-threshold-parchment/40 mb-3">
            THE PROCESS
          </div>
          <div className="t-mono text-[0.6rem] text-threshold-parchment/40 leading-[2.2]">
            01 &nbsp; signal detected &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; idea arrives alone<br />
            02 &nbsp; connections mapped &nbsp;&nbsp; relationships defined<br />
            03 &nbsp; system assembled &nbsp;&nbsp;&nbsp; structure emerges<br />
            <span className="text-threshold-gold/65">
              04 &nbsp; product ships &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; impact begins
            </span>
          </div>
        </div>

        <div className="return-footer border-t border-threshold-parchment/8 pt-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="geo-mark" aria-hidden="true" />
              <span className="t-label text-[0.55rem] text-threshold-parchment/45 tracking-[0.2em]">
                THRESHOLD
              </span>
            </div>
            <span className="t-mono text-[0.55rem] text-threshold-parchment/35">
              idea · connection · system · product · impact
            </span>
            <span className="t-mono text-[0.55rem] text-threshold-parchment/35">
              MMXXV
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
