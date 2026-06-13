import { useState, useEffect, useCallback, useRef } from 'react';
import { narrate, stopNarration, preloadNarration } from '../utils/audio';
import { getStoryNarration } from '../utils/narration';

const STORY_SLIDES = [
  {
    heroEmoji: '🪸',
    heroImage: '/story_coral_reef.png',
    heroBg: 'linear-gradient(135deg, #ff4081, #7c1d6f)',
    title: "Sarah's Coral Reef — The Sixes",
    text: 'Sarah dives into the coral reef and spots fish swimming in perfect rows. She counts 4 rows of 6 colourful fish — that is a multiplication array! Instead of counting one by one, she uses the 6 times table to find the answer instantly.',
    highlight: '"4 rows × 6 fish = 24 fish!"',
    mascotText: "Equal rows = multiplication! 🪸",
  },
  {
    heroEmoji: '🌴',
    heroImage: '/story_jungle.png',
    heroBg: 'linear-gradient(135deg, #4caf50, #1b5e20)',
    title: 'Jungle Canopy — The Sevens',
    text: 'Miguel swings through the jungle, counting bunches of seven bananas on every tree. Seven has no easy shortcut — but story and memory make it stick! "7, 14, 21, 28…" — one vine at a time he masters every seven.',
    highlight: '"7 × 5 = 35 — keep practising!"',
    mascotText: 'Sevens need memory + story! 🌴',
  },
  {
    heroEmoji: '🚀',
    heroImage: '/story_space.png',
    heroBg: 'linear-gradient(135deg, #03a9f4, #0d47a1)',
    title: 'Space Station — The Eights',
    text: 'John floats in space beside glowing fuel pods. Each pod holds 8 litres. The secret to eights? Double-double-double! 2 × 8 = 16, double again = 32, double again = 64. Eights are just repeated doubling!',
    highlight: '"Double → Double → Double = 8s!"',
    mascotText: 'Eights love doubling! 🚀',
  },
  {
    heroEmoji: '🏛️',
    heroImage: '/story_temple.png',
    heroBg: 'linear-gradient(135deg, #ff9800, #e65100)',
    title: 'Ancient Temple — The Nines',
    text: 'Aiko discovers the temple\'s magical secret — every answer in the 9 times table has digits that add up to 9! Try 9 × 6 = 54, and 5 + 4 = 9. Or use the finger trick: hold up 10 fingers, bend the 6th — 5 fingers left, 4 right = 54!',
    highlight: '"Digits always sum to 9!"',
    mascotText: 'Use the 9-finger trick! 🏛️',
  },
  {
    heroEmoji: '✨',
    heroImage: '/story_finale.png',
    heroBg: 'linear-gradient(135deg, #7c5cbf, #2d1b69)',
    title: 'Your Adventure Awaits!',
    text: 'Sarah, Miguel, John, and Aiko have shown you the secrets of the 6, 7, 8, and 9 times tables. Now it is your turn! Build arrays, spot the patterns, race the clock, and defeat the boss to collect all the crystals!',
    highlight: '"Tables 6–9 — here we go!"',
    mascotText: 'Ready for the adventure! ✨',
  },
];

interface StoryPhaseProps {
  onComplete: () => void;
  audioEnabled: boolean;
}

export default function StoryPhase({ onComplete, audioEnabled }: StoryPhaseProps) {
  const [slide, setSlide] = useState(0);
  const [anim, setAnim] = useState(false);
  const [textVis, setTextVis] = useState(false);
  const [hlVis, setHlVis] = useState(false);
  const narrationRef = useRef<{ cancel: () => void } | null>(null);
  const s = STORY_SLIDES[slide];
  const isLast = slide === STORY_SLIDES.length - 1;
  const pct = ((slide + 1) / STORY_SLIDES.length) * 100;

  useEffect(() => {
    if (audioEnabled) {
      preloadNarration(getStoryNarration(slide));
      if (slide + 1 < STORY_SLIDES.length) preloadNarration(getStoryNarration(slide + 1));
    }
  }, [slide, audioEnabled]);

  useEffect(() => {
    setTextVis(false);
    setHlVis(false);
    const t1 = setTimeout(() => setTextVis(true), 100);
    const t2 = setTimeout(() => setHlVis(true), 800);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [slide]);

  useEffect(() => {
    if (textVis && audioEnabled) {
      narrationRef.current?.cancel();
      narrationRef.current = narrate(getStoryNarration(slide), true);
    }
    return () => {
      narrationRef.current?.cancel();
    };
  }, [textVis, slide, audioEnabled]);

  const goNext = useCallback(() => {
    if (anim) return;
    narrationRef.current?.cancel();
    stopNarration();
    setAnim(true);
    setTimeout(() => {
      if (isLast) onComplete();
      else setSlide((i) => i + 1);
      setAnim(false);
    }, 400);
  }, [anim, isLast, onComplete]);

  const goPrev = useCallback(() => {
    if (anim || slide === 0) return;
    narrationRef.current?.cancel();
    stopNarration();
    setAnim(true);
    setTimeout(() => {
      setSlide((i) => i - 1);
      setAnim(false);
    }, 400);
  }, [anim, slide]);

  return (
    <div className="story-phase">
      <div className="story-progress">
        <div className="story-progress-bar">
          <div className="story-progress-fill" style={{ width: `${pct}%` }} />
        </div>
          <span style={{ color: 'var(--text-secondary)', fontSize: '1rem', fontWeight: 800 }}>
            {slide + 1} / {STORY_SLIDES.length}
          </span>
      </div>
      <div className={`story-card ${anim ? 'flipping' : ''}`}>
        <div className="story-image-section" style={{ background: s.heroBg }}>
          <img
            src={s.heroImage}
            alt={s.title}
            className="story-image"
            onError={(e) => {
              // Fallback: hide broken image and show emoji
              const target = e.currentTarget as HTMLImageElement;
              target.style.display = 'none';
              const fallback = target.nextElementSibling as HTMLElement | null;
              if (fallback) fallback.style.display = 'flex';
            }}
          />
          <div
            style={{
              display: 'none',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              fontSize: '6rem',
              position: 'absolute',
              inset: 0,
            }}
          >
            {s.heroEmoji}
          </div>
          <div className="story-image-overlay" />
        </div>
        <div className="story-text-section">
          <h2 className="story-title">{s.title}</h2>
          <p className={`story-text ${textVis ? 'revealed' : ''}`}>{s.text}</p>
          <div className={`story-highlight ${hlVis ? 'visible' : ''}`}>
            <span>✨</span>
            <span className="story-highlight-text">{s.highlight}</span>
            <span>✨</span>
          </div>
          <div className="story-mascot">
            <div className="mascot" style={{ width: 68, height: 68, fontSize: '1.8rem' }}>🤖</div>
            <div className="speech-bubble" style={{ fontSize: '1.05rem', padding: '12px 18px', maxWidth: 220 }}>
              {s.mascotText}
            </div>
          </div>
        </div>
      </div>
      <div className="story-nav">
        <button
          className="btn btn-outline btn-sm"
          onClick={goPrev}
          disabled={slide === 0}
          style={{ opacity: slide === 0 ? 0.3 : 1 }}
        >
          ← Back
        </button>
        <div className="story-dots">
          {STORY_SLIDES.map((_, i) => (
            <div key={i} className={`story-dot ${i === slide ? 'active' : i < slide ? 'completed' : ''}`} />
          ))}
        </div>
        <button className={`btn ${isLast ? 'btn-green' : 'btn-primary'} btn-sm`} onClick={goNext}>
          {isLast ? "🚀 Let's Explore!" : 'Next →'}
        </button>
      </div>
    </div>
  );
}
