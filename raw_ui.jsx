<div className="a1">
{/*  ── NAV ──  */}
<nav className="nav">
  <div className="brand">
    <div className="hex">
      <svg viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
    </div>
    <div>
      <span className="bname">VERITAS</span>
      <span className="bsub">Strategic Intelligence</span>
    </div>
  </div>
  <div className="nlinks">
    <button className="nlink on">Dashboard</button>
    <button className="nlink">Threat Intel</button>
    <button className="nlink">Global Analytics</button>
    <button className="nlink">Cyber News</button>
  </div>
  <div className="nstatus">
    <div className="ndot"></div>
    <span className="nstxt">Live Scan Ready</span>
  </div>
</nav>

{/*  ── HERO ──  */}
<div className="hero a2">
  <div className="hero-grid"></div>
  <div className="hero-scan"></div>
  <div className="hero-inner">
    <div className="hero-left">
      <div className="hero-eyebrow">
        <div className="hero-edot"></div>
        <span className="hero-etxt">System Online &middot; v2.4.1</span>
      </div>
      <div className="hero-h">VERITAS<span>.</span></div>
      <div className="hero-tag">Advanced Password Intelligence Platform</div>
    </div>
    <div className="hero-stats">
      <div className="hstat danger">
        <div className="hstat-val" id="hTotal">0</div>
        <div className="hstat-lbl">Analyzed</div>
      </div>
      <div className="hstat safe">
        <div className="hstat-val" id="hSafe">0</div>
        <div className="hstat-lbl">Fortress</div>
      </div>
      <div className="hstat warn">
        <div className="hstat-val" id="hWeak">0</div>
        <div className="hstat-lbl">Weak</div>
      </div>
      <div className="hstat info">
        <div className="hstat-val" id="hRisk" style={{"fontSize":"18px"}}>—</div>
        <div className="hstat-lbl">Risk Score</div>
      </div>
    </div>
  </div>
</div>

{/*  ── TAB BAR ──  */}
<div className="tbar a3">
  <button className="tbtn on">
    <svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
    Dashboard
  </button>
  <button className="tbtn">
    <svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
    Threat Intel
  </button>
  <button className="tbtn">
    <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20"/></svg>
    Global Map
  </button>
  <button className="tbtn">
    <svg viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
    Analytics
  </button>
</div>

{/*  ── MAIN ──  */}
<div className="main">

  {/*  LEFT COLUMN  */}
  <div style={{"display":"flex","flexDirection":"column","gap":"16px"}}>

    <div className="panel a3">
      <div className="ph">
        <span className="ptitle">
          <svg viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
          Password Analyser
        </span>
        <span className="pbadge pb-blue">Real-time Intel</span>
      </div>

      <div className="isec">
        {/*  Scan type tabs  */}
        <div className="stabs">
          <button className="stab on" id="stPw" onClick="setScanTab('Pw')">
            <svg viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
            Password
          </button>
          <button className="stab" id="stPin" onClick="setScanTab('Pin')">
            <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="9"/></svg>
            PIN Code
          </button>
          <button className="stab" id="stPhr" onClick="setScanTab('Phr')">
            <svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
            Passphrase
          </button>
        </div>

        {/*  ANALYSER UNIT  */}
        <div className="analyser">
          <div className="analyser-input-row">
            <div className="analyser-prefix">
              <svg viewBox="0 0 24 24" style={{"width":"17px","height":"17px","fill":"none","stroke":"var(--blue)","strokeWidth":"2.2","strokeLinecap":"round","strokeLinejoin":"round"}}>
                <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
              </svg>
            </div>
            <input
              className="analyser-input"
              id="pwField"
              type="password"
              placeholder="Enter directive to analyse..."
              onChange="analyse(this.value)"
              autocomplete="off"
             />
            <button className="analyser-eye" onClick="toggleVis()">
              <svg id="eyeIco" viewBox="0 0 24 24">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
              </svg>
            </button>
          </div>

          {/*  SEGMENTED STRENGTH BAR  */}
          <div className="seg-wrap">
            <div className="seg-label-row">
              <span className="seg-strength" id="segStr">AWAITING INPUT</span>
              <span className="seg-bits" id="segBits">— BITS</span>
            </div>
            <div className="seg-bars" id="segBars">
              <div className="seg-bar"></div>
              <div className="seg-bar"></div>
              <div className="seg-bar"></div>
              <div className="seg-bar"></div>
              <div className="seg-bar"></div>
              <div className="seg-bar"></div>
              <div className="seg-bar"></div>
              <div className="seg-bar"></div>
              <div className="seg-bar"></div>
              <div className="seg-bar"></div>
            </div>
            <div className="seg-detail">
              <div className="seg-d">
                <div className="seg-d-val" id="sdEnt">—</div>
                <div className="seg-d-lbl">Entropy</div>
                <div className="seg-d-bar" id="sdEntB" style={{"width":"0%"}}></div>
              </div>
              <div className="seg-d">
                <div className="seg-d-val" id="sdCrk" style={{"fontSize":"12px","lineHeight":"1.35"}}>—</div>
                <div className="seg-d-lbl">Crack Time</div>
                <div className="seg-d-bar" id="sdCrkB" style={{"width":"0%"}}></div>
              </div>
              <div className="seg-d">
                <div className="seg-d-val" id="sdRsk">—</div>
                <div className="seg-d-lbl">Risk /100</div>
                <div className="seg-d-bar" id="sdRskB" style={{"width":"0%"}}></div>
              </div>
            </div>
          </div>
        </div>

        {/*  TIP  */}
        <div className="tip-box">
          <div className="tip-ico">
            <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          </div>
          <div>
            <div className="tip-lbl">Intel Advisory</div>
            <div className="tip-txt" id="tipTxt">Start typing to activate real-time security intelligence analysis.</div>
          </div>
        </div>

        {/*  SCAN BUTTON  */}
        <button className="scan-btn" onClick="doScan()">
          <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          Initiate Full Scan
        </button>
      </div>

      {/*  GENERATOR  */}
      <div className="gen-sec">
        <div className="gen-ph">
          <span className="gen-title">
            <svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
            Password Generator
          </span>
          <span className="pbadge pb-blue">AI-Assisted</span>
        </div>
        <div className="gen-out">
          <span className="gen-pw" id="genOut">Click generate for a secure password</span>
          <button className="cpybtn" onClick="cpyGen()" title="Copy">
            <svg viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
          </button>
        </div>
        <div className="gopts">
          <div className="gopt on" id="gU" onClick="tog('gU','U')">A&ndash;Z Upper</div>
          <div className="gopt on" id="gN" onClick="tog('gN','N')">0&ndash;9 Nums</div>
          <div className="gopt on" id="gS" onClick="tog('gS','S')">!@# Symbols</div>
          <div className="gopt on" id="gA" onClick="tog('gA','A')">No Ambiguous</div>
        </div>
        <div className="lenrow">
          <span className="lenlbl">Length</span>
          <input type="range" className="lenr" min="8" max="32" value="20" step="1" id="lenR"
            onChange="document.getElementById('lenN').textContent=this.value" />
          <span className="lennum" id="lenN">20</span>
        </div>
        <button className="genbtn" onClick="genPw()">Generate Secure Password</button>
      </div>
    </div>

  </div>

  {/*  RIGHT COLUMN  */}
  <div className="rcol">

    {/*  THREAT MAP  */}
    <div className="panel a3">
      <div className="ph">
        <span className="ptitle">
          <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20"/></svg>
          Threat Origin Map
        </span>
        <span className="pbadge pb-red" id="thrBadge">14 Active</span>
      </div>
      <div className="map-body">
        <canvas id="tmap"></canvas>
        <div className="map-bl">Live telemetry</div>
        <div className="map-tr" id="mapTr">
          <div className="mapdot" id="mapDot" style={{"background":"var(--red)"}}></div>
          <span id="mapTxt">14 threats</span>
        </div>
      </div>
    </div>

    {/*  DARK WEB MONITOR  */}
    <div className="panel a4">
      <div className="ph">
        <span className="ptitle">
          <svg viewBox="0 0 24 24"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>
          Dark Web Monitor
        </span>
        <span className="pbadge pb-amber">3 Flagged</span>
      </div>
      <div className="dw-rows">
        <div className="dwr"><div className="dwi r"></div><div className="dws">RockYou2024 leak</div><div className="dwd">Jan 2024</div><div className="dwv dvb">Breached</div></div>
        <div className="dwr"><div className="dwi g"></div><div className="dws">LinkedIn 2012</div><div className="dwd">Jun 2012</div><div className="dwv dvc">Clean</div></div>
        <div className="dwr"><div className="dwi a"></div><div className="dws">Telegram combo list</div><div className="dwd">Mar 2025</div><div className="dwv dvm">Watching</div></div>
        <div className="dwr"><div className="dwi g"></div><div className="dws">Adobe 2013 breach</div><div className="dwd">Oct 2013</div><div className="dwv dvc">Clean</div></div>
      </div>
    </div>

    {/*  ACHIEVEMENTS  */}
    <div className="panel a4">
      <div className="ph">
        <span className="ptitle">
          <svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>
          Achievements
        </span>
        <span className="pbadge pb-blue" id="earnTxt">0 / 8</span>
      </div>
      <div className="bdg-grid" id="bdgGrid"></div>
    </div>

    {/*  SCAN HISTORY  */}
    <div className="panel a5">
      <div className="ph">
        <span className="ptitle">
          <svg viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
          Scan History
        </span>
        <span className="pbadge pb-green">Live</span>
      </div>
      <table className="htable">
        <thead>
          <tr>
            <th>Target</th>
            <th>Type</th>
            <th>Time</th>
            <th>Verdict</th>
          </tr>
        </thead>
        <tbody id="histBody"></tbody>
      </table>
    </div>

  </div>
</div>
</div>
