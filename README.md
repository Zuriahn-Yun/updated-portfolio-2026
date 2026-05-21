# Portfolio 2026

A sleek, dark portfolio website built with React (CDN) + Babel. No build step required — open `Portfolio.html` directly in a browser or deploy to GitHub Pages.

## Structure

```
Portfolio.html       ← main page (Work · Timeline · Contact)
Projects.html        ← projects gallery (flip cards, deep-linkable from timeline)
portfolio.jsx        ← main page components + all data arrays
projects-page.jsx    ← projects page component + PROJECTS data array
shared.jsx           ← Nav, theme toggle, Placeholder helpers
tweaks-panel.jsx     ← floating Tweaks panel (font, accent, category colors)
portfolio.css        ← all styles, dark + light mode
```

## Filling in your content

### portfolio.jsx

**Your name & role** — search for `[ Your Name ]` and `Data Science student & Estimator` in the `Work` component.

**TIMELINE array** — one object per entry:
```js
{
  type: "Work",           // must match a key in CATEGORIES
  title: "Help Desk",
  start: "2024-09",       // YYYY-MM or YYYY-MM-DD
  end: "2026-06",         // or "present" for ongoing
  desc: "...",            // shown in the detail panel
  projectId: "proj-01",  // optional — links to a card on Projects.html
}
```

**Adding a new timeline category** — add one line to `CATEGORIES`:
```js
"Research": { color: "#22D3EE", swatches: ["#22D3EE","#0EA5E9"], linkable: true },
```

**Contact section** — update the email `href` and the social link `href` attributes.

### projects-page.jsx

**PROJECTS array** — one object per project:
```js
{
  id: "proj-01",           // referenced by projectId in TIMELINE
  no: "01",
  domain: "Data Science",
  title: "My Project",
  front: "One-line hook",
  back: "Full breakdown...",
  meta: ["2025", "Python · SQL", "Lead analyst"]
}
```

## GitHub Pages deployment

1. Push this repo to GitHub.
2. Go to **Settings → Pages → Source → Deploy from a branch**.
3. Select `main` / `root`.
4. Your portfolio will be live at `https://<username>.github.io/<repo>/Portfolio.html`.

## Design details

- **Dark mode** (default): `#000000` background, `#f4f4f5` text.
- **Light mode**: warm off-white, toggled via the sun/moon button in the nav. Preference saved to `localStorage`.
- **Accent**: electric blue `#3B82F6` by default — changeable in the Tweaks panel.
- **Timeline categories**: Work/Internship = blue, Project = yellow, Case study = orange, Volunteering/Club = red.
- **Timeline bars**: horizontal Gantt-style. Weekend/day entries render as a small dot-nub. Ongoing items use a dashed border.
- **Projects**: 3-column flip-card grid. Timeline entries with a `projectId` deep-link directly to the matching card.
- **Fonts**: 5 switchable pairings via the Tweaks panel (Editorial, Grotesque, Modern Serif, Bricolage, Mono Brutal).
