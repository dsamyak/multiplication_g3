import { useState, useEffect, useCallback, useRef } from 'react';
import { narrate, stopNarration } from '../utils/audio';
import { wonderNarration, wonderDiscoverNarration } from '../utils/narration';

const WONDER_QUESTIONS = [
  {
    question: 'Sarah sees 4 rows of 6 fish in the coral reef. How many fish altogether?',
    subtext: 'Multiplication helps us count equal rows quickly — that is 4 × 6!',
    emoji: '🪸',
    bgEmojis: ['🪸', '🐠', '✖️', '🔢'],
  },
  {
    question: '7 × 3 is the same as adding 7 three times. What is the answer?',
    subtext: 'Times tables are repeated addition made faster!',
    emoji: '🌴',
    bgEmojis: ['🌴', '➕', '🔢', '💡'],
  },
  {
    question: 'Double 8 is 16. Double again is 32. What is 8 × 4?',
    subtext: 'The eights table uses the double-double trick!',
    emoji: '🚀',
    bgEmojis: ['🚀', '⭐', '🧮', '✨'],
  },
  {
    question: '9 × 6 = 54. The digits 5 + 4 = 9. Do 9 × 7 digits also sum to 9?',
    subtext: 'The nine times table has a special digit pattern!',
    emoji: '🏛️',
    bgEmojis: ['🏛️', '9️⃣', '🎯', '🔢'],
  },
  {
    question: 'Which is faster: counting 8 groups of 7 one by one, or knowing 8 × 7?',
    subtext: 'Knowing your tables saves time and brain power!',
    emoji: '⚡',
    bgEmojis: ['⚡', '✖️', '🎲', '🌟'],
  },
];

interface WonderPhaseProps {
  onComplete: () => void;
  audioEnabled: boolean;
}

export default function WonderPhase({ onComplete, audioEnabled }: WonderPhaseProps) {
  const [wonder] = useState(() => WONDER_QUESTIONS[Math.floor(Math.random() * WONDER_QUESTIONS.length)]);
  const [stage, setStage] = useState(0);
  const [particles, setParticles] = useState<
    Array<{ id: number; emoji: string; x: number; y: number; delay: number; duration: number; size: number }>
  >([]);
  const narrationRef = useRef<{ cancel: () => void } | null>(null);

  useEffect(() => {
    const p = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      emoji: wonder.bgEmojis[i % wonder.bgEmojis.length],
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 8 + Math.random() * 12,
      size: 1.2 + Math.random() * 1.5,
    }));
    setParticles(p);
  }, [wonder]);

  useEffect(() => {
    const t1 = setTimeout(() => setStage(1), 300);
    const t2 = setTimeout(() => setStage(2), 1200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  useEffect(() => {
    if (stage === 1 && audioEnabled) {
      narrationRef.current = narrate(wonderNarration(wonder.question, wonder.subtext), true);
    }
    return () => {
      narrationRef.current?.cancel();
    };
  }, [stage, wonder.question, wonder.subtext, audioEnabled]);

  const handleDiscover = useCallback(() => {
    narrationRef.current?.cancel();
    stopNarration();
    if (audioEnabled) {
      const n = narrate(wonderDiscoverNarration(), true);
      n.promise.then(() => onComplete());
      setTimeout(() => onComplete(), 3000);
    } else {
      setTimeout(() => onComplete(), 600);
    }
  }, [onComplete, audioEnabled]);

  return (
    <div className="wonder-phase">
      <div className="wonder-particles">
        {particles.map((p) => (
          <span
            key={p.id}
            className="wonder-particle"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
              fontSize: `${p.size}rem`,
            }}
          >
            {p.emoji}
          </span>
        ))}
      </div>
      <div className="wonder-content">
        <div className={`wonder-qmark ${stage >= 1 ? 'revealed' : ''}`}>
          <span className="wonder-qmark-icon">?</span>
          <div className="wonder-qmark-glow" />
        </div>
        <div className={`wonder-mascot ${stage >= 1 ? 'visible' : ''}`}>
          <div className="mascot thinking">🤖</div>
          <div className="speech-bubble wonder-bubble">Hmm... I wonder... 🤔</div>
        </div>
        <div className={`wonder-question-card ${stage >= 1 ? 'visible' : ''}`}>
          <div className="wonder-emoji">{wonder.emoji}</div>
          <h2 className="wonder-question-text">{wonder.question}</h2>
          <p className="wonder-subtext">{wonder.subtext}</p>
        </div>
        <button
          className={`btn btn-wonder ${stage >= 2 ? 'visible' : ''}`}
          onClick={handleDiscover}
          id="discover-btn"
        >
          <span className="wonder-btn-sparkle">✨</span>
          Let&apos;s Discover!
          <span className="wonder-btn-sparkle">✨</span>
        </button>
      </div>
    </div>
  );
}
