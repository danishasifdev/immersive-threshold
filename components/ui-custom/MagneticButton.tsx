"use client";

import { useRef, useCallback, useEffect } from "react";

interface MagneticButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "dark" | "ghost";
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit";
}

export default function MagneticButton({
  children,
  variant = "primary",
  onClick,
  className = "",
  disabled = false,
  type = "button",
}: MagneticButtonProps) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const rafRef = useRef<number>(0);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const el = btnRef.current;
      if (!el || disabled) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const radius = 90;
      cancelAnimationFrame(rafRef.current);
      if (dist < radius) {
        rafRef.current = requestAnimationFrame(() => {
          if (el)
            el.style.transform = `translate(${dx * 0.45}px, ${dy * 0.45}px)`;
        });
      } else {
        rafRef.current = requestAnimationFrame(() => {
          if (el) el.style.transform = `translate(0,0)`;
        });
      }
    },
    [disabled],
  );

  const handleMouseLeave = useCallback(() => {
    const el = btnRef.current;
    if (!el) return;
    cancelAnimationFrame(rafRef.current);
    el.style.transition = `transform 0.55s cubic-bezier(0.16,1,0.3,1)`;
    el.style.transform = `translate(0,0)`;
  }, []);

  const handleMouseEnter = useCallback(() => {
    const el = btnRef.current;
    if (!el) return;
    el.style.transition = `transform 0.12s cubic-bezier(0.16,1,0.3,1)`;
  }, []);

  useEffect(() => {
    const el = btnRef.current;
    if (!el) return;
    window.addEventListener("mousemove", handleMouseMove);
    el.addEventListener("mouseleave", handleMouseLeave);
    el.addEventListener("mouseenter", handleMouseEnter);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseleave", handleMouseLeave);
      el.removeEventListener("mouseenter", handleMouseEnter);
      cancelAnimationFrame(rafRef.current);
    };
  }, [handleMouseMove, handleMouseLeave, handleMouseEnter]);

  const variantClass =
    variant === "primary"
      ? "mag-btn-primary"
      : variant === "dark"
        ? "mag-btn-dark"
        : "mag-btn-ghost";

  return (
    <button
      ref={btnRef}
      type={type}
      className={`mag-btn ${variantClass} ${className}`}
      onClick={onClick}
      disabled={disabled}
      data-cursor="hover"
    >
      <span className="mag-btn-fill" aria-hidden="true" />
      <span className="mag-btn-text">{children}</span>
    </button>
  );
}
