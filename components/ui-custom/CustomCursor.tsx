'use client';

import { useEffect, useRef, useState } from 'react';

interface CustomCursorProps {
  isOnLight: boolean;
}

export default function CustomCursor({ isOnLight }: CustomCursorProps) {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const coordRef = useRef<HTMLDivElement>(null);
  const ringPos = useRef({ x: -100, y: -100 });
  const target = useRef({ x: -100, y: -100 });
  const raf = useRef<number>(0);
  const [hovering, setHovering] = useState(false);
  const [clicking, setClicking] = useState(false);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    const coord = coordRef.current;
    if (!dot || !ring || !coord) return;

    const onMove = (e: MouseEvent) => {
      target.current = { x: e.clientX, y: e.clientY };
      dot.style.left = `${e.clientX}px`;
      dot.style.top = `${e.clientY}px`;
      coord.style.left = `${e.clientX}px`;
      coord.style.top = `${e.clientY}px`;

      const nx = ((e.clientX / window.innerWidth) - 0.5).toFixed(3);
      const ny = (-(e.clientY / window.innerHeight - 0.5)).toFixed(3);
      coord.innerHTML = `${nx}<br>${ny}`;
    };

    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      setHovering(!!t.closest('a, button, [data-cursor="hover"], input, select, label, [role="button"]'));
    };

    const onDown = () => setClicking(true);
    const onUp = () => setClicking(false);

    window.addEventListener('mousemove', onMove);
    document.addEventListener('mouseover', onOver);
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);

    const lerp = (a: number, b: number, n: number) => a + (b - a) * n;

    const animate = () => {
      ringPos.current.x = lerp(ringPos.current.x, target.current.x, 0.1);
      ringPos.current.y = lerp(ringPos.current.y, target.current.y, 0.1);
      ring.style.left = `${ringPos.current.x}px`;
      ring.style.top = `${ringPos.current.y}px`;
      raf.current = requestAnimationFrame(animate);
    };
    raf.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  const lightClass = isOnLight ? 'on-light' : '';

  return (
    <>
      <div ref={dotRef} className={`cursor-dot ${lightClass} ${hovering ? 'hovering' : ''} ${clicking ? 'clicking' : ''}`} />
      <div ref={ringRef} className={`cursor-ring ${lightClass} ${hovering ? 'hovering' : ''} ${clicking ? 'clicking' : ''}`} />
      <div ref={coordRef} className={`cursor-coords ${lightClass}`} />
    </>
  );
}
