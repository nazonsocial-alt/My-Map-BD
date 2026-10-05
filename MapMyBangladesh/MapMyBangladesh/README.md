# MapMyBangladesh — Track Every District You Explore
Open `index.html` (or use Live Server). No build step, no framework.

## Design
Calm, Apple-inspired minimalism: generous whitespace, 22px radii, soft shadows, subtle glass cards, spring-like easing. The map is an original hex cartogram (one tile per district) so every district is equally tappable on mobile.

## Color system
Primary `#0F172A` · Accent `#2563EB` · Success `#22C55E` (visited) · Warning `#F59E0B` (wishlist) · Danger `#EF4444` (favorite) · Background `#F8FAFC`. Dark mode swaps surfaces via CSS variables in `assets/css/app.css`.

## Typography
Inter (Google Fonts, system fallback offline). Headings 700 with -0.04em tracking and fluid `clamp()` sizing; body 16/1.6.

## Components
`.btn` (+ripple), `.card`, `.chip`, `.tg` toggle pills, `.ring`, `.bar`, `.badge`, `.item`, toast, skeleton.

## Structure
`assets/js/data.js` districts · `app.js` store/theme/nav/toasts/badges · `map.js` map, panel, explorer, zoom/pan, export · `stats.js` statistics · `sw.js` offline cache.

## Notes
PNG/JPG/PDF export loads html2canvas and jsPDF from cdnjs on first use (needs internet once). Service worker requires http(s), not `file://`. Data lives in localStorage.
To make the ZIP: `zip -r MapMyBangladesh.zip MapMyBangladesh`
