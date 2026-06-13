import { useEffect, useRef } from 'react';
import { narrate, stopNarration } from '../utils/audio';
import { introNarration } from '../utils/narration';

const JOURNEY_PHASES = [
  { icon: '🔍', label: 'Wonder', desc: 'A multiplication mystery!' },
  { icon: '📖', label: 'Story', desc: 'Meet the table worlds' },
  { icon: '🧪', label: 'Simulate', desc: 'Build multiplication arrays' },
  { icon: '🎮', label: 'Play', desc: 'Gamified challenges' },
  { icon: '📓', label: 'Reflect', desc: 'What did you learn?' },
];

interface IntroScreenProps {
  onStart: () => void;
  audioEnabled: boolean;
}

export default function IntroScreen({ onStart, audioEnabled }: IntroScreenProps) {
  const narrationRef = useRef<{ cancel: () => void } | null>(null);

  useEffect(() => {
    if (audioEnabled) {
      const timer = setTimeout(() => {
        narrationRef.current = narrate(introNarration(), true);
      }, 200);
      return () => {
        clearTimeout(timer);
        narrationRef.current?.cancel();
        stopNarration();
      };
    }
  }, [audioEnabled]);

  const handleStart = () => {
    narrationRef.current?.cancel();
    stopNarration();
    onStart();
  };

  return (
    <div className="intro-screen">
      <div className="intro-badge">✨ · Grade 3 Maths</div>

      <h1 className="intro-title">
        <span style={{ color: 'var(--gold)' }}>Multiplication Tables</span> —{' '}
        <span style={{ color: 'var(--coral)' }}>Times Tables 6–9</span>
      </h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', fontWeight: 800, marginTop: 4, fontFamily: 'var(--font-display)' }}>
        Lesson 3.2 · Mastering harder times tables
      </p>

      <div className="mascot-container">
        <div className="mascot" style={{ width: 90, height: 90, fontSize: '2.4rem' }}>🤖</div>
        <div className="speech-bubble">Let&apos;s master times tables! ✖️</div>
      </div>

      <p className="intro-desc">
        Explore four amazing worlds, spot multiplication patterns, build arrays, and become a champion of the{' '}
        <strong style={{ color: 'var(--gold)', fontSize: '1.2rem', fontWeight: 900 }}>6, 7, 8, and 9</strong> times tables!
      </p>

      <div className="intro-journey-map">
        <h3 className="intro-journey-title">Your Learning Journey</h3>
        <div className="intro-journey-steps">
          {JOURNEY_PHASES.map((p, i) => (
            <div key={i} className="intro-journey-step">
              <div className="intro-journey-icon">{p.icon}</div>
              <div className="intro-journey-info">
                <div className="intro-journey-label">{p.label}</div>
                <div className="intro-journey-desc">{p.desc}</div>
              </div>
              {i < JOURNEY_PHASES.length - 1 && <div className="intro-journey-arrow">→</div>}
            </div>
          ))}
        </div>
      </div>

      <button className="btn btn-primary btn-lg intro-start-btn" onClick={handleStart} id="start-journey-btn">
        🚀 Begin Your Journey!
      </button>

      <div className="feature-cards">
        <div className="feature-card">
          <div className="feature-card-icon" style={{ fontSize: '2.4rem' }}>🎯</div>
          <div className="feature-card-label">40 Challenges</div>
        </div>
        <div className="feature-card">
          <div className="feature-card-icon" style={{ fontSize: '2.4rem' }}>✖️</div>
          <div className="feature-card-label">Tables 6–9</div>
        </div>
        <div className="feature-card">
          <div className="feature-card-icon" style={{ fontSize: '2.4rem' }}>✨</div>
          <div className="feature-card-label">Badges & XP</div>
        </div>
      </div>
    </div>
  );
}
