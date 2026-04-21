"use client";

import { useState, useRef, useEffect } from "react";
import NetworkBackground from "@/components/NetworkBackground";
import { motion, AnimatePresence } from "framer-motion";
import { fetchCyberNews, type CyberNewsItem } from "./actions/news";

/* ── CONSTANTS ── */
const TIPS: Record<number, string> = {
  0:  "Start typing to activate real-time security intelligence analysis.",
  1:  "Critical — cracked instantly. Use 12+ characters minimum.",
  2:  "Single words fall to dictionary attacks in milliseconds.",
  3:  "Add uppercase letters to expand the character pool significantly.",
  4:  "Numbers exponentially increase your entropy score.",
  5:  "Special characters multiply cracking time by thousands.",
  6:  "Avoid patterns like qwerty or 12345 — top of every wordlist.",
  7:  "Good length. Add symbols to push entropy above 60 bits.",
  8:  "Excellent entropy. Years to crack with modern hardware.",
  9:  "Near-perfect. Store this with a password manager.",
  10: "FORTRESS — exceeds military-grade security recommendations."
};

const BDEFS = [
  {i:"🔐", n:"First Check",  c:(b: number)=>b>=1},
  {i:"💪", n:"Strong",       c:(b: number)=>b>=50},
  {i:"🏰", n:"Fortress",     c:(b: number)=>b>=80},
  {i:"⚡", n:"Speed",        c:(b: number, l: number)=>l>=12},
  {i:"🎲", n:"Randomized",   c:(b: number, l: number, s: boolean)=>s},
  {i:"🔡", n:"Mixed Case",   c:(b: number, l: number, s: boolean, p: string)=>/[A-Z]/.test(p)&&/[a-z]/.test(p)},
  {i:"🔢", n:"Numbers",      c:(b: number, l: number, s: boolean, p: string)=>/\d/.test(p)},
  {i:"✨", n:"Symbols",      c:(b: number, l: number, s: boolean, p: string)=>/[^a-zA-Z0-9]/.test(p)}
];

const COLS = {
  crit:    "#f43f5e",
  weak:    "#f59e0b",
  fair:    "#f0c000",
  strong:  "#10b981",
  vstrong: "#dc2626",
  fort:    "#8b5cf6"
};

function calcE(pw: string) {
  let p = 0;
  if (/[a-z]/.test(pw)) p += 26;
  if (/[A-Z]/.test(pw)) p += 26;
  if (/\d/.test(pw))    p += 10;
  if (/[^a-zA-Z0-9]/.test(pw)) p += 32;
  
  if (!p) return 0;
  
  let entropy = Math.round(pw.length * Math.log2(p));
  
  // Dictionary / Complexity Penalty
  const hasNum = /\d/.test(pw);
  const hasSym = /[^a-zA-Z0-9]/.test(pw);
  
  if (!hasNum && !hasSym) {
    // If it's purely alphabetical, hard-cap the entropy so it can NEVER be Strong or Fortress.
    entropy = Math.min(Math.round(entropy * 0.4), 40); 
  }
  
  return entropy;
}

function crackT(b: number) {
  const s = Math.pow(2, b) / 1e10;
  if (s < 1)        return "<1 sec";
  if (s < 60)       return Math.round(s) + " sec";
  if (s < 3600)     return Math.round(s/60) + " min";
  if (s < 86400)    return Math.round(s/3600) + " hr";
  if (s < 31536e3)  return Math.round(s/86400) + " days";
  if (s < 31536e8)  return Math.round(s/31536e3) + " yrs";
  return Math.round(s/31536e8) + " centuries";
}

function sInfo(b: number) {
  if (!b)   return {lbl:"AWAITING INPUT", col:"#6b7280", segs:0};
  if (b<20) return {lbl:"CRITICAL",       col:COLS.crit,    segs:1};
  if (b<35) return {lbl:"WEAK",           col:COLS.weak,    segs:3};
  if (b<50) return {lbl:"FAIR",           col:COLS.fair,    segs:5};
  if (b<65) return {lbl:"STRONG",         col:COLS.strong,  segs:7};
  if (b<80) return {lbl:"VERY STRONG",    col:COLS.vstrong, segs:9};
  return          {lbl:"FORTRESS",        col:COLS.fort,    segs:10};
}

function tipIdx(b: number, pw: string) {
  if (!pw) return 0;
  if (b<10)  return pw.length < 4 ? 1 : 2;
  if (b<20)  return 3;
  if (b<30)  return 4;
  if (b<45)  return 5;
  if (b<55)  return pw.length < 14 ? 6 : 7;
  if (b<70)  return 8;
  if (b<85)  return 9;
  return 10;
}

export default function Home() {
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [scanTab, setScanTab] = useState('Pw');
  
  const [scanC, setScanC] = useState(0);
  const [strongC, setStrongC] = useState(0);
  const [weakC, setWeakC] = useState(0);

  const [goU, setGoU] = useState(true);
  const [goN, setGoN] = useState(true);
  const [goS, setGoS] = useState(true);
  const [goA, setGoA] = useState(true);
  
  const [genLen, setGenLen] = useState(20);
  const [genOut, setGenOut] = useState("Click generate for a secure password");

  const [news, setNews] = useState<CyberNewsItem[]>([]);
  const [activeCard, setActiveCard] = useState<string | null>(null);

  const [isScanning, setIsScanning] = useState(false);
  const [breachedDb, setBreachedDb] = useState<Record<string, number>>({});

  const b = calcE(password);
  const isCurrentlyBreached = password && breachedDb[password] !== undefined;
  const info = isCurrentlyBreached ? { lbl: `BREACHED (${breachedDb[password].toLocaleString()} leaks)`, col: COLS.crit, segs: 1 } : sInfo(b);
  const risk = isCurrentlyBreached ? 100 : password ? Math.max(0, Math.round(100 - b * 0.9)) : 0;
  const hasSym = /[^a-zA-Z0-9]/.test(password);

  useEffect(() => {
    fetchCyberNews().then(data => setNews(data));
  }, []);

  const doScan = async () => {
    if (!password || isScanning) return;
    setIsScanning(true);
    setScanC(c => c + 1);
    
    let isBreached = false;
    let breachCount = 0;
    
    try {
      // Real Dark Web HIBP SHA-1 Check
      const encoder = new TextEncoder();
      const data = encoder.encode(password);
      const hashBuffer = await crypto.subtle.digest('SHA-1', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
      
      const prefix = hashHex.slice(0, 5);
      const suffix = hashHex.slice(5);
      
      const res = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
      const text = await res.text();
      const lines = text.split('\n');
      
      for (const line of lines) {
         const [lineSuffix, count] = line.split(':');
         if (lineSuffix.trim() === suffix) {
           isBreached = true;
           breachCount = parseInt(count);
           setBreachedDb(prev => ({ ...prev, [password]: breachCount }));
           break;
         }
      }
    } catch(e) {
      console.warn("Failed to contact HIBP API.");
    }

    const cb = calcE(password);
    
    const resolvedInfo = isBreached ? { lbl: "BREACHED", col: COLS.crit, segs: 1 } : sInfo(cb);
    
    if (resolvedInfo.lbl !== "BREACHED" && cb >= 65) setStrongC(c => c + 1); 
    if (resolvedInfo.lbl === "BREACHED" || cb < 65) setWeakC(c => c + 1);
    
    setIsScanning(false);
  };

  function genPw() {
    let cStr = 'abcdefghijklmnopqrstuvwxyz';
    if (goU) cStr += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (goN) cStr += '0123456789';
    if (goS) cStr += '!@#$%^&*-_+=?';
    if (goA) cStr = cStr.replace(/[0O1lI]/g, '');
    let pwStr = '';
    for (let i = 0; i < genLen; i++) pwStr += cStr[Math.floor(Math.random() * cStr.length)];
    setGenOut(pwStr);
  }

  function cpyGen() {
    navigator.clipboard.writeText(genOut).catch(() => {});
  }

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const getPlaceholder = () => {
    if (scanTab === 'Pin') return "Enter PIN...";
    if (scanTab === 'Phr') return "Enter Passphrase directive...";
    return "Enter directive to analyse...";
  };

  const getInputType = () => {
    if (showPw) return "text";
    return "password";
  };

  const handleInputMode = () => {
    return scanTab === 'Pin' ? "numeric" : "text";
  };

  const expandHoverStyle = {
    scale: 1.02,
    boxShadow: "0 0 24px rgba(220,38,38,0.25)",
    transition: { type: "spring" as const, stiffness: 300 }
  };

  return (
    <div className="a1 relative">
      <NetworkBackground />
      
      {/* EXPANDED MODAL OVERLAYS */}
      <AnimatePresence>
        {activeCard && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ 
               position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
               zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', 
               padding: '24px', backgroundColor: 'rgba(0,0,0,0.85)' 
            }}
            onClick={() => setActiveCard(null)}
          >
            <motion.div 
              layoutId={activeCard}
              className="panel relative overflow-auto shadow-2xl"
              style={{ width: '100%', maxWidth: '900px', maxHeight: '90vh', cursor: 'auto' }}
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                style={{ position: 'absolute', top: '16px', right: '20px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink3)' }}
                onClick={() => setActiveCard(null)}
              >
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>

              {/* RENDER MODAL CONTENTS BASED ON ACTIVE CARD */}
              {activeCard === 'dark-web' && (
                <div>
                  <div className="ph" style={{ padding: '24px' }}>
                    <span className="ptitle" style={{ fontSize: '18px' }}><svg viewBox="0 0 24 24"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg> Expanded Dark Web Monitor</span>
                  </div>
                  <div className="dw-rows" style={{ padding: '24px' }}>
                    <p style={{ color: 'var(--ink3)', fontSize: '12px', margin: '0 0 24px 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Historical Breaches Correlated via Cross-Reference Data</p>
                    <div className="dwr"><div className="dwi r"></div><div className="dws" style={{ fontSize: '16px', color: 'var(--ink)' }}>RockYou2024 massive leak</div><div className="dwd" style={{ fontSize: '14px' }}>Jan 2024</div><div className="dwv dvb" style={{ background: '#4a1520', color: '#f87171' }}>Breached</div></div>
                    <div className="dwr"><div className="dwi r"></div><div className="dws" style={{ fontSize: '16px', color: 'var(--ink)' }}>Collection #1 (Multi-source)</div><div className="dwd" style={{ fontSize: '14px' }}>Feb 2019</div><div className="dwv dvb" style={{ background: '#4a1520', color: '#f87171' }}>Breached</div></div>
                    <div className="dwr"><div className="dwi g"></div><div className="dws" style={{ fontSize: '16px', color: 'var(--ink)' }}>LinkedIn 2012 Drop</div><div className="dwd" style={{ fontSize: '14px' }}>Jun 2012</div><div className="dwv dvc" style={{ background: '#064e3b', color: '#34d399' }}>Clean</div></div>
                    <div className="dwr"><div className="dwi a"></div><div className="dws" style={{ fontSize: '16px', color: 'var(--ink)' }}>Telegram combi list (Pending Verification)</div><div className="dwd" style={{ fontSize: '14px' }}>Mar 2025</div><div className="dwv dvm" style={{ background: '#451a03', color: '#fbbf24' }}>Watching</div></div>
                    <div className="dwr"><div className="dwi g"></div><div className="dws" style={{ fontSize: '16px', color: 'var(--ink)' }}>Adobe 2013 Base</div><div className="dwd" style={{ fontSize: '14px' }}>Oct 2013</div><div className="dwv dvc" style={{ background: '#064e3b', color: '#34d399' }}>Clean</div></div>
                    <div className="dwr"><div className="dwi a"></div><div className="dws" style={{ fontSize: '16px', color: 'var(--ink)' }}>Underground Forum Dump 89B</div><div className="dwd" style={{ fontSize: '14px' }}>Dec 2025</div><div className="dwv dvm" style={{ background: '#451a03', color: '#fbbf24' }}>Watching</div></div>
                  </div>
                </div>
              )}

              {activeCard === 'achievements' && (
                <div>
                   <div className="ph" style={{ padding: '24px' }}>
                    <span className="ptitle" style={{ fontSize: '18px' }}><svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg> Achievements Archive</span>
                  </div>
                  <div className="bdg-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', padding: '24px' }}>
                    {BDEFS.map((bd, i) => {
                      const on = bd.c(b, password.length, hasSym, password);
                      return (
                        <div key={i} className={`bdg ${on ? 'on' : ''}`} style={{ padding: '24px' }}>
                          <div className="bdg-i" style={{ fontSize: '36px' }}>{bd.i}</div>
                          <div className="bdg-n" style={{ fontSize: '12px', marginTop: '10px' }}>{bd.n}</div>
                          <p style={{ fontSize: '12px', color: 'var(--ink3)', marginTop: '8px' }}>{on ? 'Unlocked for current configuration!' : 'Requires a heavier security configuration to obtain.'}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {activeCard === 'news' && (
                <div>
                  <div className="ph" style={{ padding: '24px' }}>
                    <span className="ptitle" style={{ fontSize: '18px' }}><svg viewBox="0 0 24 24"><path d="M4 22h16a2 2 0 002-2V4a2 2 0 00-2-2H8l-4 4v14a2 2 0 002 2z"></path><path d="M14 2v4a2 2 0 002 2h4"></path></svg> Real-Time Cyber News Feed</span>
                  </div>
                  <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {news.map(story => (
                      <a key={story.id} href={story.url} target="_blank" rel="noreferrer" style={{ display: 'block', border: '1px solid var(--b)', padding: '20px', borderRadius: '8px', textDecoration: 'none' }}>
                         <h3 style={{ fontFamily: 'sans-serif', fontWeight: '600', color: 'white', fontSize: '18px', marginBottom: '8px' }}>{story.title}</h3>
                         <span style={{ color: 'var(--ink4)', fontSize: '12px', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{new Date(story.time * 1000).toLocaleString()} • Score: {story.score}</span>
                      </a>
                    ))}
                    {!news.length && <div style={{ color: 'var(--ink3)', fontSize: '14px' }}>Fetching credible news...</div>}
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>


      {/*  ── NAV ──  */}
      <nav className="nav">
        <div className="brand cursor-pointer" onClick={() => window.location.reload()}>
          <div className="hex">
            <svg viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
          </div>
          <div>
            <span className="bname">VERITAS</span>
            <span className="bsub" style={{ color: "var(--red)" }}>Strategic Intelligence</span>
          </div>
        </div>
        <div className="nlinks">
          <button className="nlink" onClick={() => scrollTo('dashboard')}>Dashboard</button>
          <button className="nlink" onClick={() => scrollTo('threat-intel')}>Threat Intel</button>
          <button className="nlink" onClick={() => scrollTo('analytics')}>Analytics</button>
          <button className="nlink" onClick={() => scrollTo('cyber-news')}>Cyber News</button>
        </div>
        <div className="nstatus" style={{ background: '#450a0a', borderColor: '#7f1d1d' }}>
          <div className="ndot" style={{ background: '#f87171' }}></div>
          <span className="nstxt" style={{ color: '#fca5a5' }}>Live Scan Ready</span>
        </div>
      </nav>

      <div id="dashboard">
        {/*  ── HERO ──  */}
        <div className="hero a2" style={{ background: 'transparent' }}>
          <div className="hero-grid" style={{ backgroundImage: 'linear-gradient(var(--b3) 1px,transparent 1px),linear-gradient(90deg,var(--b3) 1px,transparent 1px)', opacity: 0.05 }}></div>
          <div className="hero-scan" style={{ opacity: 0.2 }}></div>
          <div className="hero-inner">
            <div className="hero-left">
              <div className="hero-eyebrow">
                <div className="hero-edot"></div>
                <span className="hero-etxt">System Online &middot; v2.4.1</span>
              </div>
              <div className="hero-h" style={{ color: '#ffffff' }}>VERITAS<span style={{ color: 'var(--red)' }}>.</span></div>
              <div className="hero-tag">Advanced Password Intelligence Platform</div>
            </div>
            <div className="hero-stats">
              <div className="hstat danger">
                <div className="hstat-val">{scanC}</div>
                <div className="hstat-lbl">Analyzed</div>
              </div>
              <div className="hstat safe">
                <div className="hstat-val">{strongC}</div>
                <div className="hstat-lbl">Fortress</div>
              </div>
              <div className="hstat warn">
                <div className="hstat-val">{weakC}</div>
                <div className="hstat-lbl">Weak</div>
              </div>
              <div className="hstat info">
                <div className="hstat-val" style={{ fontSize: password ? '28px' : '18px', color: risk > 70 ? COLS.crit : risk > 40 ? COLS.weak : password ? COLS.strong : 'inherit' }}>
                  {password ? `${risk}%` : '—'}
                </div>
                <div className="hstat-lbl">Risk Score</div>
              </div>
            </div>
          </div>
        </div>

        {/*  ── TAB BAR ──  */}
        <div className="tbar a3" style={{ background: 'transparent' }}>
          <button className="tbtn" onClick={() => scrollTo('dashboard')}>
            <svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
            Dashboard
          </button>
          <button className="tbtn" onClick={() => scrollTo('threat-intel')}>
            <svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            Threat Intel
          </button>
          <button className="tbtn" onClick={() => scrollTo('analytics')}>
            <svg viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
            Analytics
          </button>
          <button className="tbtn" onClick={() => scrollTo('cyber-news')}>
             <svg viewBox="0 0 24 24"><path d="M4 22h16a2 2 0 002-2V4a2 2 0 00-2-2H8l-4 4v14a2 2 0 002 2z"></path></svg>
             Cyber News
          </button>
        </div>
      </div>

      {/*  ── MAIN ──  */}
      <div className="main" id="threat-intel">

        {/*  LEFT COLUMN  */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          <div className="panel a3">
            <div className="ph">
              <span className="ptitle">
                <svg viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                Password Analyser
              </span>
              <span className="pbadge pb-blue" style={{ background: '#4a232b', color: '#f87171', borderColor: '#6e3441' }}>Real-time Intel</span>
            </div>

            <div className="isec">
              {/*  Scan type tabs  */}
              <div className="stabs">
                <button className={`stab ${scanTab === 'Pw' ? 'on' : ''}`} onClick={() => setScanTab('Pw')}>
                  <svg viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                  Password
                </button>
                <button className={`stab ${scanTab === 'Pin' ? 'on' : ''}`} onClick={() => setScanTab('Pin')}>
                  <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="9"/></svg>
                  PIN
                </button>
                <button className={`stab ${scanTab === 'Phr' ? 'on' : ''}`} onClick={() => setScanTab('Phr')}>
                  <svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
                  Passphrase
                </button>
              </div>

              {/*  ANALYSER UNIT  */}
              <div className="analyser shadow-2xl">
                <div className="analyser-input-row">
                  <div className="analyser-prefix">
                    <svg viewBox="0 0 24 24" style={{ width: '17px', height: '17px', fill: 'none', stroke: 'var(--blue)', strokeWidth: '2.2', strokeLinecap: 'round', strokeLinejoin: 'round' }}>
                      <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
                    </svg>
                  </div>
                  <input
                    className="analyser-input"
                    type={getInputType()}
                    inputMode={handleInputMode() as "text" | "numeric"}
                    placeholder={getPlaceholder()}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="off"
                  />
                  <button className="analyser-eye" onClick={() => setShowPw(!showPw)}>
                    <svg viewBox="0 0 24 24">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                    </svg>
                  </button>
                </div>

                {/*  SEGMENTED STRENGTH BAR  */}
                <div className="seg-wrap">
                  <div className="seg-label-row">
                    <span className="seg-strength" style={{ color: info.col }}>{info.lbl}</span>
                    <span className="seg-bits">{password ? b : '—'} BITS</span>
                  </div>
                  <div className="seg-bars">
                    {[...Array(10)].map((_, i) => (
                      <div key={i} className={`seg-bar ${i < info.segs ? 'lit' : ''}`} style={{ background: i < info.segs ? info.col : 'var(--b)' }}></div>
                    ))}
                  </div>
                  <div className="seg-detail">
                    <div className="seg-d">
                      <div className="seg-d-val">{password ? b : '—'}</div>
                      <div className="seg-d-lbl">Entropy</div>
                      <div className="seg-d-bar" style={{ width: `${info.segs * 10}%`, background: info.col }}></div>
                    </div>
                    <div className="seg-d" id="analytics">
                      <div className="seg-d-val" style={{ fontSize: '12px', lineHeight: '1.35', color: password ? (b < 35 ? COLS.crit : b < 60 ? COLS.weak : COLS.strong) : 'inherit' }}>
                        {password ? crackT(b) : '—'}
                      </div>
                      <div className="seg-d-lbl">Crack Time</div>
                      <div className="seg-d-bar" style={{ width: password ? `${100 - risk}%` : '0%', background: b < 35 ? COLS.crit : b < 60 ? COLS.weak : COLS.strong }}></div>
                    </div>
                    <div className="seg-d">
                      <div className="seg-d-val" style={{ color: password ? (risk > 70 ? COLS.crit : risk > 40 ? COLS.weak : COLS.strong) : 'inherit' }}>
                        {password ? risk : '—'}
                      </div>
                      <div className="seg-d-lbl">Risk /100</div>
                      <div className="seg-d-bar" style={{ width: password ? `${risk}%` : '0%', background: risk > 70 ? COLS.crit : risk > 40 ? COLS.weak : COLS.strong }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/*  TIP  */}
              <div className="tip-box" style={{ background: '#2e1015', borderColor: '#4a1520', borderLeftColor: '#f43f5e' }}>
                <div className="tip-ico" style={{ background: '#f43f5e' }}>
                  <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                </div>
                <div>
                  <div className="tip-lbl" style={{ color: '#fb7185' }}>Intel Advisory</div>
                  <div className="tip-txt" style={{ color: '#d1d5db' }}>{TIPS[tipIdx(b, password)]}</div>
                </div>
              </div>

              {/*  SCAN BUTTON  */}
              <button className="scan-btn" onClick={doScan} disabled={isScanning}>
                <svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 1 0 0-20zM2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                {isScanning ? "Contacting Dark Web Data..." : "Run Dark Web Breach Check"}
              </button>
            </div>

            {/*  GENERATOR  */}
            <div className="gen-sec">
              <div className="gen-ph">
                <span className="gen-title">
                  <svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                  Password Generator
                </span>
                <span className="pbadge pb-blue" style={{ background: '#450a0a', color: '#f87171', borderColor: '#7f1d1d' }}>AI-Assisted</span>
              </div>
              <div className="gen-out">
                <span className="gen-pw">{genOut}</span>
                <button className="cpybtn" onClick={cpyGen} title="Copy">
                  <svg viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
                </button>
              </div>
              <div className="gopts">
                <div className={`gopt ${goU ? 'on' : ''}`} onClick={() => setGoU(!goU)}>A&ndash;Z Upper</div>
                <div className={`gopt ${goN ? 'on' : ''}`} onClick={() => setGoN(!goN)}>0&ndash;9 Nums</div>
                <div className={`gopt ${goS ? 'on' : ''}`} onClick={() => setGoS(!goS)}>!@# Symbols</div>
                <div className={`gopt ${goA ? 'on' : ''}`} onClick={() => setGoA(!goA)}>No Ambiguous</div>
              </div>
              <div className="lenrow">
                <span className="lenlbl">Length</span>
                <input type="range" className="lenr" min="8" max="32" value={genLen} step="1" onChange={(e) => setGenLen(parseInt(e.target.value))} />
                <span className="lennum">{genLen}</span>
              </div>
              <button className="genbtn" style={{ background: 'var(--red)', color: 'white' }} onClick={genPw}>Generate Secure Password</button>
            </div>
          </div>

        </div>

        {/*  RIGHT COLUMN  */}
        <div className="rcol">

          {/*  DARK WEB MONITOR  */}
          <motion.div layoutId="dark-web" className="panel a4 cursor-pointer" onClick={() => setActiveCard('dark-web')} whileHover={expandHoverStyle}>
            <div className="ph">
              <span className="ptitle">
                <svg viewBox="0 0 24 24"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>
                Dark Web Monitor
              </span>
              <span className="pbadge pb-amber" style={{ color: '#f59e0b', borderColor: '#f59e0b', background: 'transparent' }}>3 Flagged</span>
            </div>
            <div className="dw-rows">
              <div className="dwr"><div className="dwi r"></div><div className="dws" style={{ color: 'var(--ink)' }}>RockYou2024 leak</div><div className="dwd" style={{ color: 'var(--ink3)' }}>Jan 2024</div><div className="dwv dvb" style={{ background: '#4a1520', color: '#f87171' }}>Breached</div></div>
              <div className="dwr"><div className="dwi g"></div><div className="dws" style={{ color: 'var(--ink)' }}>LinkedIn 2012</div><div className="dwd" style={{ color: 'var(--ink3)' }}>Jun 2012</div><div className="dwv dvc" style={{ background: '#064e3b', color: '#34d399' }}>Clean</div></div>
              <div className="dwr"><div className="dwi a"></div><div className="dws" style={{ color: 'var(--ink)' }}>Telegram combo list</div><div className="dwd" style={{ color: 'var(--ink3)' }}>Mar 2025</div><div className="dwv dvm" style={{ background: '#451a03', color: '#fbbf24' }}>Watching</div></div>
              <div className="dwr"><div className="dwi g"></div><div className="dws" style={{ color: 'var(--ink)' }}>Adobe 2013 breach</div><div className="dwd" style={{ color: 'var(--ink3)' }}>Oct 2013</div><div className="dwv dvc" style={{ background: '#064e3b', color: '#34d399' }}>Clean</div></div>
            </div>
          </motion.div>

          {/*  ACHIEVEMENTS  */}
          <motion.div layoutId="achievements" className="panel a4 cursor-pointer" onClick={() => setActiveCard('achievements')} whileHover={expandHoverStyle}>
            <div className="ph">
              <span className="ptitle">
                <svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>
                Achievements
              </span>
              <span className="pbadge pb-blue" style={{ background: 'transparent', color: '#f87171', borderColor: '#dc2626' }}>{BDEFS.filter(bd => bd.c(b, password.length, hasSym, password)).length} / 8</span>
            </div>
            <div className="bdg-grid">
              {BDEFS.map((bd, i) => {
                const on = bd.c(b, password.length, hasSym, password);
                return (
                  <div key={i} className={`bdg ${on ? 'on' : ''}`}>
                    <div className="bdg-i">{bd.i}</div>
                    <div className="bdg-n">{bd.n}</div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/*  CYBER NEWS  */}
          <motion.div layoutId="news" id="cyber-news" className="panel a5 cursor-pointer" onClick={() => setActiveCard('news')} whileHover={expandHoverStyle}>
            <div className="ph">
              <span className="ptitle">
                <svg viewBox="0 0 24 24"><path d="M4 22h16a2 2 0 002-2V4a2 2 0 00-2-2H8l-4 4v14a2 2 0 002 2z"></path><path d="M14 2v4a2 2 0 002 2h4"></path></svg>
                Cyber News
              </span>
              <span className="pbadge" style={{ background: 'transparent', color: '#f87171', borderColor: '#dc2626' }}>Top 5 Live</span>
            </div>
            <div style={{ padding: '12px' }}>
               {news.slice(0,3).map(story => (
                 <div key={story.id} style={{ fontSize: '14px', marginBottom: '10px', borderBottom: '1.5px solid var(--b)', paddingBottom: '10px' }}>
                   <div style={{ color: 'var(--ink)', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: '4px' }}>{story.title}</div>
                   <div style={{ fontSize: '10px', color: 'var(--ink3)', fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{new Date(story.time * 1000).toLocaleDateString()}</div>
                 </div>
               ))}
               {!news.length && <div style={{ fontSize: '13px', color: 'var(--ink3)' }}>Fetching credible news...</div>}
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
