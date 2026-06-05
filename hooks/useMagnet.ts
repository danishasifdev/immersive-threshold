'use client';

import { useEffect, useRef, useCallback } from 'react';

interface MagnetOptions {
  strength?: number;
  radius?: number;
}

export function useMagnet({ strength = 0.4, radius = 100 }: MagnetOptions = {}) {
  const ref = useRef<HTMLElement>(null);
  const animFrameRef = useRef<number>(0);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const el = ref.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      cancelAnimationFrame(animFrameRef.current);

      if (dist < radius) {
        const x = dx * strength;
        const y = dy * strength;
        animFrameRef.current = requestAnimationFrame(() => {
          el.style.transform = `translate(${x}px, ${y}px)`;
        });
      } else {
        animFrameRef.current = requestAnimationFrame(() => {
          el.style.transform = `translate(0px, 0px)`;
        });
      }
    },
    [strength, radius]
  );

  const handleMouseLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    cancelAnimationFrame(animFrameRef.current);
    el.style.transform = `translate(0px, 0px)`;
    el.style.transition = `transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)`;
  }, []);

  const handleMouseEnter = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transition = `transform 0.15s cubic-bezier(0.16, 1, 0.3, 1)`;
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    const el = ref.current;
    if (el) {
      el.addEventListener('mouseleave', handleMouseLeave);
      el.addEventListener('mouseenter', handleMouseEnter);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (el) {
        el.removeEventListener('mouseleave', handleMouseLeave);
        el.removeEventListener('mouseenter', handleMouseEnter);
      }
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [handleMouseMove, handleMouseLeave, handleMouseEnter]);

  return ref;
}
