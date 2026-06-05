"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface HeaderProps {
  isOnLight: boolean;
}

export default function Header({ isOnLight }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => {
    const unsub = scrollY.on("change", (v) => setScrolled(v > 80));
    return () => unsub();
  }, [scrollY]);

  const textClass = isOnLight
    ? "text-threshold-ink"
    : "text-threshold-parchment";

  return (
    <header
      className={`site-header ${scrolled ? "scrolled" : ""} ${isOnLight ? "on-light" : ""}`}
    >
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-3"
        >
          <div className="geo-mark" aria-hidden="true" />
          <span className={`t-label text-[0.6rem] opacity-65 ${textClass}`}>
            THRESHOLD
          </span>
        </motion.div>

        <motion.nav
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.25 }}
          className="hidden md:flex items-center gap-10"
          aria-label="Site sections"
        >
          {[
            { label: "IDEA", href: "#axiom" },
            { label: "SYSTEM", href: "#form" },
            { label: "IMPACT", href: "#return" },
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              data-cursor="hover"
              className={`t-label text-[0.58rem] opacity-50 hover:opacity-[0.85] transition-opacity duration-300 ${textClass}`}
            >
              {item.label}
            </a>
          ))}
        </motion.nav>

        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <span
            className={`t-mono hidden md:block text-[0.525rem] opacity-35 ${textClass}`}
          >
            idea · system · impact
          </span>
        </motion.div>
      </div>
    </header>
  );
}
