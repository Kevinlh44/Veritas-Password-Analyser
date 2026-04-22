"use client";

import { useEffect, useRef } from "react";
import createGlobe from "cobe";

export default function Globe({ className, size = 600 }: { className?: string; size?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerInteracting = useRef<number | null>(null);
  const pointerInteractionStart = useRef(0);
  const phi = useRef(0);

  useEffect(() => {
    if (!canvasRef.current) return;

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: size * 2,
      height: size * 2,
      phi: 0,
      theta: 0,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [0.8, 0.7, 0.2],   // Bright yellow base for the structure/dots
      markerColor: [1, 0.84, 0],    // Bright Hazard Gold for active markers
      glowColor: [0.6, 0.5, 0.2],   // Strong golden glow for visibility
      markers: [
        { location: [37.7595, -122.4367], size: 0.03 },
        { location: [40.7128, -74.006], size: 0.1 },
        { location: [35.6895, 139.6917], size: 0.05 },
        { location: [51.5074, -0.1278], size: 0.05 },
        { location: [-33.8688, 151.2093], size: 0.05 },
        { location: [19.076, 72.8777], size: 0.05 },
      ],
    } as any);

    let rafId: number;
    const render = () => {
      if (!pointerInteracting.current) {
        phi.current += 0.005;
      }
      globe.update({ phi: phi.current });
      rafId = requestAnimationFrame(render);
    };
    rafId = requestAnimationFrame(render);

    return () => {
      globe.destroy();
      cancelAnimationFrame(rafId);
    };
  }, [size]);

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <canvas
        ref={canvasRef}
        onPointerDown={(e) => {
          pointerInteracting.current = e.clientX - pointerInteractionStart.current;
          canvasRef.current!.style.cursor = 'grabbing';
        }}
        onPointerUp={() => {
          pointerInteracting.current = null;
          canvasRef.current!.style.cursor = 'grab';
        }}
        onPointerOut={() => {
          pointerInteracting.current = null;
          canvasRef.current!.style.cursor = 'grab';
        }}
        onPointerMove={(e) => {
          if (pointerInteracting.current !== null) {
            const delta = e.clientX - pointerInteracting.current;
            pointerInteractionStart.current = delta;
            phi.current = delta / 200;
          }
        }}
        style={{ 
          width: size, 
          height: size, 
          maxWidth: "100%", 
          aspectRatio: 1,
          cursor: 'grab',
          userSelect: 'none',
          touchAction: 'none'
        }}
      />
    </div>
  );
}
