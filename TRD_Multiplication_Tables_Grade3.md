# Technical Requirements Document (TRD)
## Grade 3 Math — Multiplication Tables: 6, 7, 8, 9
### Gamified Simulation-Based Learning Website
**Platform:** intelliasg.com/courses/grade-3-math — Lesson 3.1
**Version:** 1.0
**Date:** June 2026
**Prepared by:** Intellia SG Engineering Team

---

## Table of Contents

1. [System Architecture](#1-system-architecture)
2. [Technology Stack](#2-technology-stack)
3. [Repository Structure (dsamyak/equal pattern)](#3-repository-structure)
4. [Component Architecture](#4-component-architecture)
5. [State Management](#5-state-management)
6. [Randomisation Engine](#6-randomisation-engine)
7. [Simulation Components — Technical Spec](#7-simulation-components--technical-spec)
8. [Audio System](#8-audio-system)
9. [Gamification Engine](#9-gamification-engine)
10. [Animation System](#10-animation-system)
11. [Data Persistence](#11-data-persistence)
12. [API Contracts](#12-api-contracts)
13. [Performance Requirements](#13-performance-requirements)
14. [Accessibility Implementation](#14-accessibility-implementation)
15. [Build & Deployment](#15-build--deployment)
16. [Testing Strategy](#16-testing-strategy)
17. [Design Token Reference](#17-design-token-reference)

---

## 1. System Architecture

### 1.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                  BROWSER (Client-Side SPA)                   │
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐   │
│  │  React App   │  │  Audio Eng.  │  │  Gamification    │   │
│  │  (Vite + TS) │  │  (Howler.js) │  │  Engine (Zustand)│   │
│  └──────────────┘  └──────────────┘  └──────────────────┘   │
│         │                                     │               │
│  ┌──────────────────────────────────────────────────────┐    │
│  │              Zustand Global Store                     │    │
│  │  { progress, crystals, badges, sessionQuestions,     │    │
│  │    audioSettings, currentWorld, currentModule }      │    │
│  └──────────────────────────────────────────────────────┘    │
│         │                                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐   │
│  │  localStorage│  │  sessionStore│  │  Analytics (GA4) │   │
│  │  (persist)   │  │  (runtime)   │  │  event tracking  │   │
│  └──────────────┘  └──────────────┘  └──────────────────┘   │
└─────────────────────────────────────────────────────────────┘
              ▲
              │ Embedded within
              ▼
┌─────────────────────────────────────────────────────────────┐
│          intelliasg.com (WordPress / LearnPress)             │
│          Lesson page: /courses/grade-3-math/lessons/         │
│          multiplication-tables-6-7-8-9/                      │
│          React app mounted as iframe OR web component        │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 Deployment Model

The lesson is a standalone React SPA bundled to static assets, embedded within the Intellia SG WordPress/LearnPress lesson page as an `<iframe>` or as a web component (`<intellia-lesson>`). This mirrors the equal-tau.vercel.app deployment pattern (Vite + Vercel).

---

## 2. Technology Stack

| Layer | Technology | Version | Rationale |
|-------|-----------|---------|-----------|
| Framework | React | 18.x | Component model, hooks, concurrent mode |
| Language | TypeScript | 5.x | Type safety, IDE support |
| Bundler | Vite | 5.x | Fast HMR, optimised builds (used in equal repo) |
| Styling | Tailwind CSS + CSS Variables | 3.x | Utility classes + design token system |
| Animation | Framer Motion | 11.x | Spring physics, gesture handling |
| State | Zustand | 4.x | Lightweight, boilerplate-free global state |
| Audio | Howler.js | 2.x | Cross-browser audio, sprite sheets |
| Routing | React Router v6 | 6.x | Client-side routing between worlds/modules |
| Icons | Lucide React + inline SVG | Latest | Consistent icon set |
| Charts/Viz | Custom SVG | — | Number lines, arrays built from scratch |
| Persistence | localStorage (browser) | — | No backend required for v1 |
| Testing | Vitest + React Testing Library | Latest | Unit + integration tests |
| E2E | Playwright | Latest | Critical path automation |
| Deployment | Vercel (CDN) | — | Mirrors equal-tau deployment pattern |
| Analytics | Google Analytics 4 | — | Custom events for learning metrics |

---

## 3. Repository Structure

Following the `dsamyak/equal` repo pattern exactly:

```
multiplication-tables/
├── api/                        # (Future: serverless functions for analytics)
│   └── track-event.ts
├── public/
│   ├── audio/
│   │   ├── narration/
│   │   │   ├── intro.mp3
│   │   │   ├── table6-intro.mp3
│   │   │   ├── table7-intro.mp3
│   │   │   ├── table8-intro.mp3
│   │   │   ├── table9-intro.mp3
│   │   │   ├── correct.mp3
│   │   │   ├── wrong.mp3
│   │   │   └── levelup.mp3
│   │   └── music/
│   │       ├── coral-reef-ambient.mp3
│   │       ├── jungle-ambient.mp3
│   │       ├── space-ambient.mp3
│   │       └── temple-ambient.mp3
│   ├── images/
│   │   └── og-image.png
│   └── favicon.ico
├── scripts/                    # Build utilities (mirrors equal pattern)
│   ├── generate-questions.ts
│   └── validate-audio.ts
├── src/
│   ├── components/
│   │   ├── ui/                 # Reusable atoms
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── ProgressBar.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── CrystalCounter.tsx
│   │   │   ├── AudioControls.tsx
│   │   │   └── Modal.tsx
│   │   ├── characters/         # Character SVG + speech bubble components
│   │   │   ├── John.tsx
│   │   │   ├── Sarah.tsx
│   │   │   ├── Miguel.tsx
│   │   │   ├── Aiko.tsx
│   │   │   ├── Priya.tsx
│   │   │   └── CharacterSpeech.tsx
│   │   ├── simulations/        # Core interactive learning simulations
│   │   │   ├── SkipCountLine.tsx
│   │   │   ├── ArrayBuilder.tsx
│   │   │   ├── PatternCard.tsx
│   │   │   └── TableSong.tsx
│   │   ├── practice/           # Practice mode components
│   │   │   ├── CrystalCatch.tsx
│   │   │   ├── StarRace.tsx
│   │   │   └── BossBattle.tsx
│   │   ├── worlds/             # Per-world scene wrappers
│   │   │   ├── CoralReefWorld.tsx
│   │   │   ├── JungleWorld.tsx
│   │   │   ├── SpaceWorld.tsx
│   │   │   └── TempleWorld.tsx
│   │   ├── layout/
│   │   │   ├── TopNav.tsx
│   │   │   ├── WorldMap.tsx
│   │   │   └── CrystalDashboard.tsx
│   │   └── intro/
│   │       └── StoryIntro.tsx
│   ├── hooks/
│   │   ├── useAudio.ts
│   │   ├── useGameState.ts
│   │   ├── useRandomQuestions.ts
│   │   ├── useTimer.ts
│   │   └── useProgress.ts
│   ├── store/
│   │   ├── gameStore.ts        # Zustand main store
│   │   ├── audioStore.ts       # Audio settings store
│   │   └── progressStore.ts    # Persistence-backed progress store
│   ├── data/
│   │   ├── tables.ts           # All multiplication facts 6–9
│   │   ├── wordProblems.ts     # Priya's word problem templates
│   │   ├── badges.ts           # Badge definitions
│   │   └── worlds.ts           # World config (name, character, colour theme)
│   ├── utils/
│   │   ├── shuffle.ts          # Fisher-Yates shuffle
│   │   ├── generateQuestions.ts
│   │   └── analytics.ts
│   ├── types/
│   │   └── index.ts            # Shared TypeScript types
│   ├── styles/
│   │   ├── globals.css         # CSS custom properties (design tokens)
│   │   └── animations.css      # Keyframe definitions
│   ├── App.tsx
│   ├── main.tsx
│   └── vite-env.d.ts
├── .gitignore
├── index.html
├── package.json
├── tailwind.config.ts
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## 4. Component Architecture

### 4.1 App Router Structure

```tsx
// App.tsx
<Router>
  <AudioProvider>
    <GameProvider>
      <Routes>
        <Route path="/" element={<StoryIntro />} />
        <Route path="/worlds" element={<WorldMap />} />
        <Route path="/world/:tableId/learn" element={<LearnModule />} />
        <Route path="/world/:tableId/practice/tier1" element={<CrystalCatch />} />
        <Route path="/world/:tableId/practice/tier2" element={<StarRace />} />
        <Route path="/boss" element={<BossBattle />} />
        <Route path="/dashboard" element={<CrystalDashboard />} />
      </Routes>
    </GameProvider>
  </AudioProvider>
</Router>
```

### 4.2 Component Contracts

#### `<SkipCountLine />` — Skip Count Number Line Simulation

```tsx
interface SkipCountLineProps {
  multiplier: number;      // 6 | 7 | 8 | 9
  maxFacts: number;        // 10
  character: CharacterName;
  onComplete: () => void;
}
```

**Behaviour:**
- Renders SVG number line from 0 to `multiplier * maxFacts`
- Tick marks at every integer; landmark marks at every multiple
- Character sprite animates along the line
- Click/tap on next multiple = hop animation
- Hop count and running total displayed
- onComplete fires when all 10 hops are done

#### `<ArrayBuilder />` — Array Drag-and-Drop Simulation

```tsx
interface ArrayBuilderProps {
  rows: number;            // The multiplier (e.g., 6)
  cols: number;            // Randomised 1–10 each session
  character: CharacterName;
  onComplete: (product: number) => void;
}
```

**Behaviour:**
- Renders empty grid of `rows × cols`
- Drag-source: row of `cols` dots
- Drop target: each row slot
- On drop, row fills with sparkle animation
- Product revealed with animated counter when full
- Commutativity callout auto-shown

#### `<CrystalCatch />` — Tier 1 Practice

```tsx
interface CrystalCatchProps {
  tableId: 6 | 7 | 8 | 9;
  questions: Question[];   // Pre-generated randomised set of 10
  onComplete: (score: CrystalCatchScore) => void;
}

interface Question {
  id: string;
  multiplicand: number;
  multiplier: number;
  answer: number;
  type: 'product' | 'missing-factor';
}
```

#### `<StarRace />` — Tier 2 Timed Practice

```tsx
interface StarRaceProps {
  questions: Question[];   // 15 randomised from all unlocked tables
  timeLimit: number;       // 60 (seconds)
  character: CharacterName;
  onComplete: (result: StarRaceResult) => void;
}
```

**Behaviour:**
- Countdown timer displayed prominently
- Character runs on track; speed proportional to correct answer rate
- Wrong answer: brief character stumble, next question
- Timer expiry: "Time's Up!" modal with results

#### `<BossBattle />` — Tier 3 Final Challenge

```tsx
interface BossBattleProps {
  questions: Question[];    // 20 mixed, all tables, includes word problems
  bossHP: number;           // 20
  onVictory: () => void;
  onDefeat: () => void;
}
```

**Behaviour:**
- Boss (giant "Chaos Crystal") HP bar visible
- Each correct answer = 1 HP removed from boss with visual damage effect
- Wrong answer = brief shield flash on boss (no HP lost), regenerative hint shown
- Victory triggers "Grand Crystal" collection cinematic

---

## 5. State Management

### 5.1 Game Store (Zustand)

```typescript
// store/gameStore.ts
interface GameState {
  // Progress
  unlockedWorlds: TableId[];          // Starts as [6]
  completedLearnModules: TableId[];
  completedTier1: TableId[];
  completedTier2: TableId[];
  bossBattleComplete: boolean;

  // Crystals & Score
  crystals: number;
  grandCrystals: number;
  badges: BadgeId[];
  sessionScore: number;
  personalBest: Record<string, number>;  // keyed by "tier2" | "boss"

  // Current Session
  currentWorld: TableId | null;
  currentModule: ModuleId | null;
  sessionQuestions: Question[];

  // Actions
  unlockWorld: (id: TableId) => void;
  addCrystals: (n: number) => void;
  awardBadge: (id: BadgeId) => void;
  setSessionQuestions: (qs: Question[]) => void;
  completeModule: (world: TableId, module: ModuleId) => void;
}
```

### 5.2 Progress Store (Persisted to localStorage)

```typescript
// store/progressStore.ts — persisted with zustand/middleware persist
interface ProgressState {
  crystals: number;
  badges: BadgeId[];
  completedWorlds: TableId[];
  tier1Scores: Record<TableId, number[]>;
  tier2PersonalBest: number;
  bossDefeated: boolean;
  lastVisit: string;          // ISO date string
  streakDays: number;
}
```

---

## 6. Randomisation Engine

### 6.1 Question Generation

```typescript
// utils/generateQuestions.ts
import { shuffle } from './shuffle';

type QuestionType = 'product' | 'missing-factor' | 'reverse' | 'word-problem';

function generateTableQuestions(
  tableId: TableId,
  count: number,
  types: QuestionType[] = ['product']
): Question[] {
  const pool: Question[] = [];

  for (let n = 1; n <= 10; n++) {
    const product = tableId * n;

    if (types.includes('product')) {
      pool.push({ id: `${tableId}x${n}`, multiplicand: tableId, multiplier: n, answer: product, type: 'product' });
    }
    if (types.includes('missing-factor')) {
      pool.push({ id: `${tableId}x${n}-mf`, multiplicand: tableId, multiplier: null, answer: product, type: 'missing-factor' });
    }
    if (types.includes('reverse')) {
      pool.push({ id: `${tableId}x${n}-rev`, multiplicand: null, multiplier: n, answer: product, type: 'reverse' });
    }
  }

  return shuffle(pool).slice(0, count);
}

function generateMixedQuestions(
  tables: TableId[],
  count: number,
  types: QuestionType[]
): Question[] {
  const allQuestions: Question[] = [];
  tables.forEach(t => allQuestions.push(...generateTableQuestions(t, 10, types)));
  return shuffle(allQuestions).slice(0, count);
}
```

### 6.2 Fisher-Yates Shuffle

```typescript
// utils/shuffle.ts
export function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
```

**Key guarantee:** Every call to `generateTableQuestions` or `generateMixedQuestions` uses `Math.random()` at the time of call — questions are different each session and there are no repeats within a session.

### 6.3 Word Problem Randomiser

```typescript
// data/wordProblems.ts
interface WordProblemTemplate {
  id: string;
  template: string;       // Uses {char}, {a}, {b}, {product} placeholders
  character: CharacterName;
}

const TEMPLATES: WordProblemTemplate[] = [
  { id: 'wp1', template: '{char} packed {a} boxes. Each box holds {b} crayons. How many crayons in all?', character: 'Aiko' },
  { id: 'wp2', template: "{char}'s rocket has {a} fuel tanks. Each holds {b} litres. How many litres total?", character: 'John' },
  // ... 20 total templates
];

function generateWordProblem(table: TableId): Question {
  const n = Math.ceil(Math.random() * 10);
  const template = TEMPLATES[Math.floor(Math.random() * TEMPLATES.length)];
  return {
    ...template,
    multiplicand: table,
    multiplier: n,
    answer: table * n,
    type: 'word-problem',
    text: template.template
      .replace('{char}', CHARACTERS[template.character].name)
      .replace('{a}', String(table))
      .replace('{b}', String(n))
      .replace('{product}', String(table * n)),
  };
}
```

---

## 7. Simulation Components — Technical Spec

### 7.1 Skip-Count Number Line — SVG Spec

```
Viewport: 100% width, 200px height
Number line: horizontal, centred vertically at y=120
Start: 0 (left padding 40px)
End: multiplier × 10 (right padding 40px)
Scale: dynamic (width - 80px) / (multiplier * 10) px per unit

Tick marks:
  - Minor (every 1): 8px height, 1px stroke, opacity 0.3
  - Major (every multiplier): 20px height, 2px stroke, colour = world accent

Labels: shown at every multiple (0, n, 2n, …, 10n)
  - Font: 14px Nunito Bold
  - Positioned at y=148

Character sprite:
  - SVG group, translate(x, 100) where x tracks current multiple
  - Transition: spring(stiffness=300, damping=20) via Framer Motion

Hop interaction:
  - Clickable invisible rect over the next multiple marker
  - On click: animate character to new position
  - "Bounce" keyframe: y oscillates ±20px during transit
  - Running total: large text at top-right of SVG, updates after each hop
```

### 7.2 Array Builder — Grid Spec

```
Grid: CSS Grid, `repeat(cols, 1fr)` columns, `repeat(rows, 1fr)` rows
Cell size: min(40px, (viewport_width - 80px) / cols)
Cell shape: circle (border-radius 50%)
Empty cell: border 2px dashed, opacity 0.3, world accent colour
Filled cell: solid fill, world accent colour, scale(1) → scale(1.15) → scale(1) on fill

Drag interaction:
  - Row source: horizontal strip of `cols` dots, draggable
  - Drop zone: each row slot accepts a row
  - HTML5 Drag API with touch fallback via Pointer Events
  - On valid drop: cells fill left-to-right with staggered delay (50ms per cell)

Product reveal:
  - After final row placed: product counter animates from 0 to answer
  - Duration: 800ms, ease-out-expo easing
  - Commutativity note fades in 500ms after counter finishes
```

### 7.3 Pattern Card — Visual Spec

```
Card: glassmorphism (backdrop-filter: blur(10px), rgba(255,255,255,0.08))
Size: 320px × 480px
Content per card:
  - Table title (large, bold)
  - Grid: 10 rows × 3 columns (fact | = | product)
  - Each product highlighted with alternating row tint
  - Pattern callout: coloured banner at bottom

For ×9 finger trick:
  - Animated SVG hand (10 fingers)
  - On hover/tap: selected finger folds, left-count and right-count labels appear
  - Narrated by Aiko

For ×8 double-double-double:
  - Split animation showing ×4 table and ×8 = ×4 × 2 side by side
  - Arrow connecting each pair of facts
```

---

## 8. Audio System

### 8.1 Architecture (Howler.js)

```typescript
// hooks/useAudio.ts
import { Howl } from 'howler';

const SOUNDS = {
  correct: new Howl({ src: ['/audio/narration/correct.mp3'], volume: 0.8 }),
  wrong: new Howl({ src: ['/audio/narration/wrong.mp3'], volume: 0.6 }),
  levelup: new Howl({ src: ['/audio/narration/levelup.mp3'], volume: 0.9 }),
  coralAmbient: new Howl({ src: ['/audio/music/coral-reef-ambient.mp3'], loop: true, volume: 0.3 }),
  jungleAmbient: new Howl({ src: ['/audio/music/jungle-ambient.mp3'], loop: true, volume: 0.3 }),
  spaceAmbient: new Howl({ src: ['/audio/music/space-ambient.mp3'], loop: true, volume: 0.25 }),
  templeAmbient: new Howl({ src: ['/audio/music/temple-ambient.mp3'], loop: true, volume: 0.28 }),
};

export function useAudio() {
  const { musicEnabled, sfxEnabled, narrationEnabled } = useAudioStore();

  const playCorrect = () => sfxEnabled && SOUNDS.correct.play();
  const playWrong = () => sfxEnabled && SOUNDS.wrong.play();
  const playLevelUp = () => sfxEnabled && SOUNDS.levelup.play();
  const playNarration = (key: NarrationKey) => narrationEnabled && NARRATION[key]?.play();
  const playWorldMusic = (world: WorldId) => musicEnabled && WORLD_MUSIC[world]?.play();

  return { playCorrect, playWrong, playLevelUp, playNarration, playWorldMusic };
}
```

### 8.2 Audio Spec Requirements

All audio files must:
- Be MP3 format, 128kbps minimum, 44.1kHz
- Have 0.2s fade-in and 0.5s fade-out on background music
- Narration files: no background music; clear, warm voice; child-appropriate pacing (~130 WPM)
- SFX: < 2 seconds each
- Ambient loops: seamless loop point (no click at loop boundary)
- Total audio bundle: ≤ 15MB (lazy-loaded per world)

### 8.3 Autoplay Policy Compliance

- First audio play gated behind any user interaction (click on "Start" button)
- Howler.js handles AudioContext unlock automatically on first interaction
- muted=true default; user must explicitly opt into audio (or it autoplays after interaction)

---

## 9. Gamification Engine

### 9.1 Crystal Award Logic

```typescript
// utils/gamification.ts
function awardCrystals(event: GameEvent, state: GameState): number {
  const rewards: Record<GameEvent, number> = {
    'complete-skip-count': 1,
    'complete-array-builder': 1,
    'tier1-correct-first-try': 1,
    'tier1-correct-second-try': 0,
    'tier2-complete': 5,
    'boss-correct': 1,
    'boss-victory': 10,
  };
  return rewards[event] ?? 0;
}
```

### 9.2 Badge Evaluation

```typescript
function evaluateBadges(state: GameState): BadgeId[] {
  const earned: BadgeId[] = [...state.badges];

  if (state.completedWorlds.includes(6) && !earned.includes('coral-explorer'))
    earned.push('coral-explorer');
  if (state.completedWorlds.includes(7) && !earned.includes('jungle-champion'))
    earned.push('jungle-champion');
  if (state.completedWorlds.includes(8) && !earned.includes('space-ace'))
    earned.push('space-ace');
  if (state.completedWorlds.includes(9) && !earned.includes('temple-guardian'))
    earned.push('temple-guardian');
  if (state.bossBattleComplete && !earned.includes('crystal-master'))
    earned.push('crystal-master');
  if (state.tier2PersonalBest <= 30 && !earned.includes('speed-demon'))
    earned.push('speed-demon');

  return earned;
}
```

### 9.3 Progress Unlock Rules

```
World 6 (Coral Reef): always unlocked
World 7 (Jungle): unlock after World 6 Tier 1 complete
World 8 (Space): unlock after World 7 Tier 1 complete
World 9 (Temple): unlock after World 8 Tier 1 complete
Boss Battle: unlock after ALL four Tier 2 completions
Dashboard: always accessible (shows locked crystals as silhouettes)
```

---

## 10. Animation System

### 10.1 Framer Motion Variants (global reuse)

```typescript
// styles/variants.ts
export const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 20 } },
};

export const scaleIn = {
  hidden: { scale: 0, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 400, damping: 17 } },
};

export const crystalFloat = {
  collect: {
    y: [0, -80],
    opacity: [1, 0],
    scale: [1, 0.5],
    transition: { duration: 0.8, ease: 'easeOut' },
  },
};

export const characterHop = {
  idle: { y: 0 },
  hop: { y: [0, -25, 0], transition: { duration: 0.4, ease: 'easeOut' } },
};
```

### 10.2 World Transition Animation

Page transitions between worlds use Framer Motion `AnimatePresence` with a slide + fade. Each world has a distinct background gradient keyframe that crossfades during navigation.

### 10.3 Particle System (Crystal Collect)

When a crystal is earned, a lightweight CSS particle burst runs:
- 8 particles emitted from crystal centre
- Random angle (0–360°), distance 40–80px
- Colours: world accent palette
- Duration: 600ms
- Pure CSS (`@keyframes`), no JS particle library

---

## 11. Data Persistence

### 11.1 localStorage Schema

```json
{
  "intellia-lesson-3-1": {
    "version": "1.0",
    "progress": {
      "unlockedWorlds": [6],
      "completedLearnModules": [],
      "completedTier1": [],
      "completedTier2": [],
      "bossBattleComplete": false
    },
    "score": {
      "crystals": 0,
      "grandCrystals": 0,
      "badges": [],
      "tier2PersonalBest": null,
      "bossHighScore": null
    },
    "streak": {
      "lastVisit": "2026-06-12",
      "days": 1
    }
  }
}
```

### 11.2 Persistence Middleware (Zustand)

```typescript
import { persist } from 'zustand/middleware';

const useProgressStore = create(
  persist<ProgressState>(
    (set, get) => ({ /* ... */ }),
    {
      name: 'intellia-lesson-3-1',
      version: 1,
      migrate: (persisted, version) => { /* handle version migrations */ },
    }
  )
);
```

---

## 12. API Contracts

For v1, there are no external API calls. All logic is client-side. The `api/` directory is scaffolded for v2 analytics:

```typescript
// api/track-event.ts (Vercel Edge Function, v2)
export interface LessonEvent {
  sessionId: string;
  userId?: string;
  event: string;
  payload: Record<string, unknown>;
  timestamp: string;
}

// POST /api/track-event
// Body: LessonEvent
// Response: { ok: true }
```

GA4 custom events fired client-side (v1):

| Event Name | Parameters |
|-----------|-----------|
| `lesson_start` | `{ world: 'all', lesson_id: '3.1' }` |
| `world_complete` | `{ world: tableId, time_seconds: n }` |
| `tier1_complete` | `{ world: tableId, score: n, total: 10 }` |
| `tier2_complete` | `{ score: n, time_seconds: n }` |
| `boss_defeat` | `{ score: n, attempts: n }` |
| `badge_earned` | `{ badge_id: string }` |
| `audio_toggle` | `{ type: 'music'|'sfx'|'narration', enabled: boolean }` |

---

## 13. Performance Requirements

| Metric | Target | Measurement Tool |
|--------|--------|-----------------|
| First Contentful Paint | ≤ 1.5s (4G) | Lighthouse |
| Largest Contentful Paint | ≤ 2.5s (4G) | Lighthouse |
| Time to Interactive | ≤ 3.5s | Lighthouse |
| Total Bundle Size (initial) | ≤ 250kB gzipped | Vite build analysis |
| Audio per world (lazy) | ≤ 4MB per world | Audio file audit |
| Animation frame rate | ≥ 60fps on iPad Air (2020+) | Chrome DevTools |
| Lighthouse Performance Score | ≥ 85 | Lighthouse CI |

### Optimisation Strategies

- **Code splitting:** Each world is a lazy-loaded chunk (`React.lazy + Suspense`)
- **Audio lazy loading:** World audio loads only when that world is entered
- **SVG inlining:** Character SVGs inlined in React components (no HTTP requests)
- **Image optimisation:** All images WebP format with PNG fallback
- **Font loading:** `font-display: swap`; Nunito subset to Latin + digits
- **CSS:** Tailwind purge in production; no unused utilities shipped

---

## 14. Accessibility Implementation

### 14.1 Keyboard Navigation

All interactive elements are reachable via Tab/Shift+Tab. Custom keyboard interactions:
- Array Builder: drag/drop operable via Enter to "pick up" and arrow keys to navigate, Enter to place
- Skip Count Line: Left/Right arrows to move to previous/next multiple; Space to hop
- Practice answers: Number input focusable; Enter submits

### 14.2 ARIA Labelling

```tsx
// Example: Crystal counter
<div
  role="status"
  aria-live="polite"
  aria-label={`${crystals} crystals collected out of 40`}
>
  💎 {crystals}
</div>

// Skip count number line
<svg
  role="application"
  aria-label="Skip counting number line. Use left and right arrow keys to move."
>
  {/* ... */}
</svg>
```

### 14.3 Colour Contrast

All text/background combinations verified at ≥ 4.5:1 WCAG AA:
- White text on indigo-900 (`#0f172a`): 15.8:1 ✅
- Gold `#ffd43b` on indigo-900: 7.2:1 ✅
- Mint `#51cf66` on dark-card: 4.8:1 ✅

### 14.4 Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  .animated, .hop-animation, .particle-burst {
    animation: none !important;
    transition: none !important;
  }
}
```

Framer Motion's `useReducedMotion()` hook disables spring animations when OS setting active.

---

## 15. Build & Deployment

### 15.1 Vite Config

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2020',
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom', 'react-router-dom'],
          'motion': ['framer-motion'],
          'audio': ['howler'],
          'state': ['zustand'],
          'world-6': ['./src/components/worlds/CoralReefWorld'],
          'world-7': ['./src/components/worlds/JungleWorld'],
          'world-8': ['./src/components/worlds/SpaceWorld'],
          'world-9': ['./src/components/worlds/TempleWorld'],
        }
      }
    }
  },
  base: '/courses/grade-3-math/lessons/multiplication-tables-6-7-8-9/',
});
```

### 15.2 Vercel Config (vercel.json)

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }],
  "headers": [
    {
      "source": "/audio/(.*)",
      "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }]
    },
    {
      "source": "/assets/(.*)",
      "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }]
    }
  ]
}
```

### 15.3 Environment Variables

```bash
VITE_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_APP_VERSION=1.0.0
VITE_LESSON_ID=grade3-lesson-3-1
```

---

## 16. Testing Strategy

### 16.1 Unit Tests (Vitest)

```
src/utils/shuffle.test.ts          — Fisher-Yates correctness, no repeats
src/utils/generateQuestions.test.ts — Question pool coverage, randomness
src/utils/gamification.test.ts     — Crystal/badge award logic
src/store/gameStore.test.ts        — State transitions
src/store/progressStore.test.ts    — localStorage persistence
```

### 16.2 Component Tests (React Testing Library)

```
CrystalCatch.test.tsx     — renders, correct/incorrect flows, score update
StarRace.test.tsx         — timer countdown, question cycling, completion
BossBattle.test.tsx       — HP reduction, victory/defeat conditions
SkipCountLine.test.tsx    — hop interactions, completion callback
ArrayBuilder.test.tsx     — drag-drop simulation, product reveal
```

### 16.3 E2E Tests (Playwright)

```
e2e/full-lesson-flow.spec.ts     — Start → World 6 Learn → Tier 1 → Tier 2 → Boss → Dashboard
e2e/audio-controls.spec.ts       — Toggle music/SFX/narration
e2e/progress-persistence.spec.ts — Reload page, progress retained from localStorage
e2e/keyboard-nav.spec.ts         — Full keyboard navigation audit
```

### 16.4 Lighthouse CI

Run on every PR against `main`:
- Performance ≥ 85
- Accessibility ≥ 95
- Best Practices ≥ 90

---

## 17. Design Token Reference

These CSS custom properties map directly to the dsamyak/equal repo design system:

```css
/* styles/globals.css */
:root {
  /* Backgrounds */
  --bg-base:         #0f172a;   /* slate-900 */
  --bg-card:         rgba(255, 255, 255, 0.06);
  --bg-card-hover:   rgba(255, 255, 255, 0.10);

  /* World Accent Colours */
  --world-coral:     #06b6d4;   /* cyan-500 — Coral Reef */
  --world-jungle:    #22c55e;   /* green-500 — Jungle */
  --world-space:     #8b5cf6;   /* violet-500 — Space */
  --world-temple:    #f59e0b;   /* amber-500 — Temple */

  /* Semantic UI */
  --color-correct:   #51cf66;   /* mint green */
  --color-wrong:     #ff6b6b;   /* coral red */
  --color-crystal:   #74c0fc;   /* sky blue */
  --color-gold:      #ffd43b;   /* gold */
  --color-text:      #f1f5f9;   /* slate-100 */
  --color-text-muted:#94a3b8;   /* slate-400 */

  /* Typography */
  --font-display:    'Fredoka One', 'Nunito', sans-serif;
  --font-body:       'Nunito', 'Inter', sans-serif;
  --font-mono:       'JetBrains Mono', monospace;

  /* Spacing */
  --radius-card:     16px;
  --radius-btn:      9999px;    /* fully rounded buttons */

  /* Shadows */
  --shadow-glow-cyan:    0 0 20px rgba(6, 182, 212, 0.3);
  --shadow-glow-violet:  0 0 20px rgba(139, 92, 246, 0.3);
  --shadow-glow-gold:    0 0 20px rgba(255, 212, 59, 0.4);

  /* Glass card */
  --glass-bg:        rgba(255, 255, 255, 0.06);
  --glass-border:    rgba(255, 255, 255, 0.12);
  --glass-blur:      blur(12px);
}
```

### 17.1 Tailwind Config Extension

```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      fontFamily: {
        display: ['Fredoka One', 'Nunito', 'sans-serif'],
        body: ['Nunito', 'Inter', 'sans-serif'],
      },
      colors: {
        'world-coral':  '#06b6d4',
        'world-jungle': '#22c55e',
        'world-space':  '#8b5cf6',
        'world-temple': '#f59e0b',
        correct:        '#51cf66',
        wrong:          '#ff6b6b',
        crystal:        '#74c0fc',
      },
      boxShadow: {
        'glow-cyan':   '0 0 20px rgba(6, 182, 212, 0.3)',
        'glow-violet': '0 0 20px rgba(139, 92, 246, 0.3)',
        'glow-gold':   '0 0 20px rgba(255, 212, 59, 0.4)',
      },
      backdropBlur: {
        glass: '12px',
      },
    },
  },
};
```

---

## Appendix A: Question Pool (Complete)

### Table ×6
6×1=6, 6×2=12, 6×3=18, 6×4=24, 6×5=30,
6×6=36, 6×7=42, 6×8=48, 6×9=54, 6×10=60

### Table ×7
7×1=7, 7×2=14, 7×3=21, 7×4=28, 7×5=35,
7×6=42, 7×7=49, 7×8=56, 7×9=63, 7×10=70

### Table ×8
8×1=8, 8×2=16, 8×3=24, 8×4=32, 8×5=40,
8×6=48, 8×7=56, 8×8=64, 8×9=72, 8×10=80

### Table ×9
9×1=9, 9×2=18, 9×3=27, 9×4=36, 9×5=45,
9×6=54, 9×7=63, 9×8=72, 9×9=81, 9×10=90

**Total facts:** 40

---

## Appendix B: Curriculum Alignment Matrix

| Objective | Singapore MOE P3 | CCSS Grade 3 | UK KS2 | ACARA Year 3 | NCERT Class 3 | IB PYP |
|-----------|-----------------|--------------|---------|-------------|--------------|--------|
| Recall ×6–×9 | ✅ Ch. 3 | ✅ 3.OA.C.7 | ✅ Y3 | ✅ ACMNA056 | ✅ Ch. 4 | ✅ Trans-disciplinary |
| Commutativity | ✅ | ✅ 3.OA.B.5 | ✅ | ✅ | ✅ | ✅ |
| Missing factor | ✅ | ✅ 3.OA.A.4 | ✅ | ✅ | ✅ | ✅ |
| Patterns in tables | ✅ | ✅ 3.OA.D.9 | ✅ | ✅ | ✅ | ✅ |
| Word problems | ✅ | ✅ 3.OA.A.3 | ✅ | ✅ | ✅ | ✅ |

---

*Document Version 1.0 — Intellia SG Engineering Team, June 2026*
*Companion document: PRD_Multiplication_Tables_Grade3.md*
