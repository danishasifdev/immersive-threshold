"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { useLenis } from "@/hooks/useLenis";
import { useScrollProgress } from "@/hooks/useScrollProgress";

const ThresholdScene = dynamic(() => import("@/components/3d/Scene"), {
  ssr: false,
});
const CustomCursor = dynamic(
  () => import("@/components/ui-custom/CustomCursor"),
  { ssr: false },
);
const NavigationDots = dynamic(
  () => import("@/components/ui-custom/NavigationDots"),
  { ssr: false },
);

import Header from "@/components/ui-custom/Header";
import SectionVoid from "@/components/sections/SectionArrival";
import SectionAxiom from "@/components/sections/SectionDiscovery";
import SectionEdge from "@/components/sections/SectionTransformation";
import SectionForm from "@/components/sections/SectionIntelligence";
import SectionInhabit from "@/components/sections/SectionImpact";
import SectionReturn from "@/components/sections/SectionFinale";

export interface SceneControls {
  roughness: number;
  metalness: number;
  wireframe: boolean;
  orbitEnabled: boolean;
  burstCount: number;
  dissolveCount: number;
}

const SECTION_NAMES = [
  "ORIGIN",
  "IDEA",
  "CONNECTION",
  "SYSTEM",
  "PRODUCT",
  "IMPACT",
];

export default function ThresholdPage() {
  useLenis();
  const { progress, section: activeSection } = useScrollProgress();

  const [mounted, setMounted] = useState(false);
  const [mouseNorm, setMouseNorm] = useState({ x: 0, y: 0 });
  const [controls, setControls] = useState<SceneControls>({
    roughness: 0.5,
    metalness: 0.3,
    wireframe: false,
    orbitEnabled: false,
    burstCount: 0,
    dissolveCount: 0,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      setMouseNorm({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      });
    };
    window.addEventListener("mousemove", handle);
    return () => window.removeEventListener("mousemove", handle);
  }, []);

  const onBurst = useCallback(() => {
    setControls((c) => ({ ...c, burstCount: c.burstCount + 1 }));
  }, []);

  const onToggleWireframe = useCallback(() => {
    setControls((c) => ({ ...c, wireframe: !c.wireframe }));
  }, []);

  const onRoughnessChange = useCallback((v: number) => {
    setControls((c) => ({ ...c, roughness: v }));
  }, []);

  const onMetalnessChange = useCallback((v: number) => {
    setControls((c) => ({ ...c, metalness: v }));
  }, []);

  const onToggleOrbit = useCallback(() => {
    setControls((c) => ({ ...c, orbitEnabled: !c.orbitEnabled }));
  }, []);

  const onDissolve = useCallback(() => {
    setControls((c) => ({ ...c, dissolveCount: c.dissolveCount + 1 }));
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }, 800);
  }, []);

  const onBeginAgain = useCallback(() => {
    setControls({
      roughness: 0.5,
      metalness: 0.3,
      wireframe: false,
      orbitEnabled: false,
      burstCount: 0,
      dissolveCount: 0,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const navigateTo = useCallback((idx: number) => {
    const sections = document.querySelectorAll("[data-section]");
    if (sections[idx]) {
      sections[idx].scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  const onLightSection = activeSection >= 1 && activeSection <= 3;

  return (
    <>
      <div className="noise" aria-hidden="true" />
      {mounted && <CustomCursor isOnLight={onLightSection} />}

      {/* Fixed 3D canvas — always present, fades on finale */}
      <div
        className="canvas-fixed"
        style={{
          zIndex: 1,
          opacity: activeSection === 5 ? 0.3 : 1,
          transition: "opacity 1.5s ease",
          pointerEvents: controls.orbitEnabled ? "auto" : "none",
        }}
      >
        {mounted && (
          <ThresholdScene
            phase={activeSection}
            scrollProgress={progress}
            mouseX={mouseNorm.x}
            mouseY={mouseNorm.y}
            controls={controls}
            isOnLight={onLightSection}
          />
        )}
      </div>

      {mounted && (
        <NavigationDots
          activeSection={activeSection}
          labels={SECTION_NAMES}
          isOnLight={onLightSection}
          onNavigate={navigateTo}
        />
      )}

      <Header isOnLight={onLightSection} />

      {/* Progress line */}
      <div
        className="progress-bar"
        style={{ width: `${progress * 100}%` }}
        role="progressbar"
        aria-valuenow={Math.round(progress * 100)}
        aria-valuemin={0}
        aria-valuemax={100}
      />

      <main style={{ position: "relative", zIndex: 2 }}>
        <SectionVoid onBurst={onBurst} />
        <SectionAxiom
          wireframe={controls.wireframe}
          onToggleWireframe={onToggleWireframe}
        />
        <SectionEdge
          wireframe={controls.wireframe}
          onToggleWireframe={onToggleWireframe}
        />
        <SectionForm
          roughness={controls.roughness}
          metalness={controls.metalness}
          onRoughnessChange={onRoughnessChange}
          onMetalnessChange={onMetalnessChange}
        />
        <SectionInhabit
          orbitEnabled={controls.orbitEnabled}
          onToggleOrbit={onToggleOrbit}
          onDissolve={onDissolve}
        />
        <SectionReturn onBeginAgain={onBeginAgain} />
      </main>
    </>
  );
}
