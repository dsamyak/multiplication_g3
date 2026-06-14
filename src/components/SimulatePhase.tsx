import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { sounds } from '../utils/audio';

// ─── Types ────────────────────────────────────────────────────────────────────

interface SimulatePhaseProps { onComplete: () => void; audioEnabled: boolean; }
type Screen = 'hub' | 'pattern' | 'calendar' | 'array' | 'safe' | 'boss';

const SIM_META = [
  { id: 'pattern',  title: 'Pattern Scanner Lab',    emoji: '🔍', case: '01', color: '#8b5cf6' },
  { id: 'calendar', title: 'Calendar Time Machine',  emoji: '⏰', case: '02', color: '#ec4899' },
  { id: 'array',    title: 'Array Builder Workshop', emoji: '🏗️', case: '03', color: '#10b981' },
  { id: 'safe',     title: 'Secret Safe Cracker',    emoji: '🔓', case: '04', color: '#f59e0b' },
  { id: 'boss',     title: 'Master Detective',        emoji: '🏆', case: '05', color: '#ef4444' },
] as const;

// ─── Badge Reveal ────────────────────────────────────────────────────────────

function BadgeReveal({ badge, onDismiss }: { badge: { emoji: string; name: string; desc: string }; onDismiss: () => void }) {
  return (
    <div className="det-badge-overlay" onClick={onDismiss}>
      <div className="det-badge-card" onClick={e => e.stopPropagation()}>
        <div className="det-badge-confetti">
          {['🎉','⭐','✨','🎊','💫'].map((e, i) => (
            <span key={i} className="det-confetti-piece" style={{ left: `${10 + i * 20}%`, animationDelay: `${i * 0.1}s` }}>{e}</span>
          ))}
        </div>
        <div className="det-badge-emoji">{badge.emoji}</div>
        <div className="det-badge-shine">BADGE UNLOCKED!</div>
        <div className="det-badge-name">{badge.name}</div>
        <div className="det-badge-desc">{badge.desc}</div>
        <button className="btn btn-primary" style={{ marginTop: 20 }} onClick={onDismiss}>Awesome! 🎉</button>
      </div>
    </div>
  );
}

// ─── Hub ─────────────────────────────────────────────────────────────────────

function Hub({ xp, completed, badges, onStart }: {
  xp: number; completed: Set<string>; badges: string[]; onStart: (id: string) => void;
}) {
  const sims = SIM_META.map((s, i) => ({
    ...s,
    unlocked: i === 0 || completed.has(SIM_META[i - 1].id),
    done: completed.has(s.id),
  }));

  return (
    <div className="det-hub">
      {/* Top bar */}
      <div className="det-hub-topbar">
        <div className="det-hub-xp">⭐ {xp} XP</div>
        <div className="det-hub-xptrack">
          <div className="det-hub-xpfill" style={{ width: `${Math.min(100, (xp / 310) * 100)}%` }} />
        </div>
        <div className="det-hub-badges">
          {SIM_META.map((s, i) => (
            <span key={i} className={`det-mini-badge ${badges.includes(s.id) ? 'earned' : ''}`} title={s.title}>
              {s.emoji}
            </span>
          ))}
        </div>
      </div>

      {/* Title */}
      <div className="det-hub-title">
        <h2>🕵️ Detective Academy</h2>
        <p>Solve all 5 cases to become a <strong style={{ color: '#fbbf24' }}>Master Detective</strong>!</p>
      </div>

      {/* Case Cards */}
      <div className="det-cases-grid">
        {sims.map((s) => (
          <div
            key={s.id}
            className={`det-case-card ${s.done ? 'done' : s.unlocked ? 'unlocked' : 'locked'}`}
            style={{ '--cc': s.color } as React.CSSProperties}
            onClick={() => s.unlocked && onStart(s.id)}
          >
            <div className="det-case-number">CASE {s.case}</div>
            <div className="det-case-emoji">{s.emoji}</div>
            <div className="det-case-title">{s.title}</div>
            {s.done    && <div className="det-case-status solved">✅ SOLVED</div>}
            {!s.unlocked && <div className="det-case-status locked">🔒 LOCKED</div>}
            {s.unlocked && !s.done && <div className="det-case-status open">▶ START</div>}
            {s.unlocked && !s.done && <div className="det-case-glow" />}
          </div>
        ))}
      </div>

      {completed.size > 0 && (
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1rem', marginTop: 8 }}>
          {completed.size}/5 cases solved
        </p>
      )}
    </div>
  );
}

// ─── Sim 1 · Pattern Scanner Lab ─────────────────────────────────────────────

const NINE_TABLE = Array.from({ length: 9 }, (_, i) => ({
  n: i + 1, product: 9 * (i + 1),
  tens: Math.floor(9 * (i + 1) / 10),
  ones: (9 * (i + 1)) % 10,
}));

const PATTERNS = [
  { id: 'tens',  emoji: '📈', label: 'Tens digit counts UP (0,1,2,3…)', detail: 'Each answer\'s tens digit increases by 1!' },
  { id: 'ones',  emoji: '📉', label: 'Ones digit counts DOWN (9,8,7,6…)', detail: 'Each answer\'s ones digit decreases by 1!' },
  { id: 'sum9',  emoji: '🧮', label: 'Tens + Ones always = 9!', detail: 'Try any 9× fact — digits always sum to 9!' },
];

function PatternScannerLab({ onComplete }: { onComplete: (xp: number) => void }) {
  const [revealed, setRevealed] = useState<Set<number>>(new Set());
  const [step, setStep] = useState<'scan' | 'find' | 'done'>('scan');
  const [found, setFound] = useState<Set<string>>(new Set());
  const [scanPos, setScanPos] = useState({ x: 200, y: 150 });
  const gridRef = useRef<HTMLDivElement>(null);
  const doneRef = useRef(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!gridRef.current) return;
    const r = gridRef.current.getBoundingClientRect();
    setScanPos({ x: e.clientX - r.left, y: e.clientY - r.top });
  };

  const handleReveal = (i: number) => {
    if (step !== 'scan') return;
    sounds.click();
    setRevealed(prev => {
      const next = new Set([...prev, i]);
      if (next.size >= NINE_TABLE.length) setTimeout(() => setStep('find'), 500);
      return next;
    });
  };

  const handleRevealAll = () => {
    sounds.click();
    setRevealed(new Set(NINE_TABLE.map((_, i) => i)));
    setTimeout(() => setStep('find'), 600);
  };

  const handlePatternClick = (pid: string) => {
    if (found.has(pid)) return;
    sounds.correct();
    setFound(prev => {
      const next = new Set([...prev, pid]);
      if (next.size >= PATTERNS.length && !doneRef.current) {
        doneRef.current = true;
        setTimeout(() => { setStep('done'); onComplete(50); }, 700);
      }
      return next;
    });
  };

  return (
    <div className="det-screen det-pattern">
      <div className="det-screen-header">
        <h2 style={{ color: '#a78bfa' }}>🔍 Pattern Scanner Lab — Case 01</h2>
        <p>Scan the 9× table with your magnifying glass to discover hidden patterns!</p>
      </div>

      {(step === 'scan') && (
        <div className="pslab-wrap" ref={gridRef} onMouseMove={handleMouseMove}>
          <div className="pslab-lens" style={{ left: scanPos.x, top: scanPos.y }} />
          <div className="pslab-grid">
            {NINE_TABLE.map((row, i) => (
              <div
                key={i}
                className={`pslab-cell ${revealed.has(i) ? 'revealed' : 'hidden'}`}
                onClick={() => handleReveal(i)}
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="pslab-eq">9 × {row.n}</div>
                {revealed.has(i) ? (
                  <div className="pslab-answer">
                    <span className="pslab-tens">{row.tens}</span>
                    <span className="pslab-ones">{row.ones}</span>
                  </div>
                ) : (
                  <div className="pslab-hidden-answer">?</div>
                )}
                {revealed.has(i) && (
                  <div className="pslab-sum">✨ {row.tens}+{row.ones}=9</div>
                )}
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 20, flexWrap: 'wrap' }}>
            <p className="pslab-hint">🖱️ Click each number to scan it! ({revealed.size}/{NINE_TABLE.length} scanned)</p>
            {revealed.size > 0 && revealed.size < NINE_TABLE.length && (
              <button className="btn btn-outline btn-sm" onClick={handleRevealAll}>Scan All ⚡</button>
            )}
          </div>
        </div>
      )}

      {step === 'find' && (
        <div className="pslab-find">
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', marginBottom: 8, color: '#fbbf24' }}>
            🧠 What patterns did you discover?
          </h3>
          <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: 20 }}>
            Click every pattern you spotted in the 9× table:
          </p>

          {/* Mini table preview */}
          <div className="pslab-preview">
            {NINE_TABLE.map((row, i) => (
              <div key={i} className="pslab-preview-row">
                <span style={{ opacity: 0.6, fontSize: '0.85rem' }}>9×{row.n}=</span>
                <span className="pslab-tens" style={{ fontSize: '1.4rem' }}>{row.tens}</span>
                <span className="pslab-ones" style={{ fontSize: '1.4rem' }}>{row.ones}</span>
              </div>
            ))}
          </div>

          <div className="pslab-clues">
            {PATTERNS.map(p => (
              <div
                key={p.id}
                className={`pslab-clue ${found.has(p.id) ? 'found' : ''}`}
                onClick={() => handlePatternClick(p.id)}
              >
                <span className="pslab-clue-emoji">{p.emoji}</span>
                <div>
                  <div className="pslab-clue-label">{p.label}</div>
                  {found.has(p.id) && <div className="pslab-clue-detail">{p.detail}</div>}
                </div>
                {found.has(p.id) && <span className="pslab-clue-check">✓</span>}
              </div>
            ))}
          </div>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem', marginTop: 12 }}>
            {found.size}/{PATTERNS.length} patterns found
          </p>
        </div>
      )}

      {step === 'done' && (
        <div className="det-sim-done" style={{ animation: 'bounceIn 0.5s ease' }}>
          <div style={{ fontSize: '4rem' }}>🔍</div>
          <h3>All Patterns Discovered!</h3>
          <p>You cracked the 9× code and earned the <strong style={{ color: '#a78bfa' }}>Pattern Detective</strong> badge!</p>
        </div>
      )}
    </div>
  );
}

// ─── Sim 2 · Calendar Time Machine ───────────────────────────────────────────

const CAL_ROUNDS = [
  { table: 7, start: 7,  jumps: 2, q: 'You start at Day 7 (Week 1). The machine makes 2 more weekly jumps. Which day do you land on?' },
  { table: 7, start: 0,  jumps: 4, q: 'Starting from Day 0, the machine travels 4 weeks forward. Where do you end up?' },
  { table: 7, start: 14, jumps: 3, q: 'You\'re at Day 14. After 3 more jumps of 7 days each, what day is your destination?' },
];

function CalendarTimeMachine({ onComplete }: { onComplete: (xp: number) => void }) {
  const [round, setRound] = useState(0);
  const [traveling, setTraveling] = useState(false);
  const [arrived, setArrived] = useState(false);
  const [chosen, setChosen] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);

  const r = CAL_ROUNDS[round];
  const answer = r.start + r.table * r.jumps;

  const options = useMemo(() => {
    const wrongs = [answer + 7, answer - 7, answer + 14].filter(n => n >= 0 && n !== answer).slice(0, 3);
    return [...wrongs, answer].sort(() => Math.random() - 0.5);
  }, [round]); // eslint-disable-line react-hooks/exhaustive-deps

  const MAX_WEEKS = 8;
  const weeks = Array.from({ length: MAX_WEEKS }, (_, i) => (i + 1) * 7);

  const launch = () => {
    sounds.click();
    setTraveling(true);
    setTimeout(() => { setTraveling(false); setArrived(true); }, 2200);
  };

  const pick = (n: number) => {
    if (chosen !== null) return;
    setChosen(n);
    const ok = n === answer;
    setIsCorrect(ok);
    if (ok) { sounds.correct(); setScore(s => s + 1); } else sounds.wrong();
    setTimeout(() => {
      if (round < CAL_ROUNDS.length - 1) {
        setRound(r => r + 1);
        setTraveling(false); setArrived(false); setChosen(null); setIsCorrect(null);
      } else {
        onComplete(score >= 2 ? 50 : 30);
      }
    }, 1600);
  };

  return (
    <div className="det-screen det-calendar">
      <div className="det-screen-header">
        <h2 style={{ color: '#f472b6' }}>⏰ Calendar Time Machine — Case 02</h2>
        <p>Count in 7s to travel through time — multiplication is repeated addition!</p>
        <div className="det-round-dots">
          {CAL_ROUNDS.map((_, i) => <div key={i} className={`det-round-dot ${i < round ? 'done' : i === round ? 'active' : ''}`} />)}
        </div>
      </div>

      {/* Time portal */}
      <div className={`cal-portal ${traveling ? 'active' : ''}`}>
        <div className={`cal-portal-ring ${traveling ? 'spin' : ''}`}>⏰</div>
        {traveling && <div className="cal-portal-sparks">✨ Jumping through time… ✨</div>}
      </div>

      {/* Week strip */}
      <div className="cal-strip-wrap">
        <div className="cal-strip">
          {weeks.map((day, i) => {
            const isStart = day === r.start;
            const isDest  = day === answer && arrived;
            const isPast  = day < r.start;
            return (
              <div key={i} className={`cal-week ${isStart ? 'start' : isDest ? 'dest' : isPast ? 'past' : ''}`}>
                <div className="cal-week-label">Wk {i + 1}</div>
                <div className="cal-week-day">Day {day}</div>
                {isStart && <div className="cal-week-tag">📍 Start</div>}
                {isDest   && <div className="cal-week-tag">🎯 Land!</div>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Question */}
      <div className="cal-qbox">
        <p className="cal-question">{r.q}</p>
        {!traveling && !arrived && (
          <button className="btn btn-primary" style={{ background: 'linear-gradient(135deg,#ec4899,#be185d)' }} onClick={launch}>
            🚀 Launch Time Machine!
          </button>
        )}
        {arrived && !chosen && (
          <div className="cal-choices">
            <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: 10, fontWeight: 700 }}>Where did we land?</p>
            <div className="cal-options">
              {options.map(o => (
                <button key={o} className="cal-option" onClick={() => pick(o)}>Day {o}</button>
              ))}
            </div>
          </div>
        )}
        {chosen !== null && (
          <div className="det-feedback" style={{ color: isCorrect ? '#4ade80' : '#f87171' }}>
            {isCorrect ? `✅ Correct! ${r.table} × ${r.jumps} = ${r.table * r.jumps} more days!` : `❌ It was Day ${answer} (${r.start} + ${r.table}×${r.jumps})`}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Sim 3 · Array Builder Workshop ──────────────────────────────────────────

const ARR_ROUNDS = [
  { rows: 3, cols: 6, emoji: '🦋', table: '3 × 6' },
  { rows: 4, cols: 6, emoji: '⭐', table: '4 × 6' },
  { rows: 6, cols: 6, emoji: '🌸', table: '6 × 6' },
];

function ArrayBuilderWorkshop({ onComplete }: { onComplete: (xp: number) => void }) {
  const [round, setRound] = useState(0);
  const [filledRows, setFilledRows] = useState<Set<number>>(new Set());
  const [done, setDone] = useState(false);
  const [score, setScore] = useState(0);

  const r = ARR_ROUNDS[round];

  const clickRow = (ri: number) => {
    if (done || filledRows.has(ri)) return;
    sounds.click();
    setFilledRows(prev => {
      const next = new Set([...prev, ri]);
      if (next.size >= r.rows) {
        setDone(true);
        sounds.correct();
        setScore(s => s + 1);
      }
      return next;
    });
  };

  const next = () => {
    if (round < ARR_ROUNDS.length - 1) {
      setRound(v => v + 1);
      setFilledRows(new Set());
      setDone(false);
    } else {
      onComplete(score >= 2 ? 50 : 30);
    }
  };

  return (
    <div className="det-screen det-array">
      <div className="det-screen-header">
        <h2 style={{ color: '#34d399' }}>🏗️ Array Builder Workshop — Case 03</h2>
        <p>Click each row to fill it! {r.rows} rows × {r.cols} columns = ?</p>
        <div className="det-round-dots">
          {ARR_ROUNDS.map((_, i) => <div key={i} className={`det-round-dot ${i < round ? 'done' : i === round ? 'active' : ''}`} />)}
        </div>
      </div>

      {/* Equation display */}
      <div className="arr-equation">
        <span className="arr-eq-num">{r.rows}</span>
        <span className="arr-eq-op">×</span>
        <span className="arr-eq-num">{r.cols}</span>
        <span className="arr-eq-op">=</span>
        <span className="arr-eq-ans" style={{ color: done ? '#4ade80' : '#fbbf24' }}>
          {done ? r.rows * r.cols : '?'}
        </span>
      </div>

      {/* Grid */}
      <div className="arr-grid-wrap">
        <div className="arr-rows-label">← {r.rows} rows →</div>
        <div className="arr-grid">
          {Array.from({ length: r.rows }, (_, ri) => (
            <div
              key={ri}
              className={`arr-row-block ${filledRows.has(ri) ? 'filled' : ''} ${done ? '' : 'clickable'}`}
              onClick={() => clickRow(ri)}
            >
              {Array.from({ length: r.cols }, (_, ci) => (
                <div key={ci} className={`arr-cell ${filledRows.has(ri) ? 'on' : ''}`}
                  style={{ animationDelay: `${ci * 40}ms` }}>
                  {filledRows.has(ri) ? <span>{r.emoji}</span> : null}
                </div>
              ))}
              {!filledRows.has(ri) && !done && (
                <div className="arr-row-hint">👆 row {ri + 1}</div>
              )}
            </div>
          ))}
        </div>
        <div className="arr-cols-label">← {r.cols} columns →</div>
      </div>

      {/* Progress */}
      <div className="arr-progress">
        <div className="arr-prog-track">
          <div className="arr-prog-fill" style={{ width: `${(filledRows.size / r.rows) * 100}%` }} />
        </div>
        <span>{filledRows.size * r.cols} / {r.rows * r.cols} blocks placed</span>
      </div>

      {done && (
        <div style={{ animation: 'bounceIn 0.5s ease', textAlign: 'center', marginTop: 16 }}>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 900, color: '#4ade80' }}>
            🎉 {r.rows} × {r.cols} = {r.rows * r.cols}!
          </div>
          <button className="btn btn-primary" style={{ marginTop: 14 }} onClick={next}>
            {round < ARR_ROUNDS.length - 1 ? 'Next Array →' : '🎯 Complete Workshop!'}
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Sim 4 · Secret Safe Cracker ─────────────────────────────────────────────

const SAFES = [
  { a: 6, b: 8, ans: 48 },
  { a: 7, b: 6, ans: 42 },
  { a: 8, b: 9, ans: 72 },
  { a: 9, b: 7, ans: 63 },
];

function SecretSafeCracker({ onComplete }: { onComplete: (xp: number) => void }) {
  const [idx, setIdx] = useState(0);
  const [input, setInput] = useState('');
  const [cracked, setCracked] = useState(false);
  const [shake, setShake] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [score, setScore] = useState(0);
  const safe = SAFES[idx];
  const codeStr = String(safe.ans);

  const pressNum = (n: string) => {
    if (cracked || input.length >= codeStr.length) return;
    sounds.click();
    const next = input + n;
    setInput(next);
    // spin dial
    setRotation(r => r + parseInt(n) * 40);
    if (next.length >= codeStr.length) {
      setTimeout(() => {
        if (next === codeStr) {
          sounds.correct();
          setCracked(true);
          setScore(s => s + 1);
          setTimeout(() => {
            if (idx < SAFES.length - 1) {
              setIdx(i => i + 1);
              setInput(''); setCracked(false);
            } else {
              onComplete(score >= 3 ? 50 : 30);
            }
          }, 1800);
        } else {
          sounds.wrong();
          setShake(true);
          setTimeout(() => { setShake(false); setInput(''); }, 600);
        }
      }, 200);
    }
  };

  const clear = () => { sounds.click(); setInput(''); };

  return (
    <div className="det-screen det-safe">
      <div className="det-screen-header">
        <h2 style={{ color: '#fbbf24' }}>🔓 Secret Safe Cracker — Case 04</h2>
        <p>Crack the combination by solving the multiplication!</p>
        <div className="det-round-dots">
          {SAFES.map((_, i) => <div key={i} className={`det-round-dot ${i < idx ? 'done' : i === idx ? 'active' : ''}`} />)}
        </div>
      </div>

      {/* Vault */}
      <div className={`vault ${cracked ? 'open' : ''} ${shake ? 'shake' : ''}`}>
        <div className="vault-body">
          <div className="vault-dial" style={{ transform: `rotate(${rotation}deg)` }}>
            {Array.from({ length: 12 }, (_, i) => (
              <div key={i} className="vault-tick" style={{ transform: `rotate(${i * 30}deg) translateY(-42px)` }} />
            ))}
            <div className="vault-knob" />
          </div>
          {cracked && <div className="vault-open-badge">🏅</div>}
        </div>
        {cracked && <div className="vault-swing-door" />}
      </div>

      {/* Question */}
      <div className="vault-question">
        <span className="vault-q-num">{safe.a}</span>
        <span className="vault-q-op">×</span>
        <span className="vault-q-num">{safe.b}</span>
        <span className="vault-q-op">=</span>
        <div className={`vault-q-input ${cracked ? 'correct' : shake ? 'wrong' : input ? 'filled' : ''}`}>
          {input || <span style={{ opacity: 0.3 }}>{'?'.repeat(codeStr.length)}</span>}
        </div>
      </div>

      {cracked ? (
        <div className="vault-cracked">
          🎉 Safe Cracked! {safe.a} × {safe.b} = <strong style={{ color: '#4ade80' }}>{safe.ans}</strong>
        </div>
      ) : (
        <div className="vault-numpad">
          {[1,2,3,4,5,6,7,8,9,0].map(n => (
            <button key={n} className="vault-key" onClick={() => pressNum(String(n))}>{n}</button>
          ))}
          <button className="vault-key clear" onClick={clear} style={{ gridColumn: 'span 2' }}>⌫ Clear</button>
        </div>
      )}
    </div>
  );
}

// ─── Sim 5 · Master Detective Challenge ──────────────────────────────────────

const BOSS_STAGES = [
  {
    emoji: '🔍', label: 'Pattern Clue',
    q: 'In the 9× table, digits always sum to __?',
    opts: ['7', '8', '9', '10'], ans: '9',
  },
  {
    emoji: '🏗️', label: 'Array Clue',
    q: 'Which multiplication matches a 4 × 7 array?',
    opts: ['4 × 6 = 24', '4 × 7 = 28', '3 × 7 = 21', '5 × 7 = 35'], ans: '4 × 7 = 28',
  },
  {
    emoji: '⏰', label: 'Calendar Clue',
    q: 'Jumping 6 weeks means 7 added 6 times. What is 7 × 6?',
    opts: ['36', '42', '48', '35'], ans: '42',
  },
  {
    emoji: '🔓', label: 'Final Combination',
    q: 'Last safe! What is 8 × 9?',
    opts: ['63', '64', '72', '81'], ans: '72',
  },
];

function MasterDetectiveChallenge({ onComplete }: { onComplete: (xp: number) => void }) {
  const [stage, setStage] = useState(0);
  const [chosen, setChosen] = useState<string | null>(null);
  const [ok, setOk] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const s = BOSS_STAGES[stage];

  const pick = (opt: string) => {
    if (chosen) return;
    setChosen(opt);
    const correct = opt === s.ans;
    setOk(correct);
    if (correct) { sounds.correct(); setScore(sc => sc + 1); } else sounds.wrong();
    setTimeout(() => {
      if (stage < BOSS_STAGES.length - 1) {
        setStage(st => st + 1); setChosen(null); setOk(null);
      } else {
        setFinished(true);
        sounds.badge();
        onComplete(score >= 3 ? 100 : 70);
      }
    }, 1700);
  };

  if (finished) {
    return (
      <div className="boss-victory">
        <div className="boss-trophy" style={{ animation: 'celebrate 0.8s ease infinite' }}>🏆</div>
        <h2>🎉 Mystery Solved!</h2>
        <p>You are now a <strong style={{ color: '#fbbf24' }}>Master Detective</strong>!</p>
        <div className="boss-final-score">{score}/{BOSS_STAGES.length} Correct</div>
        <div style={{ fontSize: '2rem', marginTop: 8 }}>
          {'⭐'.repeat(score < 2 ? 1 : score < 4 ? 2 : 3)}
        </div>
      </div>
    );
  }

  return (
    <div className="det-screen det-boss">
      <div className="det-screen-header">
        <h2 style={{ color: '#f87171' }}>🏆 Master Detective Challenge — Case 05</h2>
        <p>Use ALL your detective skills to crack the final mystery!</p>
      </div>

      {/* Stage pipeline */}
      <div className="boss-pipeline">
        {BOSS_STAGES.map((bs, i) => (
          <div key={i} className={`boss-pip-step ${i < stage ? 'done' : i === stage ? 'active' : ''}`}>
            <div className="boss-pip-icon">{bs.emoji}</div>
            <div className="boss-pip-label">{bs.label}</div>
          </div>
        ))}
      </div>

      {/* Stage card */}
      <div className="boss-stage-card" style={{ animation: 'slideUp 0.35s ease' }} key={stage}>
        <div className="boss-stage-tag">{s.emoji} Stage {stage + 1} — {s.label}</div>
        <div className="boss-stage-q">{s.q}</div>
        <div className="boss-stage-opts">
          {s.opts.map(opt => (
            <button
              key={opt}
              disabled={!!chosen}
              className={`boss-opt
                ${chosen === opt && ok   ? 'correct' : ''}
                ${chosen === opt && !ok  ? 'wrong'   : ''}
                ${chosen && opt === s.ans && chosen !== opt ? 'reveal' : ''}
              `}
              onClick={() => pick(opt)}
            >
              {opt}
            </button>
          ))}
        </div>
        {chosen && (
          <div className="det-feedback" style={{ color: ok ? '#4ade80' : '#f87171', marginTop: 12 }}>
            {ok ? '✅ Brilliant detective work!' : `❌ The answer was "${s.ans}"`}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main SimulatePhase ───────────────────────────────────────────────────────

export default function SimulatePhase({ onComplete }: SimulatePhaseProps) {
  const [screen, setScreen] = useState<Screen>('hub');
  const [xp, setXP] = useState(0);
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [badges, setBadges] = useState<string[]>([]);
  const [xpPops, setXpPops] = useState<Array<{ id: number; amount: number }>>([]);
  const [badgeReveal, setBadgeReveal] = useState<{ emoji: string; name: string; desc: string } | null>(null);

  const showXP = useCallback((amount: number) => {
    setXP(p => p + amount);
    const id = Date.now();
    setXpPops(p => [...p, { id, amount }]);
    setTimeout(() => setXpPops(p => p.filter(x => x.id !== id)), 2000);
  }, []);

  const BADGE_MAP: Record<string, [string, string, string]> = {
    pattern:  ['🔍', 'Pattern Detective', 'Discovered all hidden multiplication patterns!'],
    calendar: ['⏰', 'Time Traveler',     'Mastered multiplication as repeated jumps!'],
    array:    ['🏗️', 'Array Expert',      'Built perfect multiplication arrays!'],
    safe:     ['🔓', 'Safe Cracker',      'Unlocked every multiplication safe!'],
    boss:     ['🏆', 'Master Detective',  'Solved the ultimate mystery case!'],
  };

  const simDone = useCallback((id: string, earnedXP: number) => {
    showXP(earnedXP);
    setCompleted(prev => {
      const next = new Set([...prev, id]);
      if (next.size >= SIM_META.length) setTimeout(() => onComplete(), 2500);
      return next;
    });
    const bm = BADGE_MAP[id];
    if (bm && !badges.includes(id)) {
      setBadges(prev => [...prev, id]);
      setTimeout(() => setBadgeReveal({ emoji: bm[0], name: bm[1], desc: bm[2] }), 400);
    }
    setTimeout(() => setScreen('hub'), 600);
  }, [badges, showXP, onComplete]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="det-phase">
      {/* Floating XP pops */}
      {xpPops.map(p => (
        <div key={p.id} className="det-xp-pop">+{p.amount} XP ⭐</div>
      ))}

      {badgeReveal && <BadgeReveal badge={badgeReveal} onDismiss={() => setBadgeReveal(null)} />}

      {screen === 'hub'      && <Hub xp={xp} completed={completed} badges={badges} onStart={id => setScreen(id as Screen)} />}
      {screen === 'pattern'  && <PatternScannerLab      onComplete={xp => simDone('pattern',  xp)} />}
      {screen === 'calendar' && <CalendarTimeMachine    onComplete={xp => simDone('calendar', xp)} />}
      {screen === 'array'    && <ArrayBuilderWorkshop   onComplete={xp => simDone('array',    xp)} />}
      {screen === 'safe'     && <SecretSafeCracker      onComplete={xp => simDone('safe',     xp)} />}
      {screen === 'boss'     && <MasterDetectiveChallenge onComplete={xp => simDone('boss',   xp)} />}
    </div>
  );
}
