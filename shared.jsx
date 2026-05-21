// ============================================================
//  SHARED — Placeholder, theme hook, Nav.
//  Loaded by BOTH the home page (portfolio.jsx) and the
//  Projects page (projects-page.jsx). Components are exposed
//  on `window` because each <script type="text/babel"> gets
//  its own scope.
// ============================================================
const { useState: _useState, useEffect: _useEffect } = React;

// ---------- Placeholder ----------
const Placeholder = ({ children, block, italic = true }) => (
  <span style={{
    color: "var(--placeholder)",
    fontStyle: italic ? "italic" : "normal",
    fontWeight: 400,
    display: block ? "block" : "inline",
  }}>
    {children}
  </span>
);

const isPlaceholder = (s) => typeof s === "string" && s.startsWith("[") && s.endsWith("]");
const RenderText = ({ children, block }) =>
  isPlaceholder(children)
    ? <Placeholder block={block}>{children}</Placeholder>
    : (block ? <span style={{ display: "block" }}>{children}</span> : <span>{children}</span>);

// ---------- Theme hook (dark | light, localStorage) ----------
function useTheme() {
  const [theme, setTheme] = _useState(() => {
    try { return localStorage.getItem("portfolio-theme") || "dark"; }
    catch { return "dark"; }
  });
  _useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("theme-light", theme === "light");
    try { localStorage.setItem("portfolio-theme", theme); } catch (e) {}
  }, [theme]);
  const toggle = () => setTheme(p => p === "light" ? "dark" : "light");
  return [theme, toggle];
}

// ---------- Section label (no bar) ----------
const SectionLabel = ({ children, note }) => (
  <div className="section-label-row">
    <div className="section-label">
      <span className="section-label__t">{children}</span>
    </div>
    {note ? <div className="section-note">{note}</div> : null}
  </div>
);

// ---------- Nav with theme toggle ----------
//  page = "home" | "projects"
//   On "home", in-section anchors are #ids and scroll-spy drives active.
//   On "projects", in-section anchors go to "Portfolio.html#id" and the
//   Projects item is always active.
function Nav({ page = "home", theme, onToggleTheme }) {
  const [active, setActive] = _useState(page === "projects" ? "projects" : "work");

  _useEffect(() => {
    if (page !== "home") return;
    const ids = ["work", "timeline", "contact"];
    const onScroll = () => {
      let cur = "work";
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top < window.innerHeight * 0.4) cur = id;
      }
      setActive(cur);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [page]);

  const hrefFor = (id) => {
    if (id === "projects") return "Projects.html";
    return page === "home" ? `#${id}` : `Portfolio.html#${id}`;
  };
  const items = [
    ["work", "Work"],
    ["timeline", "Timeline"],
    ["projects", "Projects"],
    ["contact", "Contact"],
  ];

  return (
    <nav className="nav nav--center">
      <ul className="nav__list">
        {items.map(([id, label]) => (
          <li key={id} className={active === id ? "is-active" : ""}>
            <a href={hrefFor(id)}>{label}</a>
          </li>
        ))}
      </ul>
      <button
        type="button"
        className="nav__theme"
        onClick={onToggleTheme}
        aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
        title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
      >
        {theme === "light" ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
          </svg>
        )}
      </button>
    </nav>
  );
}

Object.assign(window, {
  Placeholder, isPlaceholder, RenderText, SectionLabel, useTheme, Nav,
});
