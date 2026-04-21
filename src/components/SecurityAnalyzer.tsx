"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import gsap from "gsap";
import { ShieldCheck, ShieldAlert, Loader2, Sparkles, LockKeyhole } from "lucide-react";
import { analyzePasswordMetrics } from "@/app/actions/analyze";
import { zxcvbn } from "zxcvbn-ts";

// Utility: HIBP WebCrypto Check
async function checkHIBP(password: string): Promise<number> {
  if (!password) return 0;
  
  const buffer = new TextEncoder().encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-1", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("").toUpperCase();
  
  const prefix = hashHex.slice(0, 5);
  const suffix = hashHex.slice(5);

  try {
    const res = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
    const text = await res.text();
    for (const line of text.split("\n")) {
      const [lineSuffix, count] = line.split(":");
      if (lineSuffix.trim() === suffix) {
        return parseInt(count, 10);
      }
    }
  } catch (err) {
    console.error("HIBP Error", err);
  }
  return 0;
}

// Sub-component: Scramble Text Reveal
function ScrambledText({ text }: { text: string | null }) {
  const [display, setDisplay] = useState("");
  useEffect(() => {
    if (!text) { setDisplay(""); return; }
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplay(text.split("").map((letter, index) => {
        if(index < iteration) return text[index];
        return "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%"[Math.floor(Math.random() * 41)];
      }).join(""));
      if(iteration >= text.length) clearInterval(interval);
      iteration += 1;
    }, 15);
    return () => clearInterval(interval);
  }, [text]);

  return <span style={{ fontFamily: 'monospace', letterSpacing: '-0.02em', lineHeight: 1.6 }}>{display}</span>;
}

// Sub-component: Animated Number
function AnimatedNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const startValue = display;
    const diff = value - startValue;
    let startTime: number | null = null;
    const duration = 600;

    const animate = (now: number) => {
      if (!startTime) startTime = now;
      const progress = Math.min((now - startTime) / duration, 1);
      // easeOutExpo
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setDisplay(Math.floor(startValue + diff * ease));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);
  return <span>{display}</span>;
}

export default function SecurityAnalyzer() {
  const [password, setPassword] = useState("");
  const [breaches, setBreaches] = useState<number | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [aiVerdict, setAiVerdict] = useState<string | null>(null);
  const [verdictLoading, setVerdictLoading] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Magnetic Physics
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 150, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 150, damping: 20 });
  const rotateX = useTransform(springY, [-500, 500], [15, -15]);
  const rotateY = useTransform(springX, [-500, 500], [-15, 15]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    mouseX.set(x);
    mouseY.set(y);
  };
  const handleMouseLeave = () => { mouseX.set(0); mouseY.set(0); };

  // Analysis
  const analysis = password ? zxcvbn(password) : null;
  const score = analysis ? analysis.score : 0; 
  const crackTime = analysis ? analysis.crack_times_display.offline_fast_hashing_1e11_per_second : "0 secs";
  const entropy = analysis ? Math.floor(analysis.guesses_log10 * 3.32) : 0;

  // Background Mesh Colors
  const colors = [
    'rgba(20,20,20,0.8)', // 0: gray/black
    'rgba(220, 38, 38, 0.3)', // 1: red
    'rgba(234, 179, 8, 0.3)', // 2: yellow
    'rgba(59, 130, 246, 0.3)', // 3: blue
    'rgba(16, 185, 129, 0.3)' // 4: green
  ];
  const activeColor = score === 0 && password.length === 0 ? colors[0] : colors[score];

  // Logic
  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (!password) {
      setBreaches(null);
      setAiVerdict(null);
      return;
    }
    timeoutRef.current = setTimeout(async () => {
      setIsChecking(true);
      const count = await checkHIBP(password);
      setBreaches(count);
      setIsChecking(false);
      
      setVerdictLoading(true);
      const verdict = await analyzePasswordMetrics(entropy, crackTime, count);
      setAiVerdict(verdict);
      setVerdictLoading(false);
    }, 800);
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, [password, entropy, crackTime]);

  // Entrance GSAP Timeline
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".reveal-elem", {
        y: 40,
        opacity: 0,
        filter: "blur(10px)",
        stagger: 0.15,
        duration: 1.2,
        ease: "power3.out",
        delay: 0.2
      });
      gsap.to(".bg-mesh", {
        rotation: 360,
        duration: 40,
        repeat: -1,
        ease: "linear"
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div 
      ref={containerRef}
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, minHeight: '100vh', position: 'relative', overflow: 'hidden' }}
    >
      {/* Ambient Animated Mesh Background */}
      <motion.div 
        className="bg-mesh"
        animate={{ backgroundColor: activeColor }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        style={{
          position: 'absolute', top: '20%', left: '20%', width: '60vw', height: '60vw',
          borderRadius: '50%', filter: 'blur(100px)', zIndex: 0, opacity: 0.6,
          transformOrigin: 'center center'
        }}
      />

      <motion.div 
        layout
        className="liquid-glass"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ 
          width: '100%', maxWidth: '800px', padding: '4rem', display: 'flex', flexDirection: 'column', gap: '3rem', zIndex: 10,
          rotateX, rotateY, transformPerspective: 1200
        }}
      >
        <div className="reveal-elem" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <LockKeyhole size={36} color="var(--foreground)" style={{ opacity: 0.8 }} />
          <div>
            <h1 style={{ fontSize: '3.5rem', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1, textTransform: 'uppercase' }} className="glow-text">
              Veritas
            </h1>
            <p style={{ opacity: 0.5, fontSize: '1rem', letterSpacing: '0.1em', marginTop: '0.5rem', textTransform: 'uppercase' }}>
              Strategic Intelligence
            </p>
          </div>
        </div>

        <div className="reveal-elem" style={{ position: 'relative' }}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="ENTER DIRECTIVE..."
            className="no-scrollbar"
            style={{
              width: '100%', padding: '1.5rem 0', fontSize: '2.5rem', fontWeight: 600, letterSpacing: '0.05em',
              border: 'none', borderBottom: '2px solid rgba(255,255,255,0.1)', background: 'transparent',
              color: 'var(--foreground)', outline: 'none', transition: 'border-color 0.3s ease',
              textAlign: 'center'
            }}
            onFocus={(e) => e.target.style.borderBottomColor = 'rgba(255,255,255,0.8)'}
            onBlur={(e) => e.target.style.borderBottomColor = 'rgba(255,255,255,0.1)'}
          />
          {isChecking && (
            <div style={{ position: 'absolute', right: '0rem', top: '50%', transform: 'translateY(-50%)' }}>
              <Loader2 className="animate-spin" size={24} color="rgba(255,255,255,0.5)" />
            </div>
          )}
        </div>

        <div className="reveal-elem" style={{ height: '2px', width: '100%', background: 'rgba(255,255,255,0.05)', overflow: 'hidden' }}>
          <motion.div
            style={{ 
              height: '100%', 
              background: breaches && breaches > 0 ? '#ef4444' : score === 0 ? 'transparent' : score < 3 ? '#eab308' : '#00ff88',
              boxShadow: breaches && breaches > 0 ? '0 0 10px #ef4444' : score < 3 ? '0 0 10px #eab308' : '0 0 10px #00ff88'
            }}
            initial={{ width: '0%' }}
            animate={{ width: `${(score / 4) * 100}%` }}
            transition={{ type: "spring", stiffness: 60, damping: 20 }}
          />
        </div>

        {password && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="reveal-elem"
            style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', textAlign: 'center' }}
          >
            <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ fontSize: '0.8rem', opacity: 0.5, textTransform: 'uppercase', marginBottom: '0.5rem' }}>Entropy</div>
              <div style={{ fontSize: '2rem', fontWeight: 700 }}><AnimatedNumber value={entropy} /><span style={{ fontSize: '1rem', opacity: 0.5 }}> bits</span></div>
            </div>
            <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ fontSize: '0.8rem', opacity: 0.5, textTransform: 'uppercase', marginBottom: '0.5rem' }}>Crack Time</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--accent)' }}>{crackTime}</div>
            </div>
            <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ fontSize: '0.8rem', opacity: 0.5, textTransform: 'uppercase', marginBottom: '0.5rem' }}>Network Leaks</div>
              <div style={{ fontSize: '2rem', fontWeight: 700, color: breaches && breaches > 0 ? '#ef4444' : '#00ff88' }}>
                {breaches === null ? <Loader2 className="animate-spin mx-auto" size={24} /> : <AnimatedNumber value={breaches} />}
              </div>
            </div>
          </motion.div>
        )}

        {(verdictLoading || aiVerdict) && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="reveal-elem"
            style={{ 
              marginTop: '1rem', padding: '2rem', borderRadius: '16px', 
              background: 'linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)', 
              border: '1px solid rgba(255,255,255,0.1)' 
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', color: 'var(--accent)' }}>
              <Sparkles size={20} />
              <span style={{ fontSize: '1rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Llama-3 Oracle Analytics</span>
            </div>
            
            {verdictLoading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="skeleton-dark" style={{ height: '16px', width: '100%', borderRadius: '4px' }} />
                <div className="skeleton-dark" style={{ height: '16px', width: '85%', borderRadius: '4px' }} />
                <div className="skeleton-dark" style={{ height: '16px', width: '90%', borderRadius: '4px' }} />
              </div>
            ) : (
              <div style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.1rem' }}>
                <ScrambledText text={aiVerdict} />
              </div>
            )}
          </motion.div>
        )}
      </motion.div>

      <style jsx global>{`
        .skeleton-dark {
          background-image: linear-gradient(90deg, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 75%);
          background-size: 200% 100%;
          animation: shimmerDark 1.5s infinite linear;
        }
        @keyframes shimmerDark {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
