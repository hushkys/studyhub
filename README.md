# StudyHub

**Comprehensive maturita preparation platform for the 2025/2026 school year.**

StudyHub is a fully client-side single-page application covering five Czech high school graduation exam subjects. It combines structured study content, interactive quizzes, coding exercises, and a live exam countdown — all without a build step, server, or external dependencies.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Subjects](#subjects)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Accessibility and Customization](#accessibility-and-customization)
- [Tech Stack](#tech-stack)
- [Automated Backup](#automated-backup)

---

## Overview

The application runs entirely in the browser. All study content is embedded in JavaScript data files, making the project portable — it can be opened directly from the filesystem or served from any static host.

There are no frameworks, no bundler, no npm install required. The entire app is a single HTML file referencing a handful of JS and CSS files.

Built for the Czech maturita exam cycle ending in spring 2026, the platform covers:

- 150+ interactive coding exercises
- 400+ quiz questions across four subjects
- Full study notes for 150+ topics and books
- Live countdown to written, oral, and practical exam dates

---

## Features

### Study Content

Each subject is organized into numbered topics. Every topic page renders full markdown content including headings, code blocks with syntax highlighting, expandable detail sections, and inline tip callouts.

- Structured topic hierarchy: subject > topic > content
- Collapsible sidebar with the full navigation tree for all subjects
- Breadcrumb trail in the navbar reflecting the current location
- Back navigation between topic, category, and home views
- Scroll-reveal animations as sections enter the viewport

### Full-Text Search

A global search overlay indexes all subjects, topics, and content. It is accessible from the navbar and supports keyboard navigation.

- Triggered via the search icon or keyboard shortcut
- Results show subject, topic title, and a content excerpt
- Dismissed with Escape or the close button

### Quiz Mode

Multiple-choice quiz with randomized question order and instant feedback.

- 5 answer options per question
- Filter by subject: KYB, PRG, Czech, Math
- Filter by difficulty: Easy, Medium, Hard
- Correct answer revealed immediately after selection
- Running score displayed throughout the session

### Coding Exercises

Interactive programming exercises for the PRG subject, covering core C# and Java concepts.

- 150 exercises across 10 topic areas
- Three exercise formats:
  - **Drag and drop** — assemble code blocks in the correct order
  - **Fill in the blank** — type missing keywords or values
  - **Code ordering** — sort shuffled lines into a working program
- Filter by topic and difficulty
- Session progress tracked with a completion counter

### Countdown Widget

A real-time countdown to all maturita exam dates, organized by exam type.

- Tabbed interface: written, oral, practical
- Days, hours, minutes, and seconds displayed live
- Updates every second without page reload

### Hero Section

The home page opens with an animated hero featuring a canvas-based particle system and layered CSS orbs. Subject chips float around the background. The hero includes quick-access buttons to start studying or launch the quiz directly.

### Scrolling Ticker

A horizontally scrolling ticker below the subject grid displays rotating study tips and reminders, pulled from a dedicated tips data file.

---

## Subjects

| Code | Subject | Topics | Description |
|------|---------|--------|-------------|
| KYB | Kybernetická bezpečnost | 20 | Networks, security protocols, hardware, threats, OS security |
| PRG | Programování | 22 | HTML/CSS, C#, OOP, databases, algorithms, robotics, IoT |
| CES | Český jazyk | 47 | Literary analysis and reading journal entries for required books |
| MAT | Matematika | 26 | Algebra, geometry, calculus, statistics, combinatorics |
| ANG | Anglický jazyk | 36 | Conversation topics, UK/USA culture, IT terminology |
| CODE | Vzorové kódy | 7 | Annotated maturita project examples in Java and C# |

---

## Project Structure

```
studyhub/
├── index.html            Application shell — all pages, sections, and overlays
├── app.js                Core logic — routing, rendering, quiz, exercises, search
├── style.css             Base styles — layout, typography, components, themes
├── visual_patch.css      Visual overrides — spacing, responsive adjustments
├── data.js               All study content — KYB, PRG, CES, MAT, ANG topics
├── exercises.js          PRG coding exercises — drag & drop, fill-in, ordering
├── quiz_questions.js     Quiz question bank — 400+ questions across subjects
├── tips.js               Study tips for the scrolling ticker
├── prg_code.js           Annotated code examples for the CODE subject
├── kyb_content.js        Supplementary KYB topic content
├── kyb_inline.json       Inline KYB structured data
├── backup.sh             Automated git backup script (runs via cron)
└── package.json          Project metadata
```

### Key Files

**`app.js`** — The entire application runtime. Handles client-side routing between home, category, and topic views; markdown rendering; quiz state machine; exercise engine; search indexing; countdown timers; accessibility panel; and all DOM interactions.

**`data.js`** — The content database. A single large JavaScript file exporting all topic content as structured objects. Topics contain markdown strings that are parsed and rendered at runtime.

**`exercises.js`** — Exercise definitions for the PRG subject. Each exercise specifies its type (drag-drop, fill-in, ordering), difficulty, topic tag, and the correct answer structure.

**`style.css` + `visual_patch.css`** — Split stylesheet. `style.css` contains the full design system including CSS custom properties for all theme colors and font sizes. `visual_patch.css` contains targeted overrides applied on top.

---

## Getting Started

No installation required.

### Option 1 — Open directly

```bash
open index.html
```

This works for most features. Some browsers restrict local file access for JavaScript modules; if content does not load, use Option 2.

### Option 2 — Local development server

```bash
# Using Node.js
npx serve .

# Using Python
python3 -m http.server 8080
```

Then open `http://localhost:8080` in your browser.

### Option 3 — Static hosting

The project deploys as-is to any static host (GitHub Pages, Netlify, Vercel, Cloudflare Pages). No build step needed — just upload the directory.

---

## Accessibility and Customization

The accessibility panel is available via the icon in the top-right corner of the navbar.

### Font Size

Five size steps applied globally via a `data-font-size` attribute on the root element:

| Value | Label |
|-------|-------|
| `xs` | Extra small |
| `sm` | Small |
| `md` | Normal (default) |
| `lg` | Large |
| `xl` | Extra large |

### Color Themes

Over 10 built-in themes selectable from the panel:

- Dark (default)
- Light
- High contrast dark
- High contrast light
- Sepia
- Ocean
- Forest
- Sunset
- Midnight
- Slate

All theme colors are defined as CSS custom properties. Adding a new theme requires only a new `[data-theme="name"]` block in `style.css`.

### Persistence

Both font size and theme selection are saved to `localStorage` and restored automatically on the next visit.

---

## Tech Stack

| Technology | Usage |
|------------|-------|
| Vanilla JavaScript (ES6+) | Application logic, routing, rendering |
| CSS Custom Properties | Theming, font scaling, component variants |
| HTML5 Canvas | Hero section particle animation |
| CSS Animations | Orbs, scroll-reveal, page transitions |
| Inter | UI typography (Google Fonts) |
| JetBrains Mono | Code blocks and monospace content |
| localStorage | Persistent user preferences |

No frameworks. No bundler. No runtime dependencies.

---

## Automated Backup

The repository is backed up to GitHub automatically every 10 minutes via a cron job.

### Setup

The cron entry runs `backup.sh` on a 10-minute interval:

```
*/10 * * * * /path/to/studyhub/backup.sh >> /path/to/backup.log 2>&1
```

### Script

```bash
#!/bin/bash
cd /path/to/studyhub
git add -A
git diff --cached --quiet && exit 0
git commit -m "auto-backup $(date '+%Y-%m-%d %H:%M')"
git push origin main
```

The script exits silently if there are no changes, so the commit history only contains meaningful diffs.

### What is tracked

Only application source files are committed. The following are excluded via `.gitignore`:

```
.env
node_modules/
__pycache__/
*.pyc
.gemini_cache/
Daily_work/
Maturity25/
zapisky/
KYB/
PRG/
Čeština/
*.backup
backup.log
```

---

## License

This project is for personal educational use. Content is based on the Czech national maturita curriculum for the 2025/2026 school year.
