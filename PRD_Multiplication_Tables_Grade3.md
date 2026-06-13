# Product Requirements Document (PRD)
## Grade 3 Math — Multiplication Tables: 6, 7, 8, 9
### Gamified Simulation-Based Learning Website
**Platform:** intelliasg.com/courses/grade-3-math — Lesson 3.1
**Version:** 1.0
**Date:** June 2026
**Prepared by:** Intellia SG Product Team

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Product Vision & Goals](#2-product-vision--goals)
3. [Target Users](#3-target-users)
4. [Learning Objectives](#4-learning-objectives)
5. [Story & Narrative Framework](#5-story--narrative-framework)
6. [Product Features & Modules](#6-product-features--modules)
7. [Gamification System](#7-gamification-system)
8. [Audio & Accessibility](#8-audio--accessibility)
9. [UI/UX Design Principles](#9-uiux-design-principles)
10. [User Flow](#10-user-flow)
11. [Content Specification](#11-content-specification)
12. [Success Metrics](#12-success-metrics)
13. [Out of Scope](#13-out-of-scope)

---

## 1. Executive Summary

This PRD defines the requirements for a fully gamified, simulation-based interactive web lesson covering **Multiplication Tables 6, 7, 8, and 9** for Grade 3 students globally. The lesson is part of Intellia SG's Grade 3 Math course (Lesson 3.1) hosted at intelliasg.com.

The experience is structured as a narrative adventure led by a cast of globally diverse characters — John, Sarah, Miguel, Aiko, and Priya — who guide learners through simulation-based discovery, followed by tiered practice and challenge games. The entire UI and interaction model is modelled after the pedagogical approach demonstrated at [equal-tau.vercel.app](https://equal-tau.vercel.app), with a visual identity that strictly resonates with the Intellia SG brand and the dsamyak/equal GitHub repository structure.

---

## 2. Product Vision & Goals

**Vision:** Every child in the world, regardless of background or language, can master multiplication tables 6–9 through joyful, story-driven simulation — not rote memorisation.

**Goals:**

- Make multiplication facts feel like discovery, not drill.
- Use simulation (visual grouping, arrays, skip counting on number lines) as the primary teaching modality before any abstract symbol appears.
- Provide infinite randomised practice so no two sessions feel the same.
- Embed audio narration in a warm, encouraging storytelling voice consistent with the brand's audio style.
- Align with global Grade 3 curricula (Singapore MOE, US Common Core CCSS 3.OA, UK KS2, Australian ACARA, Indian NCERT, IB PYP).

---

## 3. Target Users

### Primary User: Student
- **Age:** 8–9 years old (Grade 3)
- **Geography:** Global — Singapore, USA, UK, India, Australia, Europe, Middle East, Southeast Asia
- **Device:** Desktop, tablet (iPad), Chromebook
- **Prior Knowledge:** Knows multiplication tables 2, 3, 4, 5 (Grade 2 topics); understands multiplication as repeated addition
- **Language:** English (primary); interface should use simple, clear vocabulary

### Secondary User: Teacher / Parent
- Observes progress
- May assign lesson as homework
- Trusts the platform to self-guide the child

---

## 4. Learning Objectives

By the end of this lesson, the student will be able to:

| # | Objective | Bloom's Level | Curriculum Alignment |
|---|-----------|---------------|----------------------|
| LO1 | Recall multiplication facts for 6 × 1 through 6 × 10 | Remember | CCSS 3.OA.C.7, Singapore P3 |
| LO2 | Recall multiplication facts for 7 × 1 through 7 × 10 | Remember | CCSS 3.OA.C.7, UK KS2 |
| LO3 | Recall multiplication facts for 8 × 1 through 8 × 10 | Remember | CCSS 3.OA.C.7, ACARA Year 3 |
| LO4 | Recall multiplication facts for 9 × 1 through 9 × 10 | Remember | CCSS 3.OA.C.7, NCERT Class 3 |
| LO5 | Identify patterns in each table (e.g., 9s finger trick, 6 always ends in even) | Understand | CCSS 3.OA.D.9 |
| LO6 | Apply tables to solve missing-factor problems | Apply | CCSS 3.OA.A.4 |
| LO7 | Construct an array or skip-count sequence to verify a product | Understand | CCSS 3.OA.A.1 |

---

## 5. Story & Narrative Framework

### 5.1 The Story: "The Galaxy Times Mission"

The lesson opens with a cinematic intro (animated SVG / CSS scene):

> *"Somewhere between the stars and the sea, there is a magical place called NUMERIA — a world built entirely from numbers. But something has gone wrong. The Multiplication Crystals that power Numeria have shattered into 40 pieces, one for each fact from 6×1 to 9×10. Only a team of young explorers from Earth can reassemble them."*

The four main characters are introduced:

| Character | Nationality | Personality | Role |
|-----------|-------------|-------------|------|
| **John** | American | Brave, competitive | Team leader |
| **Sarah** | British | Analytical, loves patterns | The "pattern spotter" |
| **Miguel** | Mexican | Funny, energetic | Skip-count champion |
| **Aiko** | Japanese | Quiet, precise | Array builder |
| **Priya** | Indian | Creative, storyteller | Word-problem narrator |

Each multiplication table is unlocked by completing a "world" inside Numeria:
- Table ×6 → **Coral Reef World** (Sarah guides)
- Table ×7 → **Jungle Canopy World** (Miguel guides)
- Table ×8 → **Space Station World** (John guides)
- Table ×9 → **Ancient Temple World** (Aiko & Priya guide)

### 5.2 Audio Narration Style

Narration is warm, clear, child-friendly and paced. Character voices are distinct. Sound design includes:
- Ambient world sounds (reef bubbles, jungle birds, spaceship hum, temple echoes)
- Correct-answer chime (bright, encouraging)
- Wrong-answer sound (gentle, not harsh — a soft "try again" tone)
- Level-up fanfare (celebratory, short)
- Background music (looping, non-distracting, world-themed)

The audio style strictly follows the reference audio asset provided — warm tone, engaging narration, no condescension, global accent-neutral English.

---

## 6. Product Features & Modules

### Module 0: Story Intro (Skippable after first visit)
- Animated opening cinematic: ~45 seconds
- Introduces Numeria world and the 4 characters
- "Skip Intro" button always visible
- Sets stakes: collect all 40 crystals

### Module 1: LEARN — Simulation Phase

Each table (6, 7, 8, 9) has its own Learn section structured identically:

#### 1A. Concept Hook (Per Table)
- Character appears and poses a real-world question:
  - *"Sarah says: 'I found 6 coral caves. Each cave has the same number of starfish. How many starfish in total?'"*
- Animated scene shows the situation visually

#### 1B. Skip-Count Simulation
- Interactive number line from 0 to 100
- Student clicks/taps to "hop" by the multiplier
- Each hop animates with the character jumping
- Running product displays prominently
- Audio narrates: *"6… 12… 18…"*
- Completion earns 1 crystal + short celebratory moment

#### 1C. Array Builder Simulation
- Student drags rows onto a grid to build an array
- e.g., "Build 6 × 4 — place 6 rows of 4 stars"
- Grid cells animate in with sparkle effect
- Product revealed after array is complete
- Pattern callout: *"Notice anything? 6 rows × 4 columns = 24 — same as 4 × 6!"*

#### 1D. Pattern Discovery Card
- Visual "cheat sheet" card revealed after simulation
- Shows the full table (×1 to ×10) with colour-coded patterns
- For ×9: finger trick animation
- For ×6: "always even" highlight
- For ×7: "no shortcut — but we have a story!"
- For ×8: "double-double-double" animation
- Student can flip through these cards any time from the top nav

#### 1E. Table Song (Optional, Toggleable)
- Animated music video style — characters lip-sync to a rhythmic chant of the table
- "6, 12, 18, 24, 30, 36, 42, 48, 54, 60!"
- Toggle button — student can play/pause

### Module 2: PRACTICE — Three Tiers

After each table's Learn phase, Practice is unlocked.

#### Tier 1 — "Crystal Catch" (Guided Practice, Low Pressure)
- 10 questions per table
- Format: Fill-in-the-blank (e.g., "6 × 7 = ___")
- Questions are randomised each session (drawn from the full table pool)
- Visual support: array dot-grid shown faintly in background
- Immediate feedback: correct = crystal floats up to counter; incorrect = gentle hint + array appears
- No timer
- Earn 1 crystal per correct answer (first attempt)

#### Tier 2 — "Star Race" (Timed Challenge)
- 15 random questions (mixing all four tables practised so far)
- 60-second countdown timer
- Racing animation: character runs across a track; correct answers accelerate them
- Questions fully randomised — every single question drawn from the full pool with a shuffle algorithm ensuring no repetition within a session
- Score board: personal best tracked in localStorage

#### Tier 3 — "Boss Battle" (Mixed Mastery Check)
- Unlocked only after completing all four tables' Tier 1 and Tier 2
- 20 questions mixing 6×, 7×, 8×, 9× randomly
- Includes missing factor: "6 × ___ = 42"
- Includes word problems narrated by Priya
- Includes reverse: "___ × 9 = 63"
- Each correct answer chips away at the "Boss Crystal" (animated)
- Defeat the boss = collect the Grand Crystal + full "Crystal Master" badge

### Module 3: REVIEW — Crystal Collection Dashboard
- Visual trophy room showing all 40 crystals collected
- Per-table accuracy percentage displayed
- "Try Again" buttons for weak spots
- Shareable completion card (image download)

---

## 7. Gamification System

### 7.1 Points & Crystals
| Action | Points | Crystal |
|--------|--------|---------|
| Complete skip-count simulation | 50 | +1 |
| Complete array builder | 50 | +1 |
| Correct Tier 1 answer (1st try) | 10 | +1 |
| Correct Tier 1 answer (2nd try) | 5 | — |
| Each Tier 2 correct answer | 15 | — |
| Tier 2 full completion | 100 bonus | +5 |
| Boss Battle correct answer | 20 | +1 |
| Boss defeated | 500 bonus | +10 (Grand) |

### 7.2 Badges
| Badge | Trigger |
|-------|---------|
| 🐠 Coral Explorer | Complete ×6 |
| 🦁 Jungle Champion | Complete ×7 |
| 🚀 Space Ace | Complete ×8 |
| 🏛️ Temple Guardian | Complete ×9 |
| 💎 Crystal Master | Defeat the Boss |
| ⚡ Speed Demon | Finish Tier 2 in under 30 seconds |
| 🎯 Perfect Score | 10/10 on any Tier 1, first attempt |
| 🌍 Global Explorer | Complete all 4 tables |

### 7.3 Progress & Streaks
- Progress bar visible at all times in the top nav
- Daily streak tracker (🔥 fire icon)
- Celebration animation on every milestone

### 7.4 Randomisation Engine
Every practice question set is freshly generated each session:
- Pool: all facts n×1 through n×10 for each table
- Shuffle: Fisher-Yates algorithm
- No question repeats within a single session
- Seeded differently on each page load

---

## 8. Audio & Accessibility

### Audio Design
- All narration pre-recorded in warm, inclusive English
- Per-character voice distinction (subtle, not caricature)
- Mute button always visible (🔇)
- Audio controls: play/pause narration, toggle music separately
- Autoplay only on user first interaction (browser policy compliant)

### Accessibility
- WCAG 2.1 AA compliant
- All interactive elements keyboard-navigable
- Screen-reader labels on all buttons and inputs
- Colour contrast ratios meet 4.5:1 minimum
- Font size minimum 16px for body text
- "Reduce Motion" mode: disables CSS animations, keeps full functionality
- No flashing content exceeding 3 Hz

---

## 9. UI/UX Design Principles

The visual and interaction design strictly mirrors the approach in [equal-tau.vercel.app](https://equal-tau.vercel.app) and the dsamyak/equal repository.

### Design Tokens (from equal repo)
- **Primary Palette:** Deep indigo-navy background (`#1a1a2e` / `#16213e`), vivid accent purples/teals
- **Accent Colours:** Coral (`#ff6b6b`), Mint (`#51cf66`), Gold (`#ffd43b`), Sky blue (`#74c0fc`)
- **Typography:** Rounded sans-serif (Nunito or Fredoka One for headings, Inter for body)
- **Cards:** Soft glassmorphism cards with subtle glow on hover
- **Buttons:** Pill-shaped, bold, vibrant with hover scale transform
- **Animations:** Smooth spring physics (Framer Motion), no jarring cuts
- **Layout:** Full-viewport sections, centred content, generous whitespace
- **Icons:** Emoji + custom SVG icons; no icon font library

### Responsive Design
- Optimised for 1024px+ (desktop primary)
- Tablet support: 768px–1023px (reduced layout density)
- Not optimised for mobile (per platform scope); graceful degradation shown

### Character Illustration Style
- Flat vector art, slightly chibi proportions
- Each character has 3 states: neutral, excited, thinking
- Rendered as SVG inline (scalable, performant)

---

## 10. User Flow

```
Landing / Lesson Start
        │
        ▼
Story Intro (skippable)
        │
        ▼
World Select (4 worlds, sequentially unlocked)
        │
   ┌────┴────┐
   ▼         ▼
Learn     (locked until prior world done)
   │
   ├─ Concept Hook
   ├─ Skip-Count Simulation
   ├─ Array Builder
   └─ Pattern Card Reveal
        │
        ▼
Practice Tier 1 — Crystal Catch (10 Qs, random)
        │
        ▼
Practice Tier 2 — Star Race (15 Qs, timed, random)
        │
        ▼
   (Repeat for all 4 tables)
        │
        ▼
Boss Battle — 20 Mixed Qs (random, includes word problems)
        │
        ▼
Crystal Dashboard — Badges, Score, Share
```

---

## 11. Content Specification

### 11.1 Multiplication Facts Coverage

| Table | Facts Covered | World |
|-------|--------------|-------|
| ×6 | 6×1=6 through 6×10=60 | Coral Reef |
| ×7 | 7×1=7 through 7×10=70 | Jungle Canopy |
| ×8 | 8×1=8 through 8×10=80 | Space Station |
| ×9 | 9×1=9 through 9×10=90 | Ancient Temple |

### 11.2 Word Problem Bank (Priya's Boss Battle Stories)
Sample problems (all facts randomised per session):

- *"Aiko packed 6 boxes. Each box holds 8 crayons. How many crayons in all?"*
- *"John's rocket has 9 fuel tanks. Each tank holds 7 litres. How many litres total?"*
- *"Sarah counted 8 rows of coral, with 6 pieces each. How many coral pieces?"*
- *"Miguel picked 7 bananas from each of 9 trees. How many bananas altogether?"*

Word problems are templated with variable names and numbers, randomised at runtime.

### 11.3 Pattern Discovery Content

| Table | Key Pattern | Simulation Used |
|-------|-------------|----------------|
| ×6 | Product always even; ends in 0, 2, 4, 6, 8 cycling | Colour-coded number line |
| ×7 | No shortcut — memory + story | Character rap song |
| ×8 | Double the ×4 table (double-double-double) | Split-screen doubling animation |
| ×9 | Digits always sum to 9; finger trick | Animated hand graphic |

---

## 12. Success Metrics

| Metric | Target | Measurement Method |
|--------|--------|--------------------|
| Lesson Completion Rate | ≥ 70% of users who start reach Boss Battle | Analytics event tracking |
| Tier 1 Average Score | ≥ 80% correct on first attempt | Session data |
| Tier 2 Personal Best Improvement | ≥ 15% improvement between 1st and 3rd attempt | Stored scores |
| Boss Battle Pass Rate | ≥ 65% pass on first attempt | Event log |
| Return Rate (re-visit within 7 days) | ≥ 40% | Session analytics |
| Audio Engagement | ≥ 60% of sessions with audio on for >30 seconds | Audio play events |
| Average Session Time | 15–25 minutes | Session duration |
| Student Satisfaction (in-lesson emoji poll) | ≥ 4.2/5 average | Embedded rating |

---

## 13. Out of Scope

The following are explicitly NOT part of this lesson (v1.0):

- Multiplication tables 2, 3, 4, 5 (covered in Grade 2)
- Multiplication beyond ×10
- Division facts (covered in Lesson 4.x)
- Teacher dashboard / reporting backend
- Parent notification system
- Multi-language localisation (v2 consideration)
- Mobile-first responsive design (tablet/desktop only)
- AI-adaptive difficulty (v2 consideration)
- Multiplayer / classroom head-to-head mode (v2 consideration)

---

*Document Version 1.0 — Intellia SG, June 2026*
*For technical implementation details, refer to the companion TRD.*
