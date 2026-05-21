const { useState, useEffect, useRef, useMemo } = React;
const { Placeholder, isPlaceholder, RenderText, SectionLabel, useTheme, Nav } = window;

// ============================================================
//  TWEAK DEFAULTS
// ============================================================
const TWEAK_DEFAULTS = {
  "fontSet": "Editorial",
  "accent": "#3B82F6",
  "categoryColors": {
    "Work":         "#3B82F6",
    "Internship":   "#3B82F6",
    "Project":      "#FACC15",
    "Case study":   "#FB923C",
    "Volunteering": "#F87171",
    "Club":         "#F87171"
  }
};

// ============================================================
//  CATEGORIES — add a new key here to register a new category.
//
//  Each category:
//    color    — default bar + legend color
//    swatches — palette shown in the Tweaks color picker
//    linkable — true = entries can link to a Projects card via `projectId`
// ============================================================
const CATEGORIES = {
  "Work":         { color: "#3B82F6", swatches: ["#3B82F6","#60A5FA","#2563EB","#0EA5E9"], linkable: false },
  "Internship":   { color: "#3B82F6", swatches: ["#3B82F6","#60A5FA","#2563EB","#0EA5E9"], linkable: false },
  "Project":      { color: "#FACC15", swatches: ["#FACC15","#EAB308","#FDE047","#84CC16"], linkable: true  },
  "Case study":   { color: "#FB923C", swatches: ["#FB923C","#F97316","#FDBA74","#EA580C"], linkable: true  },
  "Volunteering": { color: "#F87171", swatches: ["#F87171","#EF4444","#FCA5A5","#DC2626"], linkable: false },
  "Club":         { color: "#F87171", swatches: ["#F87171","#EF4444","#FCA5A5","#DC2626"], linkable: false },
  // To add a new category, drop a new line here, e.g.:
  // "Research": { color: "#22D3EE", swatches: ["#22D3EE","#0EA5E9","#06B6D4","#67E8F9"], linkable: true },
};

const FONT_SETS = {
  Editorial:     { serif: '"Instrument Serif", serif',             sans: '"Geist", "Helvetica Neue", sans-serif',      mono: '"JetBrains Mono", monospace',  note: "Elegant serif display · clean sans body" },
  Grotesque:     { serif: '"Space Grotesk", sans-serif',           sans: '"Space Grotesk", sans-serif',                mono: '"IBM Plex Mono", monospace',   note: "Geometric grotesque · technical mono" },
  "Modern Serif":{ serif: '"Newsreader", serif',                   sans: '"DM Sans", sans-serif',                      mono: '"DM Mono", monospace',         note: "Editorial serif · neutral sans" },
  Bricolage:     { serif: '"Bricolage Grotesque", sans-serif',     sans: '"Bricolage Grotesque", sans-serif',          mono: '"JetBrains Mono", monospace',  note: "Variable display · expressive" },
  "Mono Brutal": { serif: '"JetBrains Mono", monospace',          sans: '"Geist", sans-serif',                        mono: '"JetBrains Mono", monospace',  note: "Monospace headers · raw + technical" },
};
const ACCENT_OPTIONS = ["#3B82F6", "#F59E0B", "#A855F7", "#22D3EE", "#10B981"];

// ============================================================
//  TIMELINE DATA — one flat array. Add a line, it just works.
//
//  Required: { type, title, start, end }
//  Optional: { desc, projectId }   ← projectId links to a card in Projects.html
//
//  Dates: "YYYY-MM" or "YYYY-MM-DD". Use "present" for ongoing items.
//  type must match a key in CATEGORIES above.
// ============================================================
const TIMELINE = [
  {
    type: "Project",
    title: "[ Capstone or thesis project ]",
    start: "2026-01", end: "2026-05",
    projectId: "proj-01",
    desc: "[ The signature project for 2026. Question, method, key tools, and outcome. ]"
  },
  {
    type: "Work",
    title: "[ Help desk role ]",
    start: "2024-09", end: "2026-06",
    desc: "[ Long-running multi-year role. What you owned, how the work evolved, one or two highlights. ]"
  },
  {
    type: "Internship",
    title: "[ Summer internship ]",
    start: "2025-06", end: "2025-08",
    desc: "[ Where you interned, what you owned, scope of the work, and what you shipped. ]"
  },
  {
    type: "Case study",
    title: "[ Datathon entry ]",
    start: "2025-03-14", end: "2025-03-16",
    projectId: "proj-02",
    desc: "[ A weekend datathon. Note placement, team size, and your contribution. ]"
  },
  {
    type: "Volunteering",
    title: "[ Volunteering — e.g. tutoring ]",
    start: "2024-02", end: "2025-12",
    desc: "[ Volunteer work. Who you served, the cadence, and what you contributed. ]"
  },
  {
    type: "Club",
    title: "[ Club / society leadership ]",
    start: "2023-09", end: "2025-06",
    desc: "[ Multi-year club. Role, members impacted, events run. ]"
  },
  {
    type: "Internship",
    title: "[ First industry role ]",
    start: "2024-06", end: "2024-09"
  },
  {
    type: "Project",
    title: "[ Side project or research ]",
    start: "2024-02", end: "2024-12",
    projectId: "proj-03",
    desc: "[ Self-directed project. Question, approach, what you learned. ]"
  },
  {
    type: "Case study",
    title: "[ Weekend hackathon ]",
    start: "2024-10-19", end: "2024-10-20",
    desc: "[ A 36-hour hackathon. Theme, your contribution, what you built. ]"
  },
  {
    type: "Project",
    title: "[ Early personal project ]",
    start: "2023-03", end: "2023-08"
  },
];

// IDs that exist on the Projects page — used to validate deep links.
const PROJECT_IDS = new Set(["proj-01", "proj-02", "proj-03"]);

// ============================================================
//  TIME HELPERS (day-level precision)
// ============================================================
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const ONE_DAY = 86400000;

const parseDateStr = (s, isEnd) => {
  if (s === "present") return new Date();
  const parts = s.split("-").map(Number);
  const y = parts[0], m = parts[1], d = parts[2];
  if (d !== undefined) return new Date(y, m - 1, d);
  if (isEnd) return new Date(y, m, 0);
  return new Date(y, m - 1, 1);
};

const dayIdx = (date) => Math.floor(date.getTime() / ONE_DAY);

const fmtDateStr = (s) => {
  if (s === "present") return "Present";
  const parts = s.split("-").map(Number);
  const y = parts[0], m = parts[1], d = parts[2];
  if (d !== undefined) return `${MONTHS[m-1]} ${d}, ${y}`;
  return `${MONTHS[m-1]} ${y}`;
};

const fmtRange = (s, e) => {
  if (s === e) return fmtDateStr(s);
  return `${fmtDateStr(s)} — ${fmtDateStr(e)}`;
};

function processTimeline(entries) {
  const enriched = entries.map((e, idx) => {
    const startD = parseDateStr(e.start, false);
    const endD   = parseDateStr(e.end, true);
    const startDay = dayIdx(startD);
    const endDay   = Math.max(startDay, dayIdx(endD));
    return { ...e, id: idx, startDay, endDay, days: endDay - startDay + 1, isOngoing: e.end === "present" };
  });
  if (enriched.length === 0) return { entries: [], axisStart: 0, axisEnd: 1, axisSpan: 1, years: [] };

  const minDay = Math.min(...enriched.map(e => e.startDay));
  const maxDay = Math.max(...enriched.map(e => e.endDay));
  const FLOOR_YEAR = 2022;
  const dataStartYear = new Date(minDay * ONE_DAY).getFullYear();
  const dataEndYear   = new Date(maxDay * ONE_DAY).getFullYear();
  const todayYear     = new Date().getFullYear();
  const startYear = Math.min(FLOOR_YEAR, dataStartYear);
  const endYear   = Math.max(todayYear, dataEndYear);
  const axisStart = dayIdx(new Date(startYear, 0, 1));
  const axisEnd   = dayIdx(new Date(endYear + 1, 0, 1));
  return {
    entries: enriched,
    axisStart, axisEnd, axisSpan: axisEnd - axisStart,
    years: Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i),
  };
}

function laneAssign(entries, padDays = 21) {
  const ordered = [...entries].sort((a, b) => a.startDay - b.startDay || a.endDay - b.endDay);
  const laneEnds = [];
  const map = new Map();
  ordered.forEach(e => {
    let lane = laneEnds.findIndex(end => end + padDays <= e.startDay);
    if (lane === -1) { lane = laneEnds.length; laneEnds.push(e.endDay); }
    else { laneEnds[lane] = e.endDay; }
    map.set(e.id, lane);
  });
  return { count: laneEnds.length, get: (id) => map.get(id) };
}

// ============================================================
//  HORIZONTAL TIMELINE
// ============================================================
function HorizontalTimeline({ categoryMap, onOpenProject, isLinkable }) {
  const [active, setActive] = useState(null);
  const proc  = useMemo(() => processTimeline(TIMELINE), []);
  const lanes = useMemo(() => laneAssign(proc.entries, 21), [proc.entries]);

  const LANE_H = 26, LANE_GAP = 6;
  const pctLeft  = (day) => ((day - proc.axisStart) / proc.axisSpan) * 100;
  const pctWidth = (e)   => (e.days / proc.axisSpan) * 100;
  const yearPct  = (y)   => pctLeft(dayIdx(new Date(y, 0, 1)));
  const chartH   = lanes.count * (LANE_H + LANE_GAP) + 12;

  const activeEntry  = active !== null ? proc.entries.find(e => e.id === active) : null;
  const presentTypes = useMemo(() => {
    const seen = new Set();
    proc.entries.forEach(e => seen.add(e.type));
    return Array.from(seen);
  }, [proc.entries]);

  const todayDay     = dayIdx(new Date());
  const todayInRange = todayDay >= proc.axisStart && todayDay <= proc.axisEnd;

  const catColor = (type) => categoryMap[type] || "#A1A1AA";

  return (
    <div className="htl">
      {/* Legend */}
      <div className="htl__legend">
        {presentTypes.map(type => (
          <span key={type} className="htl__legend-item" style={{ "--cat": catColor(type) }}>
            <span className="htl__legend-dot" />
            <span>{type}</span>
          </span>
        ))}
      </div>

      {/* Chart */}
      <div className="htl__chart">
        <div className="htl__axis">
          {proc.years.map(y => {
            const nextDay = dayIdx(new Date(y + 1, 0, 1));
            const w = ((nextDay - dayIdx(new Date(y, 0, 1))) / proc.axisSpan) * 100;
            return (
              <span key={y} className="htl__year-label" style={{ left: `${yearPct(y)}%`, width: `${w}%` }}>
                <span>{y}</span>
              </span>
            );
          })}
        </div>
        <div className="htl__grid">
          {proc.years.map(y => (
            <span key={y} className="htl__grid-line" style={{ left: `${yearPct(y)}%` }} />
          ))}
          <span className="htl__grid-line htl__grid-line--end" style={{ left: "100%" }} />
          {todayInRange && (
            <span className="htl__today" style={{ left: `${pctLeft(todayDay)}%` }}>
              <span className="htl__today-label">today</span>
            </span>
          )}
        </div>
        <div className="htl__lanes" style={{ height: chartH }}>
          {proc.entries.map(e => {
            const lane     = lanes.get(e.id);
            const cc       = catColor(e.type);
            const hasLink  = !!e.projectId && isLinkable(e.type);
            return (
              <button
                key={e.id}
                type="button"
                className={`htl-bar ${active === e.id ? "is-active" : ""} ${e.isOngoing ? "is-ongoing" : ""} ${hasLink ? "has-link" : ""}`}
                style={{
                  left: `${pctLeft(e.startDay)}%`,
                  width: `${pctWidth(e)}%`,
                  top: `${lane * (LANE_H + LANE_GAP)}px`,
                  height: `${LANE_H}px`,
                  "--cat": cc,
                }}
                onClick={() => setActive(active === e.id ? null : e.id)}
                title={`${e.type} · ${fmtRange(e.start, e.end)}`}
              >
                <span className="htl-bar__type">{e.type}</span>
                <span className="htl-bar__title"><RenderText>{e.title}</RenderText></span>
                {hasLink && <span className="htl-bar__link" aria-hidden="true">↘</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Detail panel */}
      <div
        className={`htl__detail ${activeEntry ? "is-open" : ""}`}
        style={activeEntry ? { "--cat": catColor(activeEntry.type) } : undefined}
      >
        {activeEntry ? (
          <>
            <div className="htl__detail-h">
              <span className="htl__detail-type">{activeEntry.type}</span>
              <span className="htl__detail-range">{fmtRange(activeEntry.start, activeEntry.end)}</span>
              <button className="htl__close" onClick={() => setActive(null)} aria-label="Close">×</button>
            </div>
            <div className="htl__detail-t"><RenderText>{activeEntry.title}</RenderText></div>
            <p className="htl__detail-d">
              {activeEntry.desc
                ? <RenderText block>{activeEntry.desc}</RenderText>
                : <Placeholder block>[ No description yet — add one in the TIMELINE array ]</Placeholder>}
            </p>
            {activeEntry.projectId && isLinkable(activeEntry.type) && (
              <button className="htl__detail-link" onClick={() => onOpenProject(activeEntry.projectId)}>
                <span>View full project</span>
                <span className="htl__detail-link-arrow">↘</span>
              </button>
            )}
          </>
        ) : (
          <div className="htl__detail-empty">
            <Placeholder>[ Click any bar to open its details ]</Placeholder>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
//  TIMELINE SECTION
// ============================================================
function TimelineSection({ categoryMap, onOpenProject, isLinkable }) {
  return (
    <section className="section" id="timeline">
      <SectionLabel>Timeline</SectionLabel>
      <HorizontalTimeline categoryMap={categoryMap} onOpenProject={onOpenProject} isLinkable={isLinkable} />
    </section>
  );
}

// ============================================================
//  WORK
// ============================================================
function Work() {
  return (
    <section className="section section--first" id="work">
      <div className="intro">
        <h1 className="intro__name"><Placeholder italic={false}>[ Your Name ]</Placeholder></h1>
        <div className="intro__role">Data Science student <span className="amp">&amp;</span> Estimator</div>
      </div>
      <SectionLabel>Work</SectionLabel>
      <div className="work">
        <div className="work__current">
          <div className="work__l">
            <div className="work__status"><span className="dot dot--pulse" />Current</div>
            <div className="work__period"><Placeholder>[ Start date ]</Placeholder> — Present</div>
          </div>
          <div className="work__c">
            <div className="work__role">Estimator</div>
            <div className="work__co"><Placeholder>[ Company name ]</Placeholder></div>
            <p className="work__desc">
              <Placeholder block>[ 2–3 sentences on what you estimate, the kind of projects, the tools and methods you use, and the scale of what comes across your desk. ]</Placeholder>
            </p>
            <div className="work__chips">
              <span className="chip"><Placeholder>[ Skill ]</Placeholder></span>
              <span className="chip"><Placeholder>[ Skill ]</Placeholder></span>
              <span className="chip"><Placeholder>[ Skill ]</Placeholder></span>
              <span className="chip"><Placeholder>[ Skill ]</Placeholder></span>
            </div>
          </div>
          <div className="work__r">
            <div className="work__r-k">Location</div>
            <div className="work__r-v"><Placeholder>[ City ]</Placeholder></div>
            <div className="work__r-k">Type</div>
            <div className="work__r-v"><Placeholder>[ Full / Part-time ]</Placeholder></div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================
//  CONTACT
// ============================================================
function Contact() {
  return (
    <section className="section section--contact" id="contact">
      <SectionLabel>Contact</SectionLabel>
      <div className="contact">
        <div className="contact__l">
          <p className="contact__p"><Placeholder>[ One-line invitation ]</Placeholder></p>
          <a className="contact__mail" href="mailto:">
            <Placeholder>[ your.email@domain.com ]</Placeholder>
            <span>↗</span>
          </a>
        </div>
        <div className="contact__r">
          <a className="social" href="#">
            <span className="social__k">01</span>
            <span className="social__l">LinkedIn</span>
            <span className="social__v"><Placeholder>[ /in/handle ]</Placeholder></span>
            <span className="social__a">↗</span>
          </a>
          <a className="social" href="#">
            <span className="social__k">02</span>
            <span className="social__l">GitHub</span>
            <span className="social__v"><Placeholder>[ /handle ]</Placeholder></span>
            <span className="social__a">↗</span>
          </a>
          <a className="social" href="#">
            <span className="social__k">03</span>
            <span className="social__l">CV</span>
            <span className="social__v"><Placeholder>[ link to PDF ]</Placeholder></span>
            <span className="social__a">↗</span>
          </a>
        </div>
      </div>
      <footer className="footer">
        <div>© 2026 · <Placeholder italic={false}>[ Your Name ]</Placeholder></div>
      </footer>
    </section>
  );
}

// ============================================================
//  TWEAKS APPLICATION
// ============================================================
function applyTweaks(t) {
  const root = document.documentElement;
  const set = FONT_SETS[t.fontSet] || FONT_SETS.Editorial;
  root.style.setProperty("--serif", set.serif);
  root.style.setProperty("--sans", set.sans);
  root.style.setProperty("--mono", set.mono);
  root.style.setProperty("--accent", t.accent);
  const hexToRgba = (hex, a) => {
    const m = hex.replace("#", "");
    const r = parseInt(m.slice(0,2), 16), g = parseInt(m.slice(2,4), 16), b = parseInt(m.slice(4,6), 16);
    return `rgba(${r},${g},${b},${a})`;
  };
  root.style.setProperty("--accent-glow", hexToRgba(t.accent, 0.45));
  root.style.setProperty("--accent-soft", hexToRgba(t.accent, 0.08));
  root.style.setProperty("--accent-tint", hexToRgba(t.accent, 0.04));
  root.style.setProperty("--accent-ring", hexToRgba(t.accent, 0.25));
}

// ============================================================
//  APP
// ============================================================
function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  useEffect(() => { applyTweaks(t); }, [t]);

  const [theme, toggleTheme] = useTheme();

  const categoryMap = useMemo(() => {
    const out = {};
    Object.entries(CATEGORIES).forEach(([name, def]) => {
      out[name] = (t.categoryColors && t.categoryColors[name]) || def.color;
    });
    return out;
  }, [t.categoryColors]);

  const isLinkable = (type) => !!CATEGORIES[type]?.linkable;

  const setCategoryColor = (name, value) => {
    setTweak("categoryColors", { ...(t.categoryColors || {}), [name]: value });
  };

  const handleOpenProject = (id) => {
    if (!PROJECT_IDS.has(id)) return;
    window.location.href = `Projects.html#project-${id}`;
  };

  return (
    <div className="app">
      <Nav page="home" theme={theme} onToggleTheme={toggleTheme} />
      <main>
        <Work />
        <TimelineSection categoryMap={categoryMap} onOpenProject={handleOpenProject} isLinkable={isLinkable} />
        <Contact />
      </main>
      <TweaksPanel>
        <TweakSection label="Typography">
          <TweakSelect label="Font pairing" value={t.fontSet} options={Object.keys(FONT_SETS)} onChange={(v) => setTweak("fontSet", v)} />
          <div className="tweak-note">{FONT_SETS[t.fontSet]?.note}</div>
        </TweakSection>
        <TweakSection label="Accent">
          <TweakColor label="Page accent" value={t.accent} options={ACCENT_OPTIONS} onChange={(v) => setTweak("accent", v)} />
        </TweakSection>
        <TweakSection label="Category colors">
          {Object.entries(CATEGORIES).map(([name, def]) => (
            <TweakColor
              key={name}
              label={name}
              value={categoryMap[name]}
              options={def.swatches}
              onChange={(v) => setCategoryColor(name, v)}
            />
          ))}
        </TweakSection>
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
