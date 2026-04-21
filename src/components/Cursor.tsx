"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

export default function Cursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let animationFrameId: number;
    let currentX = 0;
    let currentY = 0;

    const animateRing = () => {
      const ring = ringRef.current;
      if (!ring) return;
      
      const dx = position.x - currentX;
      const dy = position.y - currentY;
      
      currentX += dx * 0.15; // smooth follow
      currentY += dy * 0.15;
      
      ring.style.transform = `translate3d(${currentX - 24}px, ${currentY - 24}px, 0)`;
      animationFrameId = requestAnimationFrame(animateRing);
    };

    animationFrameId = requestAnimationFrame(animateRing);

    return () => cancelAnimationFrame(animationFrameId);
  }, [position]);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        ['button', 'a', 'input'].includes(target.tagName.toLowerCase()) ||
        target.closest("button") || target.closest("a") || target.closest("input")
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, []);

  return (
    <>
      {/* Outer trailing ring */}
      <div 
        ref={ringRef}
        style={{
          position: "fixed", top: 0, left: 0, width: 48, height: 48,
          border: "1px solid rgba(255, 255, 255, 0.4)", borderRadius: "50%",
          pointerEvents: "none", zIndex: 9998,
          transition: "width 0.3s, height 0.3s, opacity 0.3s",
          opacity: isHovering ? 0 : 1,
        }}
      />
      {/* Central fixed dot */}
      <motion.div
        animate={{
          x: position.x - (isHovering ? 20 : 4),
          y: position.y - (isHovering ? 20 : 4),
          width: isHovering ? 40 : 8,
          height: isHovering ? 40 : 8,
          opacity: isHovering ? 0.2 : 1,
        }}
        transition={{ type: "spring", stiffness: 1000, damping: 50, mass: 0.1 }}
        style={{
          position: "fixed", top: 0, left: 0,
          backgroundColor: "#fff", borderRadius: "50%",
          pointerEvents: "none", zIndex: 9999,
          mixBlendMode: "difference"
        }}
      />
    </>
  );
}
