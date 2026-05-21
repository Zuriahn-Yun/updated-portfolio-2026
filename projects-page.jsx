const { useState, useEffect } = React;
const { Placeholder, Nav, useTheme } = window;

// ============================================================
//  PROJECTS DATA
//  Add a new object to add a new project card.
//  id: referenced by projectId in the TIMELINE on Portfolio.html
// ============================================================
const PROJECTS = [
  // ── Research Data Pipelines ──────────────────────────────
  {
    id: "proj-deepsqueak",
    no: "01",
    domain: "Neuroscience / Data",
    title: "DeepSqueak Pipeline",
    front: "MATLAB pipeline for high-throughput mouse audio analysis.",
    back: "Developed a MATLAB pipeline that bypasses the DeepSqueak GUI to enable high-throughput analysis of mouse ultrasonic vocalization audio files. Leverages DeepSqueak's dependencies while automating batch processing — making it significantly faster and more scalable for research teams.",
    meta: ["2024–2026", "MATLAB · DeepSqueak", "Developer"],
    github: "https://github.com/Zuriahn-Yun/DeepSqueak-Pipeline"
  },
  {
    id: "proj-immuno",
    no: "02",
    domain: "Bioimage Analysis",
    title: "Immunohistochemistry Pipeline",
    front: "Python pipeline for interactive IHC imaging with RGB controls.",
    back: "Built a Python pipeline for immunohistochemistry imaging that loads and displays TIFF files with interactive per-channel RGB intensity controls. Developed and maintains a custom Python package to support the pipeline, enabling reproducible analysis across the research team.",
    meta: ["2024–2026", "Python · Pandas · Pillow", "Developer"],
    github: "https://github.com/Zuriahn-Yun/Immunohistochemistry-Pipeline"
  },
  {
    id: "proj-gramstain",
    no: "03",
    domain: "Bioimage Analysis",
    title: "Gram Stain Pipeline",
    front: "Scalable image analysis for gut proliferation in ASD mouse models.",
    back: "Developed scalable Python-based image analysis pipelines using Pillow to study gut proliferation in ASD and WT mouse models, assessing the effects of CBD and terpene therapy. Enabled efficient, team-wide access to high-throughput microscopy results.",
    meta: ["2024–2026", "Python · Pandas · Pillow", "Developer"],
    github: "https://github.com/Zuriahn-Yun/Gram-Stain-Pipeline"
  },

  // ── Hackathons ───────────────────────────────────────────
  {
    id: "proj-kelp",
    no: "04",
    domain: "Environmental / 3D Viz",
    title: "KELP",
    front: "3D pollution simulation platform — DubHacks 2025.",
    back: "KELP is an interactive platform built at DubHacks 2025 that uses real environmental data to simulate pollution scenarios across Washington State. Features 3D terrain visuals, allowing users to model and visualize how pollution could spread under different conditions — helping communities understand environmental risk.",
    meta: ["Oct 2025", "Python", "Full Stack"],
    github: "https://github.com/israelavendanojr/dubhacks-2025"
  },
  {
    id: "proj-crowd-vision",
    no: "05",
    domain: "Computer Vision / AI",
    title: "Crowd Vision",
    front: "Real-time crowd analysis with Llama 4 + CNN → RAG pipeline.",
    back: "Built a full-stack hackathon project integrating the Llama 4 API with a custom ensemble backend — GRID-based CNN → API → RAG pipeline — for real-time crowd analysis. The system extracts image and textual data, performs scenario assessments, and surfaces actionable insights.",
    meta: ["2025", "Python · Llama 4 API", "Backend / ML"],
    github: "https://github.com/israelavendanojr/llama-hackathon"
  },
  {
    id: "proj-pathora",
    no: "06",
    domain: "EdTech / AI",
    title: "Pathora",
    front: "AI-powered learning pathways — built in 6 hours.",
    back: "Developed the backend of a full-stack web application during a 6-hour hackathon using Python and React, integrating an AI agent to generate personalized learning pathways and increase accessibility to education.",
    meta: ["Spring 2025", "React · Python · Flask", "Backend"],
    github: "https://github.com/israelavendanojr/pathora"
  },

  // ── ML / Data Science ────────────────────────────────────
  {
    id: "proj-neural-net",
    no: "07",
    domain: "Machine Learning",
    title: "Neural Network from Scratch",
    front: "Full deep neural network in Python — no ML frameworks.",
    back: "Implemented a deep neural network entirely from scratch in Python, including forward and backward propagation, gradient descent, multiple activation functions, and loss computation — without using any high-level ML frameworks like TensorFlow or PyTorch.",
    meta: ["WWU", "Python · NumPy", "Solo"],
    github: null
  },
  {
    id: "proj-qubit",
    no: "08",
    domain: "Quantum Computing",
    title: "Qubit Simulation",
    front: "Python simulator for quantum states and Hermitian observables.",
    back: "Developed a Python simulator for a single qubit that models quantum states and observables as Hermitian matrices, and generates random Hermitian matrices. Provides a foundation for future extensions to multi-qubit systems.",
    meta: ["WWU", "Python · NumPy", "Solo"],
    github: "https://github.com/Zuriahn-Yun/Sample-Based-Quantum-Diagonalization-Simulation/tree/main"
  },
  {
    id: "proj-energy",
    no: "09",
    domain: "Data Science / Stats",
    title: "Building Energy Usage Model",
    front: "Regression model predicting building energy usage.",
    back: "Created a regression model to predict how much energy a building uses based on features like size, temperature, and occupancy. Found that building type and square footage had the largest impact on energy consumption. Presented findings with full statistical analysis.",
    meta: ["WWU", "Minitab", "Solo"],
    github: null
  },
  {
    id: "proj-poisson",
    no: "10",
    domain: "Statistics",
    title: "Poisson vs Binomial",
    front: "Statistical comparison of Binomial and Poisson distributions.",
    back: "Compared the Binomial and Poisson distributions by analyzing their behavior across varying parameters using statistical methods including mean comparison and R² from curve fitting. Found that when n is large and p is small, both converge — with implications for model selection in practice.",
    meta: ["WWU", "R Studio", "Solo"],
    github: null
  },

  // ── Software ─────────────────────────────────────────────
  {
    id: "proj-schedule",
    no: "11",
    domain: "Automation / Low Code",
    title: "Schedule Automation",
    front: "5 Power Automate workflows with Microsoft Teams integration.",
    back: "Developed five Microsoft Power Automate workflows for the WWU IT department, integrated with Microsoft Teams. Features a clean, scalable design that enables easy copy-paste deployment across teams. Reduced manual scheduling overhead and improved visibility across the department.",
    meta: ["WWU IT Dept.", "Power Automate · Teams", "Developer"],
    github: null
  },
  {
    id: "proj-trading",
    no: "12",
    domain: "Finance / Software",
    title: "Java Trading Simulation",
    front: "Stock trading simulator with MySQL, split adjustments, and moving averages.",
    back: "Created a Java program that connects to a MySQL database to pull historical stock data and simulate basic trading activity. Adjusts for stock splits, uses moving averages to inform buy/sell decisions, and runs simulations over time to evaluate strategy performance.",
    meta: ["WWU", "Java · SQL", "Solo"],
    github: null
  },
  {
    id: "proj-wordhunt",
    no: "13",
    domain: "Algorithms",
    title: "iOS Word Hunt Solver",
    front: "DFS word finder against an English dictionary — still lose.",
    back: "Built a Python program that takes a Word Hunt board as input and uses depth-first search to find all valid words, cross-referencing a full English dictionary. A fun exercise in graph traversal that substantially improved my Word Hunt scores (results not guaranteed).",
    meta: ["Personal", "Python", "Solo"],
    github: "https://github.com/Zuriahn-Yun/WordHuntSolver/blob/main/solver.py"
  },
  {
    id: "proj-phylo",
    no: "14",
    domain: "Bioinformatics",
    title: "Phylogenetic Tree",
    front: "Java agglomerative clustering from raw genetic data.",
    back: "Built a Java application to generate a complete phylogenetic tree from genetic data using agglomerative clustering. Starting from a forest of single-node species trees, the program calculates pairwise genetic distances and merges the closest pairs iteratively until a single tree remains.",
    meta: ["WWU", "Java", "Solo"],
    github: null
  },
  {
    id: "proj-racket",
    no: "15",
    domain: "Programming Languages",
    title: "Racket Interpreter",
    front: "Full interpreter and parser for Racket — written in Racket.",
    back: "Designed and implemented a full interpreter and parser for the Racket language, written entirely in Racket from scratch. Constructed a complete parsing pipeline, managed lexical scope and evaluation rules, and handled closures and higher-order functions.",
    meta: ["WWU", "Racket", "Solo"],
    github: null
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
            <span className="proj__domain">{p.domain}</span>
          </div>
          <div className="proj__art" aria-hidden="true">
            <div className="proj__art-inner"><span>{p.no}</span></div>
          </div>
          <div className="proj__title">{p.title}</div>
          <div className="proj__hook">{p.front}</div>
          <div className="proj__cta">
            <span>Read more</span>
            <span className="proj__arrow">→</span>
          </div>
        </div>
        {/* Back */}
        <div className="proj__face proj__face--back">
          <div className="proj__top">
            <span className="proj__no">{p.no}</span>
            <span className="proj__back-label">{p.domain}</span>
          </div>
          <div className="proj__back-body">{p.back}</div>
          <div className="proj__back-meta">
            {p.meta.map((m, i) => (
              <div key={i} className="proj__back-meta-cell">
                <span>0{i+1}</span>
                <span>{m}</span>
              </div>
            ))}
          </div>
          <div className="proj__cta proj__cta--back">
            {p.github && p.github !== "#" && !p.github.startsWith("/Images") ? (
              <a
                href={p.github}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                style={{ color: "var(--fg)", textDecoration: "none" }}
              >
                View on GitHub ↗
              </a>
            ) : (
              <span>← Back</span>
            )}
          </div>
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
          <div className="page-head__eyebrow">Projects · {String(PROJECTS.length).padStart(2, "0")}</div>
          <h1 className="page-head__title">Projects</h1>
          <p className="page-head__sub"></p>
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
          <div>© 2026 · Zuriahn Yun</div>
        </footer>
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
