'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface NavigationDotsProps {
  activeSection: number;
  labels: string[];
  isOnLight: boolean;
  onNavigate: (idx: number) => void;
}

export default function NavigationDots({
  activeSection,
  labels,
  isOnLight,
  onNavigate,
}: NavigationDotsProps) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <nav className="nav-dots" aria-label="Section navigation">
      {labels.map((label, i) => (
        <motion.div
          key={i}
          className="nav-dot-wrap"
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 + i * 0.07, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          onMouseEnter={() => setHovered(i)}
          onMouseLeave={() => setHovered(null)}
        >
          <span
            className={`nav-dot-label ${isOnLight ? 'on-light' : ''} ${hovered === i || activeSection === i ? 'visible' : ''}`}
          >
            {label}
          </span>
          <button
            aria-label={`Go to ${label}`}
            data-cursor="hover"
            className={`nav-dot ${activeSection === i ? 'active' : ''}`}
            style={isOnLight && activeSection !== i ? { background: 'rgba(21,21,21,0.2)' } : undefined}
            onClick={() => onNavigate(i)}
          />
        </motion.div>
      ))}
    </nav>
  );
}
