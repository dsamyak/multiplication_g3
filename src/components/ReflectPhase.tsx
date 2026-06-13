import { useState, useCallback, useEffect, useRef, type CSSProperties } from 'react';
import { narrate, stopNarration, sounds } from '../utils/audio';
import {
  reflectIntroNarration,
  reflectCorrectNarration,
  reflectWrongNarration,
  reflectConfidenceNarration,
  reflectCertificateNarration,
} from '../utils/narration';
import { WORLDS } from '../utils/questionBank';
import { PlayStats } from '../types/play';

const REFLECT_QUESTIONS = [
  {
    q: 'What is 7 × 8?',
    options: [
      { text: '56', correct: true, emoji: '✅' },
      { text: '54', correct: false, emoji: '❌' },
      { text: '63', correct: false, emoji: '❓' },
    ],
  },
  {
    q: 'Which trick helps with the 8 times table?',
    options: [
      { text: 'Double-double-double', correct: true, emoji: '✨' },
      { text: 'Add eight every time', correct: false, emoji: '➕' },
      { text: 'Count by ones', correct: false, emoji: '❓' },
    ],
  },
  {
    q: '9 × 6 = 54. What do 5 + 4 equal?',
    options: [
      { text: '9 — digits sum to nine!', correct: true, emoji: '9️⃣' },
      { text: '10', correct: false, emoji: '❌' },
      { text: '11', correct: false, emoji: '❓' },
    ],
  },
];

const CONFIDENCE_LEVELS = [
  { emoji: '😊', label: "I'm great at tables 6–9!", color: '#4caf50' },
  { emoji: '🙂', label: 'I know most of them!', color: '#ff9800' },
  { emoji: '😐', label: "I'm still practising", color: '#42a5f5' },
];

interface ReflectPhaseProps {
  stats: PlayStats | null;
  onRestart: () => void;
  onGoHome: () => void;
  audioEnabled: boolean;
}

export default function ReflectPhase({ stats, onRestart, onGoHome, audioEnabled }: ReflectPhaseProps) {
  const [step, setStep] = useState(0);
  const [teachIdx, setTeachIdx] = useState(0);
  const [teachAnswered, setTeachAnswered] = useState(false);
  const [teachCorrect, setTeachCorrect] = useState(0);
  const [confidence, setConfidence] = useState<number | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiPieces, setConfettiPieces] = useState<
    Array<{ id: number; x: number; delay: number; color: string; size: number; duration: number }>
  >([]);
  const narrationRef = useRef<{ cancel: () => void } | null>(null);

  const { score = 0, totalAnswered = 0, xp = 0, maxStreak = 0, worldResults = {} } = stats || {};
  const pct = totalAnswered > 0 ? Math.round((score / totalAnswered) * 100) : 0;
  const totalStars = Object.values(worldResults).reduce((a, r) => a + (r.stars || 0), 0);

  useEffect(() => {
    if (step === 0 && audioEnabled) {
      narrationRef.current = narrate(reflectIntroNarration(), true);
    }
    return () => {
      narrationRef.current?.cancel();
    };
  }, [step, audioEnabled]);

  useEffect(() => {
    if (showConfetti) {
      const pieces = Array.from({ length: 40 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 2,
        color: ['#ffc107', '#e91e63', '#4caf50', '#2196f3', '#ff5722', '#9c27b0'][i % 6],
        size: 6 + Math.random() * 10,
        duration: 2 + Math.random() * 3,
      }));
      setConfettiPieces(pieces);
    }
  }, [showConfetti]);

  const handleTeachAnswer = useCallback(
    (option: { correct: boolean }) => {
      if (teachAnswered) return;
      setTeachAnswered(true);
      narrationRef.current?.cancel();
      if (option.correct) {
        setTeachCorrect((c) => c + 1);
        sounds.correct();
        if (audioEnabled) narrationRef.current = narrate(reflectCorrectNarration(), true);
      } else {
        sounds.wrong();
        if (audioEnabled) narrationRef.current = narrate(reflectWrongNarration(), true);
      }
      setTimeout(() => {
        setTeachAnswered(false);
        if (teachIdx + 1 < REFLECT_QUESTIONS.length) {
          setTeachIdx((i) => i + 1);
        } else {
          setStep(1);
        }
      }, 1500);
    },
    [teachAnswered, teachIdx, audioEnabled]
  );

  const handleConfidenceSelect = useCallback(
    (idx: number) => {
      setConfidence(idx);
      sounds.badge();
      setShowConfetti(true);
      narrationRef.current?.cancel();
      if (audioEnabled) narrationRef.current = narrate(reflectCertificateNarration(pct), true);
      setTimeout(() => setStep(2), 1000);
    },
    [audioEnabled, pct]
  );

  useEffect(() => {
    if (step === 1 && audioEnabled) {
      narrationRef.current?.cancel();
      narrationRef.current = narrate(reflectConfidenceNarration(), true);
    }
  }, [step, audioEnabled]);

  useEffect(() => {
    return () => {
      narrationRef.current?.cancel();
      stopNarration();
    };
  }, []);

  if (step === 0) {
    const rq = REFLECT_QUESTIONS[teachIdx];
    return (
      <div className="reflect-phase">
        <div className="reflect-header">
          <h3 className="reflect-label">📓 Reflect</h3>
          <p className="reflect-sublabel">Teach the mascot what you learned!</p>
        </div>
        <div className="reflect-card">
          <div className="reflect-mascot-row">
            <div className="mascot thinking" style={{ width: 70, height: 70, fontSize: '2rem' }}>🤖</div>
            <div className="speech-bubble" style={{ maxWidth: 300, fontSize: '1.05rem', fontWeight: 800 }}>Can you help me? {rq.q}</div>
          </div>
          <div className="reflect-options">
            {rq.options.map((opt, i) => (
              <button
                key={i}
                className={`reflect-option ${teachAnswered ? (opt.correct ? 'correct' : 'wrong') : ''}`}
                onClick={() => handleTeachAnswer(opt)}
                disabled={teachAnswered}
              >
                <span className="reflect-option-emoji">{opt.emoji}</span>
                <span>{opt.text}</span>
              </button>
            ))}
          </div>
          <div className="reflect-progress">
            {REFLECT_QUESTIONS.map((_, i) => (
              <div key={i} className={`reflect-dot ${i === teachIdx ? 'active' : i < teachIdx ? 'done' : ''}`} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (step === 1) {
    return (
      <div className="reflect-phase">
        <div className="reflect-card">
          <h3 className="reflect-card-title">How do you feel about times tables 6–9?</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', fontWeight: 700, marginBottom: 24 }}>Be honest — every answer is great!</p>
          <div className="confidence-grid">
            {CONFIDENCE_LEVELS.map((c, i) => (
              <button
                key={i}
                className={`confidence-btn ${confidence === i ? 'selected' : ''}`}
                onClick={() => handleConfidenceSelect(i)}
                style={{ '--conf-color': c.color } as CSSProperties}
              >
                <span className="confidence-emoji">{c.emoji}</span>
                <span className="confidence-label">{c.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="reflect-phase">
      {showConfetti && (
        <div className="confetti-container">
          {confettiPieces.map((p) => (
            <div
              key={p.id}
              className="confetti-piece"
              style={{
                left: `${p.x}%`,
                animationDelay: `${p.delay}s`,
                backgroundColor: p.color,
                width: p.size,
                height: p.size,
                animationDuration: `${p.duration}s`,
              }}
            />
          ))}
        </div>
      )}
      <div className="certificate-card">
        <div className="cert-badge">🏆</div>
        <h2 className="cert-title">Journey Complete!</h2>
        <p className="cert-subtitle">You finished all 5 phases!</p>
        <div className="score-circle">
          <span className="score-number">{pct}%</span>
          <span className="score-label">{score}/{totalAnswered}</span>
        </div>
        <div style={{ fontSize: '2.2rem', display: 'flex', gap: 8, justifyContent: 'center', margin: '16px 0' }}>
          {[1, 2, 3].map((i) => (
            <span key={i} style={{ opacity: i <= Math.ceil(totalStars / 4) ? 1 : 0.2 }}>⭐</span>
          ))}
        </div>
        <div className="cert-stats">
          <div className="cert-stat">
            <div className="cert-stat-value" style={{ color: 'var(--gold)' }}>{xp}</div>
            <div className="cert-stat-label">XP Earned</div>
          </div>
          <div className="cert-stat">
            <div className="cert-stat-value" style={{ color: 'var(--coral)' }}>🔥 {maxStreak}</div>
            <div className="cert-stat-label">Max Streak</div>
          </div>
          <div className="cert-stat">
            <div className="cert-stat-value" style={{ color: 'var(--green-light)' }}>{teachCorrect}/{REFLECT_QUESTIONS.length}</div>
            <div className="cert-stat-label">Teaching</div>
          </div>
        </div>
        <div className="cert-worlds">
          {WORLDS.map((w) => {
            const wr = worldResults[w.id];
            return (
              <div key={w.id} className="cert-world-item">
                <span>{w.icon}</span>
                <span>{w.name}</span>
                {wr && <span>{wr.score}/{wr.total} ⭐{wr.stars}</span>}
              </div>
            );
          })}
        </div>
        <div className="mascot-container" style={{ marginTop: 16 }}>
          <div className="mascot happy" style={{ width: 88, height: 88, fontSize: '2.2rem' }}>🤖</div>
          <div className="speech-bubble">
            {pct >= 80
              ? 'Incredible! You are a Multiplication Master! 🏆'
              : pct >= 50
                ? 'Great effort! Keep practising! 💪'
                : 'Good start! Try again to improve! 📚'}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center', marginTop: 24 }}>
          <button
            className="btn btn-primary btn-lg"
            onClick={() => {
              narrationRef.current?.cancel();
              stopNarration();
              onRestart();
            }}
          >
            🔄 Play Again
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => {
              narrationRef.current?.cancel();
              stopNarration();
              onGoHome();
            }}
          >
            🏠 Home
          </button>
        </div>
      </div>
    </div>
  );
}
