"use client";

import React, { useEffect, useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Line,
  Marker,
} from "react-simple-maps";
import { motion } from "framer-motion";

const MotionLine = motion(Line);

// TopoJSON URL for countries
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

export default function WorldMap({ className }: { className?: string }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  // Tactical Nodes
  const nodes = [
    { coordinates: [-74.006, 40.7128], name: "ALPHA_US" },
    { coordinates: [2.3522, 48.8566], name: "BETA_EU" },
    { coordinates: [139.6503, 35.6762], name: "GAMMA_ASIA" },
    { coordinates: [-58.3816, -34.6037], name: "DELTA_SA" },
    { coordinates: [18.4241, -33.9249], name: "EPSILON_AF" },
    { coordinates: [151.2093, -33.8688], name: "ZETA_AU" },
  ];

  // Tactical Signals
  const signals = [
    { from: nodes[0].coordinates, to: nodes[1].coordinates },
    { from: nodes[1].coordinates, to: nodes[2].coordinates },
    { from: nodes[2].coordinates, to: nodes[5].coordinates },
    { from: nodes[0].coordinates, to: nodes[3].coordinates },
    { from: nodes[1].coordinates, to: nodes[4].coordinates },
  ];

  return (
    <div className={`relative w-full h-full flex items-center justify-center overflow-hidden bg-background ${className}`}>
      {/* Background Tactical Grid */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[linear-gradient(rgba(255,215,0,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(255,215,0,0.2)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      
      {/* Background Radial Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,215,0,0.08)_0%,_transparent_70%)] pointer-events-none"></div>

      {/* Background Tactile Grid - Breathing Effect */}
      <motion.div 
        animate={{ opacity: [0.15, 0.35, 0.15] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(255,215,0,0.5)_1.5px,transparent_1.5px),linear-gradient(90deg,rgba(255,215,0,0.5)_1.5px,transparent_1.5px)] bg-[size:50px_50px]"
      ></motion.div>

      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ scale: 100 }}
        className="w-full h-full max-w-[1400px]"
      >
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="rgba(255, 215, 0, 0.25)"
                stroke="var(--primary)"
                strokeWidth={2.0}
                strokeOpacity={1.0}
                style={{
                  default: { outline: "none" },
                  hover: { fill: "rgba(255, 215, 0, 0.5)", outline: "none" },
                  pressed: { outline: "none" },
                }}
              />
            ))
          }
        </Geographies>

        {/* Signals */}
        {signals.map((sig, i) => (
          <Line
            key={i}
            from={sig.from as [number, number]}
            to={sig.to as [number, number]}
            stroke="var(--primary)"
            strokeWidth={2}
            strokeDasharray="4 4"
            strokeOpacity={0.6}
          />
        ))}

        {/* Animated Signal Pulses - Faster & More Frequent */}
        {signals.map((sig, i) => (
          <React.Fragment key={`sig-pulse-${i}`}>
            <motion.g>
              <MotionLine
                from={sig.from as [number, number]}
                to={sig.to as [number, number]}
                stroke="var(--primary)"
                strokeWidth={4}
                strokeDasharray="100 1000"
                initial={{ strokeDashoffset: 1100 }}
                animate={{ strokeDashoffset: 0 }}
                transition={{
                  duration: 2, // Faster pulse
                  repeat: Infinity,
                  delay: i * 0.4,
                  ease: "linear",
                }}
              />
            </motion.g>
            {/* Secondary offset pulse for more "traffic" */}
            <motion.g>
              <MotionLine
                from={sig.from as [number, number]}
                to={sig.to as [number, number]}
                stroke="var(--primary)"
                strokeWidth={2}
                strokeDasharray="50 1500"
                initial={{ strokeDashoffset: 1500 }}
                animate={{ strokeDashoffset: 0 }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  delay: i * 0.8 + 1,
                  ease: "linear",
                }}
              />
            </motion.g>
          </React.Fragment>
        ))}

        {/* Nodes */}
        {nodes.map((node, i) => (
          <Marker key={i} coordinates={node.coordinates as [number, number]}>
            <motion.circle
              r={8}
              fill="var(--primary)"
              animate={{ 
                r: [8, 12, 8],
                opacity: [0.6, 0.2, 0.6]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <circle
              r={4}
              fill="var(--primary)"
            />
          </Marker>
        ))}
      </ComposableMap>
    </div>
  );
}
