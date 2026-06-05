'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function useLenis() {
  const lenisRef = useRef<any>(null);

  useEffect(() => {
    let lenis: any;

    const init = async () => {
      const Lenis = (await import('lenis')).default;
      lenis = new Lenis({
        duration: 1.3,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 0.9,
        touchMultiplier: 2,
      });
      lenisRef.current = lenis;

      // Sync with GSAP ticker for ScrollTrigger compatibility
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    };

    init();

    return () => {
      if (lenisRef.current) {
        lenisRef.current.destroy();
        gsap.ticker.remove((time: number) => lenisRef.current?.raf(time * 1000));
      }
    };
  }, []);

  return lenisRef;
}
