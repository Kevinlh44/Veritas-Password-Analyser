"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Globe from "@/components/Globe";
import { motion, AnimatePresence } from "framer-motion";

/* ── CONSTANTS ── */
const SECTIONS = {
  DASHBOARD: "DASHBOARD",
  KEY_GENERATOR: "KEY GENERATOR",
  BREACH_ANALYSIS: "BREACH ANALYSIS",
  NETWORK_TOPOLOGY: "NETWORK TOPOLOGY",
  CORE_INTELLIGENCE: "CORE INTELLIGENCE",
  SYSTEM_STATUS: "SYSTEM STATUS",
  OPERATOR_PROFILE: "OPERATOR PROFILE",
  SECURITY_CLEARANCE: "SECURITY CLEARANCE"
};

export default function DashboardPage() {
  const [activeSection, setActiveSection] = useState(SECTIONS.DASHBOARD);
  const [password, setPassword] = useState("");
  const [generatedKey, setGeneratedKey] = useState("");
  
  // Entropy calculation logic
  const calcE = (p: string) => {
    if (!p) return 0;
    let charset = 0;
    if (/[a-z]/.test(p)) charset += 26;
    if (/[A-Z]/.test(p)) charset += 26;
    if (/[0-9]/.test(p)) charset += 10;
    if (/[^a-zA-Z0-9]/.test(p)) charset += 32;
    return Math.floor(p.length * Math.log2(charset));
  };

  const b = calcE(password);
  const crackT = (bits: number) => {
    if (bits < 20) return "< 1s";
    if (bits < 40) return "2h";
    if (bits < 60) return "5Y";
    if (bits < 80) return "200Y";
    return "> 1000Y";
  };
  const risk = Math.max(0, 100 - Math.floor(b / 1.2));
  
  const getSegmentColor = (idx: number) => {
    const segments = Math.min(10, Math.ceil(b / 10));
    if (idx >= segments) return "bg-primary/10";
    if (b < 30) return "bg-secondary";
    if (b < 60) return "bg-primary/60";
    return "bg-primary";
  };

  const generateKey = () => {
    const charset = "ABCDEF0123456789";
    let key = "";
    for (let i = 0; i < 32; i++) {
      if (i > 0 && i % 8 === 0) key += "-";
      key += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setGeneratedKey(key);
  };

  return (
    <div className="bg-background text-on-surface font-body selection:bg-primary selection:text-on-primary min-h-screen">
      {/* SideNavBar */}
      <nav className="h-screen w-72 fixed left-0 top-0 flex flex-col z-40 tonal-sidebar py-8 gap-4">
        <div className="px-8 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary flex items-center justify-center rounded-lg shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined text-on-primary" style={{ fontVariationSettings: "'FILL' 1" }}>security</span>
            </div>
            <div>
              <h1 className="font-interface font-bold text-xl tracking-tighter text-primary uppercase">VERITAS</h1>
              <p className="font-interface font-bold uppercase tracking-[0.18em] text-[10px] text-primary/60">INTELLIGENCE HUB</p>
            </div>
          </div>
        </div>
        
        {/* Main Navigation */}
        <div className="flex flex-col flex-1 gap-1">
          {[
            { id: SECTIONS.DASHBOARD, icon: "dashboard" },
            { id: SECTIONS.KEY_GENERATOR, icon: "vpn_key" },
            { id: SECTIONS.BREACH_ANALYSIS, icon: "security_update_warning" },
            { id: SECTIONS.NETWORK_TOPOLOGY, icon: "hub" },
            { id: SECTIONS.CORE_INTELLIGENCE, icon: "memory" }
          ].map((item) => (
            <button 
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`flex items-center gap-4 px-8 py-4 transition-all duration-300 ${
                activeSection === item.id 
                ? "bg-primary/10 text-primary border-r-4 border-primary rounded-r-sm" 
                : "text-primary/40 hover:bg-primary/5 hover:text-primary"
              }`}
            >
              <span className="material-symbols-outlined" style={{ fontVariationSettings: activeSection === item.id ? "'FILL' 1" : "" }}>{item.icon}</span>
              <span className="font-interface font-bold uppercase tracking-[0.18em] text-xs">{item.id}</span>
            </button>
          ))}
        </div>

        {/* Bottom Sidebar */}
        <div className="px-8 mt-auto flex flex-col gap-1 border-t border-primary/10 pt-6">
          {[
            { id: SECTIONS.SYSTEM_STATUS, icon: "settings_input_component" },
            { id: SECTIONS.OPERATOR_PROFILE, icon: "account_circle" },
            { id: SECTIONS.SECURITY_CLEARANCE, icon: "verified_user" }
          ].map((item) => (
            <button 
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`flex items-center gap-4 py-3 transition-all duration-300 ${
                activeSection === item.id 
                ? "text-primary" 
                : "text-primary/40 hover:text-primary"
              }`}
            >
              <span className="material-symbols-outlined text-sm">{item.icon}</span>
              <span className="font-interface font-bold uppercase tracking-[0.18em] text-[10px]">{item.id}</span>
            </button>
          ))}
          <Link href="/" className="flex items-center gap-4 py-3 text-red-500/60 hover:text-red-500 transition-colors mt-4">
            <span className="material-symbols-outlined text-sm">logout</span>
            <span className="font-interface font-bold uppercase tracking-[0.18em] text-[10px]">TERMINATE SESSION</span>
          </Link>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="pl-72 min-h-screen">
        <div className="p-10 max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.3 }}
            >
              {activeSection === SECTIONS.DASHBOARD && (
                <div className="flex flex-col gap-10">
                  <header className="flex flex-col gap-1">
                    <h1 className="font-headline text-6xl text-primary uppercase">CENTRAL DASHBOARD</h1>
                    <p className="font-mono text-xs text-primary/40 tracking-[0.4em] uppercase">Status: System Optimal // Security Tier: 01</p>
                  </header>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    <div className="lg:col-span-2 space-y-10">
                      <section className="glass-panel rounded-[13px] p-8 shadow-sm">
                        <header className="flex justify-between items-center mb-10">
                          <h2 className="font-interface font-bold uppercase tracking-[0.18em] text-sm text-primary">VAULT ACCESS KEY ANALYSER</h2>
                          <span className="font-data text-xs text-primary px-3 py-1 bg-primary/5 rounded border border-primary/20">ENCRYPTION: AES-256-GCM</span>
                        </header>
                        <div className="space-y-8">
                          <div className="relative group">
                            <label className="absolute -top-3 left-4 bg-background px-2 font-interface font-bold text-[10px] tracking-widest text-primary/40 uppercase">INPUT VECTOR</label>
                            <input 
                              className="w-full bg-surface-container border-[1.5px] border-primary/20 rounded-[13px] px-6 py-5 font-data text-xl tracking-widest text-primary focus:outline-none focus:border-primary transition-all" 
                              placeholder="ENTER CANDIDATE STRING..." 
                              type="password" 
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                            />
                          </div>
                          <div className="flex gap-2 h-3 w-full">
                            {[...Array(10)].map((_, i) => (
                              <div key={i} className={`flex-1 rounded-full segment-transition ${getSegmentColor(i)} ${i < Math.min(10, Math.ceil(b/10)) ? 'scale-y-110' : ''}`}></div>
                            ))}
                          </div>
                        </div>
                      </section>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="glass-panel rounded-[13px] p-6 relative overflow-hidden">
                          <p className="font-data text-xs text-primary/40 mb-2 uppercase tracking-tighter">Entropy bits</p>
                          <h3 className="font-headline text-5xl text-primary">{b}</h3>
                          <div className="absolute bottom-0 left-0 w-full h-[3px] bg-primary" style={{ width: `${Math.min(100, b)}%` }}></div>
                        </div>
                        <div className="glass-panel rounded-[13px] p-6 relative overflow-hidden">
                          <p className="font-data text-xs text-primary/40 mb-2 uppercase tracking-tighter">Crack Time</p>
                          <h3 className="font-headline text-5xl text-primary">{crackT(b)}</h3>
                          <div className="absolute bottom-0 left-0 w-full h-[3px] bg-primary/40"></div>
                        </div>
                        <div className="glass-panel rounded-[13px] p-6 relative overflow-hidden">
                          <p className="font-data text-xs text-primary/40 mb-2 uppercase tracking-tighter">Risk Score</p>
                          <h3 className="font-headline text-5xl text-primary">{risk}</h3>
                          <div className="absolute bottom-0 left-0 w-full h-[3px] bg-secondary" style={{ width: `${risk}%` }}></div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-10">
                      <section className="glass-panel rounded-[13px] flex flex-col aspect-square overflow-hidden">
                        <header className="px-6 py-4 flex justify-between items-center border-b-[1.5px] border-primary/10 bg-primary/5">
                          <h2 className="font-interface font-bold uppercase tracking-[0.18em] text-xs text-primary/60">GLOBAL THREAT MAP</h2>
                          <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></div>
                            <span className="font-data text-[9px] text-primary uppercase">LIVE SYNC</span>
                          </div>
                        </header>
                        <div className="flex-1 relative group cursor-grab">
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <Globe size={256} className="opacity-80" />
                          </div>
                        </div>
                      </section>
                      
                      <section className="glass-panel rounded-[13px] flex flex-col overflow-hidden">
                        <div className="bg-primary/5 px-6 py-4 border-b-[1.5px] border-primary/10">
                          <h2 className="font-interface font-bold uppercase tracking-[0.18em] text-xs text-primary/60">DARK WEB INDEX</h2>
                        </div>
                        <div className="p-6 flex flex-col gap-4 font-data text-xs">
                          <div className="flex justify-between items-center">
                            <span className="text-primary font-bold">PASTEBIN MIRROR 3</span>
                            <span className="text-primary/40 uppercase">CLEAN</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-red-500 font-bold">SQL DUMP FORUM X</span>
                            <span className="text-red-500 uppercase animate-pulse">BREACHED</span>
                          </div>
                        </div>
                      </section>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === SECTIONS.KEY_GENERATOR && (
                <div className="flex flex-col gap-10">
                  <header className="flex flex-col gap-1">
                    <h1 className="font-headline text-6xl text-primary uppercase">KEY GENERATOR</h1>
                    <p className="font-mono text-xs text-primary/40 tracking-[0.4em] uppercase">SECURE CRYPTOGRAPHIC VECTOR PRODUCTION</p>
                  </header>
                  <section className="glass-panel rounded-[13px] p-12 flex flex-col items-center gap-8">
                    <div className="w-full max-w-2xl bg-surface-container border-[1.5px] border-primary/20 rounded-[13px] p-8 text-center font-data text-3xl text-primary tracking-[0.2em] break-all">
                      {generatedKey || "PRESS GENERATE TO START"}
                    </div>
                    <button 
                      onClick={generateKey}
                      className="bg-primary text-on-primary font-interface font-bold uppercase tracking-[0.3em] px-12 py-5 rounded-[12px] hover:scale-105 transition-all shadow-lg shadow-primary/20"
                    >
                      GENERATE NEW KEY
                    </button>
                  </section>
                </div>
              )}

              {activeSection === SECTIONS.BREACH_ANALYSIS && (
                <div className="flex flex-col gap-10">
                  <header className="flex flex-col gap-1">
                    <h1 className="font-headline text-6xl text-primary uppercase">BREACH ANALYSIS</h1>
                    <p className="font-mono text-xs text-primary/40 tracking-[0.4em] uppercase">HISTORICAL AND REAL-TIME EXPOSURE DATA</p>
                  </header>
                  <section className="glass-panel rounded-[13px] overflow-hidden">
                    <table className="w-full text-left font-data text-sm">
                      <thead>
                        <tr className="bg-primary/5 text-primary/40 border-b border-primary/10">
                          <th className="p-6">SOURCE</th>
                          <th className="p-6">IMPACT LEVEL</th>
                          <th className="p-6">STATUS</th>
                        </tr>
                      </thead>
                      <tbody className="text-primary/80">
                        <tr className="border-b border-primary/5">
                          <td className="p-6">CANVA_2019_EXPOSURE</td>
                          <td className="p-6 text-secondary">CRITICAL</td>
                          <td className="p-6">MITIGATED</td>
                        </tr>
                        <tr className="border-b border-primary/5">
                          <td className="p-6">ADOBE_LEGACY_DUMP</td>
                          <td className="p-6 text-red-500">HIGH</td>
                          <td className="p-6 font-bold text-red-500 animate-pulse">ACTIVE THREAT</td>
                        </tr>
                      </tbody>
                    </table>
                  </section>
                </div>
              )}

              {activeSection === SECTIONS.NETWORK_TOPOLOGY && (
                <div className="flex flex-col gap-10">
                  <header className="flex flex-col gap-1">
                    <h1 className="font-headline text-6xl text-primary uppercase">NETWORK TOPOLOGY</h1>
                    <p className="font-mono text-xs text-primary/40 tracking-[0.4em] uppercase">GLOBAL INFRASTRUCTURE MONITORING</p>
                  </header>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                      { node: "NODE_ALPHA_US", region: "NORTH AMERICA", ping: "22ms", status: "ONLINE" },
                      { node: "NODE_BETA_EU", region: "EUROPE", ping: "45ms", status: "ONLINE" },
                      { node: "NODE_GAMMA_ASIA", region: "ASIA PACIFIC", ping: "128ms", status: "ONLINE" },
                      { node: "NODE_DELTA_SA", region: "SOUTH AMERICA", ping: "0ms", status: "OFFLINE" }
                    ].map((node) => (
                      <div key={node.node} className="glass-panel rounded-[13px] p-6 space-y-4">
                        <div className="flex justify-between items-start">
                          <span className={`material-symbols-outlined ${node.status === 'ONLINE' ? 'text-primary' : 'text-red-500'}`}>router</span>
                          <span className={`font-interface text-[10px] font-bold px-2 py-0.5 rounded ${node.status === 'ONLINE' ? 'bg-primary/10 text-primary' : 'bg-red-500/10 text-red-500'}`}>{node.status}</span>
                        </div>
                        <div>
                          <h3 className="font-interface font-bold text-sm text-primary">{node.node}</h3>
                          <p className="font-data text-[10px] text-primary/40">{node.region}</p>
                        </div>
                        <div className="pt-2 border-t border-primary/5">
                          <p className="font-data text-[10px] text-primary/60">LATENCY: {node.ping}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeSection === SECTIONS.CORE_INTELLIGENCE && (
                <div className="flex flex-col gap-10">
                  <header className="flex flex-col gap-1">
                    <h1 className="font-headline text-6xl text-primary uppercase">CORE INTELLIGENCE</h1>
                    <p className="font-mono text-xs text-primary/40 tracking-[0.4em] uppercase">KERNEL AND LOGISTICAL PARAMETERS</p>
                  </header>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    <section className="lg:col-span-1 glass-panel rounded-[13px] p-8 space-y-6">
                      <h2 className="font-interface font-bold text-xs text-primary/40 uppercase tracking-widest">SYSTEM SPECIFICATIONS</h2>
                      <div className="space-y-4 font-data text-xs">
                        <div className="flex justify-between border-b border-primary/5 pb-2">
                          <span className="text-primary/60">KERNEL VERSION</span>
                          <span className="text-primary font-bold">V4.2.0-SECURE</span>
                        </div>
                        <div className="flex justify-between border-b border-primary/5 pb-2">
                          <span className="text-primary/60">UPTIME</span>
                          <span className="text-primary font-bold">142:22:04</span>
                        </div>
                        <div className="flex justify-between border-b border-primary/5 pb-2">
                          <span className="text-primary/60">ARCH</span>
                          <span className="text-primary font-bold">X86_64_VAULT</span>
                        </div>
                      </div>
                    </section>
                    <section className="lg:col-span-2 glass-panel rounded-[13px] p-8 flex flex-col gap-4">
                      <h2 className="font-interface font-bold text-xs text-primary/40 uppercase tracking-widest">REAL-TIME LOGS</h2>
                      <div className="flex-1 bg-black/40 rounded-lg p-6 font-data text-[11px] text-primary/60 space-y-2 overflow-hidden h-64 overflow-y-auto custom-scrollbar">
                        <p><span className="text-primary">[INFO]</span> INITIALIZING SECURE BOOT SEQUENCE...</p>
                        <p><span className="text-primary">[INFO]</span> LOADING ENCRYPTION MODULES [AES, RSA, ECC]</p>
                        <p><span className="text-primary">[INFO]</span> CONNECTING TO GLOBAL INTELLIGENCE NODES...</p>
                        <p><span className="text-secondary">[WARN]</span> LATENCY DETECTED IN ASIA PACIFIC RELAY</p>
                        <p><span className="text-primary">[INFO]</span> KERNEL STABILIZATION COMPLETE</p>
                        <p><span className="text-primary">[INFO]</span> READY FOR OPERATOR DIRECTIVES</p>
                      </div>
                    </section>
                  </div>
                </div>
              )}

              {activeSection === SECTIONS.SYSTEM_STATUS && (
                <div className="flex flex-col gap-10">
                  <header className="flex flex-col gap-1">
                    <h1 className="font-headline text-6xl text-primary uppercase">SYSTEM STATUS</h1>
                    <p className="font-mono text-xs text-primary/40 tracking-[0.4em] uppercase">HARDWARE AND THROUGHPUT MONITORING</p>
                  </header>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {[
                      { label: "CPU LOAD", value: 42, icon: "memory" },
                      { label: "MEMORY USAGE", value: 68, icon: "equalizer" },
                      { label: "NETWORK TRAFFIC", value: 15, icon: "speed" }
                    ].map((stat) => (
                      <section key={stat.label} className="glass-panel rounded-[13px] p-8 flex flex-col items-center text-center gap-6">
                        <span className="material-symbols-outlined text-4xl text-primary">{stat.icon}</span>
                        <div className="w-full">
                          <h3 className="font-interface font-bold text-sm text-primary uppercase mb-4">{stat.label}</h3>
                          <div className="w-full h-4 bg-primary/10 rounded-full overflow-hidden border border-primary/20">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${stat.value}%` }}
                              className="h-full bg-primary"
                            ></motion.div>
                          </div>
                          <p className="font-data text-2xl text-primary mt-4 font-bold">{stat.value}%</p>
                        </div>
                      </section>
                    ))}
                  </div>
                </div>
              )}

              {activeSection === SECTIONS.OPERATOR_PROFILE && (
                <div className="flex flex-col gap-10">
                  <header className="flex flex-col gap-1">
                    <h1 className="font-headline text-6xl text-primary uppercase">OPERATOR PROFILE</h1>
                    <p className="font-mono text-xs text-primary/40 tracking-[0.4em] uppercase">AUTHENTICATED PERSONNEL METRICS</p>
                  </header>
                  <section className="glass-panel rounded-[13px] p-10 flex flex-col md:flex-row gap-10 items-center">
                    <div className="w-32 h-32 rounded-[2rem] bg-primary/10 border-2 border-primary/20 flex items-center justify-center rotate-45 overflow-hidden">
                      <div className="-rotate-45">
                        <span className="material-symbols-outlined text-6xl text-primary">person</span>
                      </div>
                    </div>
                    <div className="flex-1 space-y-6">
                      <div>
                        <h2 className="font-headline text-4xl text-primary">OPERATOR 01</h2>
                        <p className="font-mono text-xs text-primary/40 uppercase tracking-[0.3em]">SENIOR INTELLIGENCE ANALYST</p>
                      </div>
                      <div className="grid grid-cols-2 gap-6 font-data text-xs">
                        <div>
                          <p className="text-primary/40 uppercase">UID</p>
                          <p className="text-primary font-bold">V-7729-ALPHA</p>
                        </div>
                        <div>
                          <p className="text-primary/40 uppercase">SESSIONS THIS MONTH</p>
                          <p className="text-primary font-bold">142</p>
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
              )}

              {activeSection === SECTIONS.SECURITY_CLEARANCE && (
                <div className="flex flex-col gap-10">
                  <header className="flex flex-col gap-1">
                    <h1 className="font-headline text-6xl text-primary uppercase">SECURITY CLEARANCE</h1>
                    <p className="font-mono text-xs text-primary/40 tracking-[0.4em] uppercase">FORMAL AUTHENTICATION PARAMETERS</p>
                  </header>
                  <section className="glass-panel rounded-[13px] p-12 border-2 border-primary/20 relative overflow-hidden">
                    {/* Watermark */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] scale-[4]">
                       <span className="material-symbols-outlined text-[100px] text-primary">verified_user</span>
                    </div>
                    <div className="relative z-10 space-y-8">
                      <div className="flex justify-between items-center border-b border-primary/20 pb-6">
                        <h2 className="font-interface font-bold text-2xl text-primary">LEVEL 4 - TOP SECRET</h2>
                        <span className="material-symbols-outlined text-primary text-4xl">verified</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-4">
                          <h3 className="font-interface font-bold text-xs text-primary/40 uppercase tracking-widest">GRANTED PERMISSIONS</h3>
                          <ul className="space-y-2 font-data text-xs text-primary/80">
                            <li className="flex items-center gap-2"><span className="text-primary">✓</span> FULL VAULT ACCESS</li>
                            <li className="flex items-center gap-2"><span className="text-primary">✓</span> GLOBAL NODE COMMAND</li>
                            <li className="flex items-center gap-2"><span className="text-primary">✓</span> KERNEL BYPASS OVERRIDE</li>
                            <li className="flex items-center gap-2"><span className="text-primary">✓</span> ENCRYPTION KEY SIGNING</li>
                          </ul>
                        </div>
                        <div className="bg-primary/5 p-6 rounded-lg border border-primary/10">
                          <p className="font-data text-[10px] text-primary/60 leading-relaxed">
                            THIS CLEARANCE IS ISSUED TO PERSONNEL WITH CLASS-1 SECURITY STANDING. UNAUTHORIZED DISSEMINATION OF ANY INTELLIGENCE ACCESSED THROUGH THIS TERMINAL IS PUNISHABLE UNDER DIRECTIVE 7.
                          </p>
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 215, 0, 0.05);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 215, 0, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 215, 0, 0.4);
        }
      `}</style>
    </div>
  );
}
