"use client";

import WorldMap from "@/components/WorldMap";
import Link from "next/link";
import { motion } from "framer-motion";

export default function LandingPage() {
  return (
    <div className="bg-background text-on-surface selection:bg-primary selection:text-on-primary min-h-screen flex flex-col overflow-hidden">
      {/* Main Hero Canvas */}
      <main className="relative flex-1 flex flex-col items-center justify-center">
        {/* Background Overlay with Spread World Map */}
        <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
          <WorldMap className="opacity-100" />
        </div>

        {/* Hero Content Stack */}
        <motion.section 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ 
            opacity: 1, 
            scale: 1,
            y: [0, -15, 0] // Subtle floating effect
          }}
          transition={{ 
            opacity: { duration: 1 },
            scale: { duration: 1 },
            y: { duration: 6, repeat: Infinity, ease: "easeInOut" }
          }}
          className="relative z-20 flex flex-col items-center text-center px-6 max-w-4xl"
        >
          {/* Hexagonal Lock Icon - Centered Alignment */}
          <motion.div 
            animate={{ scale: [1, 1.06, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="mb-6 flex items-center justify-center w-16 h-16 relative bg-primary/10 rounded-[1.2rem] border-[1.5px] border-primary/20 group mx-auto"
          >
            <span className="material-symbols-outlined text-primary text-3xl leading-none" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
            <div className="absolute inset-0 border-[1.5px] border-primary/30 rounded-[1.2rem] scale-110 opacity-50"></div>
          </motion.div>

          {/* Title & Subtitle */}
          <h1 className="font-headline text-[84px] leading-none text-on-surface mb-2 font-bold tracking-tight">
            VERITAS
          </h1>
          <p className="font-mono text-[10px] uppercase tracking-[0.6em] text-primary mb-12">
            STRATEGIC INTELLIGENCE
          </p>

          {/* Large Initiate Scan Bar - Replaces Search Bar */}
          <div className="w-full max-w-lg relative group">
            <motion.div 
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-primary/5 blur-xl group-hover:opacity-100 transition-opacity duration-700"
            ></motion.div>
            <Link 
              href="/dashboard"
              className="relative w-full bg-primary hover:bg-primary/90 hover:scale-[1.02] active:scale-95 transition-all duration-[cubic-bezier(0.16,1,0.3,1)] text-on-primary font-label font-bold uppercase tracking-[0.3em] text-xs py-5 rounded-[12px] flex items-center justify-center gap-4 shadow-[0_20px_40px_rgba(255,215,0,0.15)]"
            >
              INITIATE SCAN <span className="material-symbols-outlined text-lg">bolt</span>
            </Link>
          </div>

          {/* Floating Data Metrics */}
          <div className="grid grid-cols-3 gap-8 mt-20 w-full">
            {[
              { val: "99.8%", label: "Defense Accuracy" },
              { val: "1.2M", label: "Threats Neutralized" },
              { val: "0.03ms", label: "Kernel Latency" }
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 + i * 0.2 }}
                className="text-left border-l-[1.5px] border-primary/20 pl-6"
              >
                <span className="font-headline text-3xl text-on-surface block">{stat.val}</span>
                <span className="font-mono text-[9px] uppercase tracking-widest text-primary/40">{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </main>
    </div>
  );
}
