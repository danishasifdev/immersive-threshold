'use client';

import { useEffect, useState } from 'react';

export function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  const [section, setSection] = useState(0);

  useEffect(() => {
    const update = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const prog = docHeight > 0 ? Math.min(1, scrollTop / docHeight) : 0;
      setProgress(prog);

      // Detect active section via data-section attributes
      const sections = document.querySelectorAll('[data-section]');
      let current = 0;
      sections.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top <= window.innerHeight * 0.5) {
          current = parseInt((el as HTMLElement).dataset.section ?? '0', 10);
        }
      });
      setSection(current);
    };

    window.addEventListener('scroll', update, { passive: true });
    update();
    return () => window.removeEventListener('scroll', update);
  }, []);

  return { progress, section };
}
