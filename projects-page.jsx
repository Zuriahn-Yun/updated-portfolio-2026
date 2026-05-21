const { useState, useEffect } = React;
const { Placeholder, Nav, useTheme } = window;

// ============================================================
//  PROJECTS DATA — add as many projects as you like.
//
//  id       — must match `projectId` on a TIMELINE entry to enable deep-linking
//  no       — display number (e.g. "01", "02")
//  domain   — short category label (e.g. "Data Science", "Web Dev")
//  title    — project title
//  front    — one-line hook shown on the card front
//  back     — 3-4 sentence breakdown shown after the card flips
//  meta     — array of 3 strings shown as metadata on the back: [Year, Tools, Role]
// ============================================================
const PROJECTS = [
  {
    id: "proj-01",
    no: "01",
    domain: "[ Domain ]",
    title: "[ Project one title ]",
    front: "[ One-line hook ]",
    back: "[ 3–4 sentence breakdown. Context → approach → method → outcome. ]",
    meta: ["[ Year ]", "[ Tools ]", "[ Role ]"]
  },
  {
    id: "proj-02",
    no: "02",
    domain: "[ Domain ]",
    title: "[ Case study two title ]",
    front: "[ One-line hook ]",
    back: "[ Walk through the problem, the constraint that mattered, and how you arrived at the solution. ]",
    meta: ["[ Year ]", "[ Tools ]", "[ Role ]"]
  },
  {
    id: "proj-03",
    no: "03",
    domain: "[ Domain ]",
    title: "[ Project three title ]",
    front: "[ One-line hook ]",
    back: "[ Outline the brief, your method, what surprised you, and what shipped. ]",
    meta: ["[ Year ]", "[ Tools ]", "[ Role ]"]
  },
];

// ============================================================
//  PROJECT CARD (flip on click)
// ============================================================
function ProjectCard({ p, flipped, onFlip, highlight }) {
  return (
    <div id={`project-${p.id}`} className={`proj ${flipped ? "is-flipped" : ""} ${highlight ? "is-highlight" : ""}`}>
      <button className="proj__inner" onClick={onFlip} aria-pressed={flipped}>
        {/* Front */}
        <div className="proj__face proj__face--front">
          <div className="proj__top">
            <span className="proj__no">{p.no}</span>
            <span className="proj__domain"><Placeholder>{p.domain}</Placeholder></span>
          </div>
          <div className="proj__art" aria-hidden="true">
            <div className="proj__art-inner"><span>{p.no}</span></div>
          </div>
          <div className="proj__title"><Placeholder>{p.title}</Placeholder></div>
          <div className="proj__hook"><Placeholder>{p.front}</Placeholder></div>
          <div className="proj__cta">
            <span>Read more</span>
            <span className="proj__arrow">→</span>
          </div>
        </div>
        {/* Back */}
        <div className="proj__face proj__face--back">
          <div className="proj__top">
            <span className="proj__no">{p.no}</span>
            <span className="proj__back-label">Project</span>
          </div>
          <div className="proj__back-body"><Placeholder block>{p.back}</Placeholder></div>
          <div className="proj__back-meta">
            {p.meta.map((m, i) => (
              <div key={i} className="proj__back-meta-cell">
                <span>0{i+1}</span>
                <Placeholder>{m}</Placeholder>
              </div>
            ))}
          </div>
          <div className="proj__cta proj__cta--back"><span>← Back</span></div>
        </div>
      </button>
    </div>
  );
}

// ============================================================
//  APP — Projects page
// ============================================================
function App() {
  const [theme, toggleTheme] = useTheme();
  const [flippedId, setFlippedId]     = useState(null);
  const [highlightId, setHighlightId] = useState(null);

  // Deep-link: if URL hash is #project-{id}, flip + highlight + scroll to it.
  useEffect(() => {
    const m = window.location.hash.match(/^#project-([\w-]+)/);
    if (!m) return;
    const id = m[1];
    if (!PROJECTS.find(p => p.id === id)) return;
    setFlippedId(id);
    setHighlightId(id);
    setTimeout(() => {
      const el = document.getElementById(`project-${id}`);
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - 90;
        window.scrollTo({ top, behavior: "smooth" });
      }
    }, 60);
    const t = setTimeout(() => setHighlightId(null), 2400);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="app">
      <Nav page="projects" theme={theme} onToggleTheme={toggleTheme} />
      <main>
        <header className="page-head">
          <div className="page-head__eyebrow">Projects · 0{PROJECTS.length}</div>
          <h1 className="page-head__title">Projects</h1>
          <p className="page-head__sub">
            <Placeholder block>[ One- or two-sentence intro to the projects collection. What kinds of work? What ties them together? ]</Placeholder>
          </p>
        </header>

        <section className="section" style={{ paddingTop: 0, borderBottom: "none" }}>
          <div className="projs">
            {PROJECTS.map(p => (
              <ProjectCard
                key={p.id}
                p={p}
                flipped={flippedId === p.id}
                onFlip={() => setFlippedId(flippedId === p.id ? null : p.id)}
                highlight={highlightId === p.id}
              />
            ))}
          </div>
        </section>

        <footer className="page-foot">
          <a href="Portfolio.html">← Back to portfolio</a>
          <div>© 2026 · <Placeholder italic={false}>[ Your Name ]</Placeholder></div>
        </footer>
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
