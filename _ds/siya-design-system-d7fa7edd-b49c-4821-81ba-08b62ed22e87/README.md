# Siya Design System

> **Siya** is an AI companion for schools — observational intelligence that helps teachers, principals, and parents truly **know** students, not just their scores. EdTech B2B2C, India. Website: **[heysiya.ai](https://heysiya.ai)**.

This design system is the single source of truth for designing anything under the Siya brand — product UI, marketing, social posts, decks, stationery. Every decision here traces back to one principle:

> **Observant, not declarative. Warm, not clinical. Empowering, not commanding.**

---

## The product in one paragraph

Siya analyses student worksheets week over week — hundreds per teacher — and surfaces soft, warm patterns the teacher *already senses but can't always articulate*: shifts in effort, subject-specific confidence, early signs of disengagement. **Siya suggests. The teacher always acts.** No risk scores. No alarms. No extra workflow.

**Audiences:**
- **Principals** — formal + warm, ROI-led
- **Teachers** — warmest tone, suggestions only (never commands)
- **Parents** — calm, one clear insight at a time
- **Students** — Phase 2

**Core tagline:** *Make Time for What Matters.*
**Supporting line:** *Enabling schools to lead with Insight, not Instinct.*

---

## Sources we used (for future editors)

All source material lives under `uploads/` in this project. We extracted, organised, and reinterpreted it into this design system. If you're iterating on the system, re-read these:

| Source | What's in it |
|---|---|
| `uploads/Style_Guide_Color_Palette.pdf` | Canonical color palette — Lavender + Teal scales, pastels, grayscale, tag colors |
| `uploads/Siya_New_logo_svg.svg` (+ PNGs) | Primary wordmark — lavender, black, white variants |
| `uploads/Variation 1–10.png` | Mascot emotion set — wave, professional, graduate, peace, sad, thinking, skeptical, curious, happy, love |
| `uploads/Banner_LinkedIn.jpg` + `Profile Picture_LinkedIn.jpg` | Social identity — hero banner, square avatar |
| `uploads/Siya_Holi_Post.jpg`, `Siya_Rama_Navami_Post.jpg`, `Siya_Ramzan_Post.jpg` | Cultural / festival post templates |
| `uploads/Business Card Front.pdf` + `Back.pdf` | Stationery — shows corporate application |
| **LinkedIn carousel set** (Cover, Cover with a Hook, Full Bleed Hook, Headline & Body, Headline + Image v1/v2, Bullet Points v1/v2, Numbered Points v1/v2, Split Layout v1/v2/v3, Stats v1/v2, Statistic Highlight v1/v2, Testimonials, Announcement, End, Before vs After) | Canonical slide templates for 1080×1080 carousels — copy, layout, typography, voice |

No Figma file or codebase was provided at import time. All reconstructions are built from the source PDFs, PNGs, and the written brief. **If you have a Figma or product codebase, please import it — see "Caveats" below.**

---

## Index — what's in this folder

```
siya-design-system/
├── README.md                     ← you are here
├── SKILL.md                      ← cross-compatible skill manifest for Claude Code
├── colors_and_type.css           ← single-source CSS vars (tokens + semantic classes)
├── assets/
│   ├── logos/                    ← lavender / black / white wordmarks (SVG + PNG)
│   ├── mascot/                   ← 10 mascot emotion variations
│   └── social/                   ← LinkedIn banner, profile, festival posts
├── preview/                      ← individual design-system cards (Type / Colors / Spacing / Components / Brand)
├── slides/
│   ├── index.html                ← clickable carousel deck demoing every template
│   └── *.jsx                     ← one component per slide template
└── ui_kits/
    └── siya-app/                 ← React recreation of the Siya teacher/principal product surfaces
        ├── index.html
        ├── README.md
        └── *.jsx
```

---

## Content fundamentals

Siya's voice is the voice of a **thoughtful observer**, not a sales pitch. Every line goes through four filters:

> **Observant not declarative · Warm not clinical · Empowering not commanding · Honest not alarming**

### Voice rules
- **Soft neutral tone, always.** Never alarmed, never exclamatory. No "urgent", "critical", "failing", "at risk".
- **Suggestions, never commands.** "Siya suggests…" / "Siya notices…" / "Worth a second look." never "You must…" / "Fix this now."
- **Short, grounded, specific.** "Three students showed early signs of disengagement. Their teacher had already noticed. Siya gave her the language to act."
- **Warmth through concreteness, not adjectives.** We don't say *"powerful AI"* — we say *"800+ worksheets analysed every week."*
- **No jargon.** No "risk scores", no "ML models", no "cohort segmentation". Say what it means in plain English.

### Casing
- **Sentence case** for headlines and UI labels. `"Three signals most reports miss."` never `"Three Signals Most Reports Miss."`
- **Title Case** is reserved for proper nouns and the core tagline *Make Time for What Matters.*
- **lowercase** for the product mark `siya` (as in the logo) when used as a word inside flowing copy on brand surfaces.

### Pronouns & POV
- Speak **to** the reader, **about** the student/teacher. "Every teacher deserves…" / "Your students…" — rarely "we".
- Use "Siya" as a subject, not "our AI" or "our platform". *"Siya notices."* *"Siya suggests."*

### Numbers & statistics
- Lead with the number, follow with the human meaning. `1.14 M+ worksheets analysed so far` then the key takeaway: *"Every number represents a teacher who had more time for what actually matters."*
- Exact numbers beat round ones (`800+`, `1.14M+`, `3 min` — not "thousands", "a lot").

### Emoji
- **Rarely.** One small accent emoji (🎉) may appear in announcement-style posts. Never in product UI.
- **Never** for decorative list bullets — use the actual bullet glyph `•` or numeric lists.
- The sparkle `✦` is the closest thing we have to a brand mark; used as a soft divider before overlines (`✦ EdTech Insight`, `✦ Thanks for reading`).

### Reference examples (pulled directly from templates)
- Cover hook: *"What if teachers never had to guess again?"*
- Insight phrasing: *"Arjun seems to process concepts better visually." — Siya, Week 12*
- Stat framing: *"Scale doesn't have to mean impersonal. With Siya, every student still gets seen."*
- Testimonial framing: *"This is the outcome every school should be able to give every parent. Not a report card. A relationship."*
- Festival copy (Ramzan): *"Wishing you a Ramzan filled with peace, growth, and meaningful learning."*

The **"What This Means"** or **"Key Takeaway"** block at the end of a stats/insight slide is a recurring device — use it.

---

## Visual foundations

### Color — the 70 / 20 / 10 rule (non-negotiable)

| % | Role | Colors |
|---|---|---|
| **70%** | Primary — Lavender family | `#A084E8` base + the full 50-900 scale |
| **20%** | Secondary — Teal family | `#2CD3C0` base + 50-900 scale |
| **10%** | Accents — Pastel supporting trio | Pink `#F7D9EE` · Orange `#F2A888` · Champagne `#FADCA8` |

Neutrals (grays) and semantic tag colors don't count against the ratio — they're infrastructure.

- **White + off-white** are the default canvas. Lavender is the brand signal, not the background.
- **Black (#010101)** is only used for headlines on pastel-gradient backgrounds (see carousel covers) and for the mascot's glasses/bowtie.
- **Dark mode / hero dark** uses `#1B1D1E → #2A2B2E`, with Lavender `#BBA8F1` reserved for one highlighted word ("Insight").

### Typography

**Four lanes, each fully scalable.** Pick the lane that matches the role, then the size.

| Lane | Family | Use |
|---|---|---|
| **Titles** (Xxl → Xxs) | Cabinet Grotesk (Xxl/Xl) · Plus Jakarta Sans (Lg → Xxs) | Headlines, page titles, card titles |
| **Text** (Xl → Xs) | Inter | Body copy, paragraphs, descriptive text |
| **Labels** (Lg → Xs) | Plus Jakarta Sans | Eyebrows, tags, form labels, metadata, captions |
| **Buttons** (Lg / Md / Sm) | Plus Jakarta Sans | CTA labels only |

Tokens live in `colors_and_type.css`:
- `--fs-title-*` / `--lh-title-*` / `--ls-title-*` / `--fw-title-*`
- `--fs-text-*`  / `--lh-text-*`  / `--fw-text-*`
- `--fs-label-*` / `--lh-label-*` / `--ls-label-*` / `--fw-label-*`
- `--fs-button-*` / `--lh-button-*` / `--ls-button-*` / `--fw-button-*`

**Family rules (never break):**
- **Cabinet Grotesk** — campaign register only (Title Xxl / Xl). Hoardings, cover slides, attention-grabbing titles. Never product UI.
- **Plus Jakarta Sans** — titles (Lg → Xxs), labels, buttons.
- **Inter** — all body/descriptive text.

**Style rules:**
- Titles are **balanced** (`text-wrap: balance`), text is **pretty** (`text-wrap: pretty`).
- Titles run tight leading (1.02–1.30) and negative tracking (-0.025em → 0).
- Text runs generous leading (1.50–1.60). Never go under 16px on web; 14px only in dense tables.
- Legacy aliases (`--fs-display-*`, `--fs-h*`, `--fs-body*`, `--fs-caption`, `--fs-overline`) still resolve; prefer the four lanes in new work.

### Backgrounds

- **Default:** clean white / `--primary-50` wash.
- **Feature / campaign:** a soft, multi-stop pastel gradient that touches all three accent colors (pink → champagne → lavender). See the Holi post and `--gradient-dawn`.
- **Editorial / hook:** deep charcoal (`#1B1D1E`) with a single highlighted Lavender word.
- **No hand-drawn illustrations, no repeating patterns, no grain.** The mascot is the only illustration.
- **Festival posts** have ornamental cultural motifs (rangoli dots, Arabic calligraphy border, Sanskrit watermark) rendered at **very low opacity (5–10%)** — they provide texture without shouting.

### Mascot

A **glossy lavender slime** — round, squishy, 3D-rendered, with a subtle pink blush and pastel highlights. **Glasses always present.** Bowtie optional (professional contexts), graduation cap, briefcase, etc. are situational.

- **Never redraw the mascot in SVG or flat vector.** Use the PNG renders in `assets/mascot/`.
- Minimum mascot display size: 64px. Below that, substitute the `siya` wordmark.
- Clear space around the mascot: the height of one glasses lens.
- Lives on white, lavender-50 wash, dark charcoal, or festival gradients. Never on clashing saturated backgrounds (no red, no bright blue).

### Layout

- **Generous whitespace.** Section padding at least 80px on desktop.
- **Single-column reading rhythm** for carousel slides — 1080×1080 square, content lives inside an 80px margin.
- **Editorial vertical hierarchy**: overline (e.g. `✦ EdTech Insight`) → display headline → body → CTA/source line pinned to the bottom (`heysiya.ai`).
- **Two fixed anchors on every 1080 slide**: slide counter top-left (`03 / 07`) and `heysiya.ai` bottom-right.

### Corners & borders

- **Soft edges always.** Radii live on a clear scale: 8 · 12 · 16 · 20 · 28 · 40 · pill.
- **Cards**: `--radius-lg` (16px) or `--radius-2xl` (28px). Never sharp.
- **Buttons**: `--radius-pill` (fully rounded) or `--radius-md` — never 4px.
- **Borders**: 1px `--gray-300` on inputs and dividers. Coloured borders live on **focused** inputs only (`--primary-500`).

### Shadows & elevation

Shadows are **soft, lavender-tinted, never grey drops**. They carry a 75/44/135 (deep purple) base at low alpha. Four-level scale `xs / sm / md / lg / xl` plus two brand-glow rings (`--shadow-glow-lavender`, `--shadow-glow-teal`) for focus states. Never stack more than one level per card.

### Transparency & blur

- **Rarely.** Not a glass-morphism brand.
- The one blessed use: **soft radial pastel glows** on gradient backgrounds (see the Holi post — blurred pink/teal/champagne orbs around the edges). Keep them at 40–60% opacity, behind everything.

### Imagery style

- **Warm, soft, lavender-biased.** If a photo enters the system, it should feel close to the palette — warm skin tones, natural light, no cold blue shadows.
- **Avoid stock-photo clichés** (handshakes, boardrooms, children-staring-at-laptops).
- The **mascot is the primary illustration** and usually carries the visual weight; real photography is secondary.

### Motion & interaction

- **Easing**: `--ease-out` (`cubic-bezier(0.22, 0.61, 0.36, 1)`) is the default — warm, decelerating, never sharp. `--ease-spring` for playful mascot reactions only.
- **Duration**: 180–260ms is the comfort zone. Longer than 420ms feels sluggish; shorter than 100ms feels abrupt.
- **Hover states**: slightly **darker** brand color (`-600` → `-700`) and optional subtle shadow lift (xs → sm). Never opacity fades on buttons — that reads "disabled".
- **Press states**: one step darker (`-700` → `-800`), no shrink. The brand is calm; things don't jump.
- **Focus rings**: always the `--shadow-glow-lavender` ring — 4px `rgba(160, 132, 232, 0.18)`. Never the browser default.
- **Bounces and overshoots**: reserved for the **mascot** and for **success confirmations**. The product UI itself never bounces.
- **Fades**: the default transition primitive. Slide-ups are acceptable for toasts.

### Layout rules / fixed elements

- **Slide counter** (`03 / 07`) — top-left on carousel slides
- **heysiya.ai** — bottom-right on carousel slides (always a URL, never a full sentence)
- **siya wordmark** — bottom-left on festival / announcement posts
- In product: a single **persistent left sidebar** with the wordmark pinned top.

---

## Iconography

Siya has **no custom icon font** in the source materials. Our approach:

- **Icons = Lucide** (https://lucide.dev) — loaded from the CDN (`https://unpkg.com/lucide@latest`). Chosen because:
  - **2px stroke** matches the soft, rounded brand feel (not Feather's thinner 1.5px, not Material's filled weight).
  - **Rounded line caps / joins** echo the logo's rounded terminals and the mascot's squish.
  - CDN-available → no font file to ship.
  - **FLAGGED** — please confirm or supply a custom icon set if one exists.
- **Color**: icons inherit `currentColor`. Default is `--fg-muted` (`#65676E`); interactive icons use `--primary-700`. Active/selected icons use `--primary-500`.
- **Size scale**: 16 · 20 · 24 · 32. Never scale-stretch; pick a fixed size.
- **No emoji in product UI.** Emoji is acceptable only in announcement-style social posts (`🎉 100 Schools`) and never more than one per artefact.
- **Unicode glyphs** used by the brand:
  - `✦` — the sparkle, used as an overline marker (`✦ EdTech Insight`)
  - `→` — the forward arrow on CTAs and "Swipe to read →"
  - `—` — em dash for attributions (`— Parent, Hyderabad · 2024`)
  - `·` — middle dot for metadata separators
- **The mascot is not an icon.** It's an illustration. Minimum 64px, always PNG.

---

## Caveats & iteration asks

**Known substitutions (please resolve):**
1. **Icon set is a substitution.** Lucide was chosen as a tone-match (2px stroke, rounded caps). If Siya's product already has an icon library, please share it and we'll swap.
2. **No Figma or codebase was imported.** All UI-kit screens are reconstructed from the tone / palette / templates. The `ui_kits/siya-app/` screens are **our best guess** at what the Siya product *should* feel like, not a pixel-faithful recreation. If you attach the real product, we'll re-do it against the source of truth.

**Resolved:**
- ✅ Cabinet Grotesk font files supplied and wired up via `@font-face` in `colors_and_type.css` (thin → extrabold, 6 weights).

**Out of scope for this first pass** (ask if you want these):
- Motion principles as Lottie/Rive files
- Email template system
- Brand photography direction (the briefs don't yet include real photography)
- Dark product UI (brief implies light-first)

---

## How to use this system

**Designing a new artefact?**
1. Import `colors_and_type.css`.
2. Pick a surface: white · lavender-50 wash · charcoal hero · pastel gradient.
3. Use semantic tokens (`var(--fg)`, `var(--accent)`, `--radius-lg`) — not raw hex.
4. Mascot optional. Glasses always on. Bowtie situational.
5. Run the copy through the four-filter voice check.
6. Confirm the 70 / 20 / 10 color ratio.

**Building a component?** See `preview/` for the canonical card examples and `ui_kits/siya-app/` for working React recreations.
