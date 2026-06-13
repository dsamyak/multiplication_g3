import { useState, useCallback, useEffect, useRef } from 'react';
import { narrate, stopNarration, sounds, celebrate, cheer } from '../utils/audio';
import ArrayDiagram from './ArrayDiagram';
import { simulateStation1Intro, simulateStation2Intro, simulateStation3Intro } from '../utils/narration';

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const STATIONS = [
  { id: 0, title: 'Build Arrays', subtitle: 'Concrete Grouping', icon: '🪸' },
  { id: 1, title: 'Spot the Array', subtitle: 'Pictorial Recognition', icon: '👁️' },
  { id: 2, title: 'Number Sentence', subtitle: 'Abstract Math', icon: '📝' },
];

interface StationProps {
  audioEnabled: boolean;
  onNext: () => void;
  onComplete: () => void;
}

function Station1({ audioEnabled, onNext }: Omit<StationProps, 'onComplete'>) {
  const [numGroups, setNumGroups] = useState(0);
  const [groupSize, setGroupSize] = useState(0);
  const [groups, setGroups] = useState<number[]>([]);
  const [round, setRound] = useState(0);
  const [done, setDone] = useState(false);
  const narRef = useRef<{ cancel: () => void } | null>(null);
  const emoji = '🪸';

  useEffect(() => {
    const ng = randInt(2, 4);
    const gs = randInt(2, 5);
    setNumGroups(ng);
    setGroupSize(gs);
    setGroups(Array(ng).fill(0));
    setDone(false);
  }, [round]);

  useEffect(() => {
    if (audioEnabled && numGroups > 0) {
      narRef.current = narrate(simulateStation1Intro(), true);
    }
    return () => {
      narRef.current?.cancel();
    };
  }, [numGroups, audioEnabled]);

  const handleAddToGroup = (gi: number) => {
    if (done || groups[gi] >= groupSize) return;
    sounds.click();
    const newGroups = [...groups];
    newGroups[gi]++;
    setGroups(newGroups);
    if (newGroups.every((g) => g === groupSize)) {
      setDone(true);
      sounds.correct();
      narRef.current?.cancel();
      if (audioEnabled) {
        narRef.current = narrate(
          [celebrate(`${numGroups} × ${groupSize} = ${numGroups * groupSize}!`), cheer('You built a multiplication array!')],
          true
        );
      }
    }
  };

  const totalPlaced = groups.reduce((a, b) => a + b, 0);
  const totalNeeded = numGroups * groupSize;

  return (
    <div style={{ textAlign: 'center' }}>
      <div className="station-header"><h2>🪸 Build a Multiplication Array</h2></div>
      <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', fontWeight: 700, marginBottom: 16 }}>
        Put <strong style={{ color: 'var(--gold)', fontSize: '1.2rem' }}>{groupSize}</strong> {emoji} in each of{' '}
        <strong style={{ color: 'var(--coral)', fontSize: '1.2rem' }}>{numGroups}</strong> rows. Tap a circle to add!
      </p>
      <div className="group-circles-area">
        {groups.map((count, gi) => (
          <div
            key={gi}
            className={`group-circle ${count < groupSize ? 'highlight' : 'complete'}`}
            onClick={() => handleAddToGroup(gi)}
          >
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', justifyContent: 'center' }}>
              {Array(count)
                .fill(0)
                .map((_, i) => (
                  <span key={i} style={{ fontSize: '1.4rem', animation: 'dotCountUp 0.3s ease' }}>{emoji}</span>
                ))}
            </div>
            <div className="group-circle-counter">{count}/{groupSize}</div>
          </div>
        ))}
      </div>
      <p style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 16 }}>
        Placed: {totalPlaced} / {totalNeeded}
      </p>
      {done && (
        <div style={{ animation: 'bounceIn 0.5s' }}>
          <div className="group-diagram-label">{numGroups} × {groupSize} = {totalNeeded} 🎉</div>
          <div style={{ margin: '16px 0' }}>
            <ArrayDiagram numGroups={numGroups} groupSize={groupSize} objectEmoji={emoji} animated size="small" />
          </div>
          <button
            className={`btn ${round < 2 ? 'btn-outline' : 'btn-primary'}`}
            onClick={() => (round < 2 ? setRound((r) => r + 1) : onNext())}
          >
            {round < 2 ? 'Try Another →' : 'Next Station →'}
          </button>
        </div>
      )}
      <div style={{ marginTop: 16, fontSize: '1rem', fontWeight: 800, color: 'var(--text-muted)' }}>Round {Math.min(round + 1, 3)} / 3</div>
    </div>
  );
}

function Station2({ audioEnabled, onNext }: Omit<StationProps, 'onComplete'>) {
  const [round, setRound] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [arrangements, setArrangements] = useState<Array<{ rows: number; cols: number; label: string; isCorrect: boolean }>>([]);
  const [correctIdx, setCorrectIdx] = useState(0);
  const narRef = useRef<{ cancel: () => void } | null>(null);
  const emoji = '⭐';

  useEffect(() => {
    const rows = randInt(2, 4);
    const cols = randInt(2, 5);
    const correct = { rows, cols, label: `${rows} × ${cols}`, isCorrect: true };
    const wrong = [
      { rows: rows + 1, cols, label: `${rows + 1} × ${cols}`, isCorrect: false },
      { rows, cols: cols + 1, label: `${rows} × ${cols + 1}`, isCorrect: false },
      { rows: rows - 1 > 0 ? rows - 1 : rows, cols: cols + 2, label: `${rows - 1 > 0 ? rows - 1 : rows} × ${cols + 2}`, isCorrect: false },
    ];
    const shuffled = [correct, ...wrong].sort(() => Math.random() - 0.5);
    setArrangements(shuffled);
    setCorrectIdx(shuffled.findIndex((a) => a.isCorrect));
    setAnswered(false);
    setSelectedIdx(null);
  }, [round]);

  useEffect(() => {
    if (audioEnabled && arrangements.length > 0) {
      narRef.current = narrate(simulateStation2Intro(), true);
    }
    return () => {
      narRef.current?.cancel();
    };
  }, [arrangements, audioEnabled]);

  const handleSelect = (idx: number) => {
    if (answered) return;
    setSelectedIdx(idx);
    setAnswered(true);
    if (idx === correctIdx) {
      sounds.correct();
      narRef.current?.cancel();
      if (audioEnabled) narRef.current = narrate([celebrate('That matches the multiplication sentence!')], true);
    } else {
      sounds.wrong();
    }
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <div className="station-header"><h2>👁️ Spot the Correct Array</h2></div>
      <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', fontWeight: 700, marginBottom: 16 }}>
        Which array shows <strong style={{ color: 'var(--gold)', fontSize: '1.15rem' }}>{arrangements[correctIdx]?.label}</strong>? Tap to choose!
      </p>
      <div className="arrangement-grid">
        {arrangements.map((arr, idx) => (
          <div
            key={idx}
            className={`arrangement-card ${answered && idx === correctIdx ? 'correct-reveal' : ''} ${answered && idx === selectedIdx && idx !== correctIdx ? 'wrong-reveal' : ''} ${selectedIdx === idx && !answered ? 'selected' : ''}`}
            onClick={() => handleSelect(idx)}
          >
            <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 900, fontSize: '1.2rem', marginBottom: 8, color: 'var(--gold)' }}>{arr.label}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
              {Array(arr.rows)
                .fill(0)
                .map((_, ri) => (
                  <div key={ri} style={{ display: 'flex', gap: 4, padding: '4px 8px', background: 'rgba(255,255,255,0.08)', borderRadius: 8 }}>
                    {Array(arr.cols)
                      .fill(0)
                      .map((_, ci) => (
                        <span key={ci} style={{ fontSize: '1.1rem' }}>{emoji}</span>
                      ))}
                  </div>
                ))}
            </div>
            {answered && idx === correctIdx && (
              <div style={{ color: 'var(--green)', fontSize: '1rem', marginTop: 8, fontWeight: 900 }}>✅ Correct!</div>
            )}
          </div>
        ))}
      </div>
      {answered && (
        <div style={{ marginTop: 20, animation: 'bounceIn 0.5s' }}>
          <button
            className={`btn ${round < 2 ? 'btn-outline' : 'btn-primary'}`}
            onClick={() => (round < 2 ? setRound((r) => r + 1) : onNext())}
          >
            {round < 2 ? 'Try Another →' : 'Next Station →'}
          </button>
        </div>
      )}
      <div style={{ marginTop: 16, fontSize: '1rem', fontWeight: 800, color: 'var(--text-muted)' }}>Round {Math.min(round + 1, 3)} / 3</div>
    </div>
  );
}

function Station3({ audioEnabled, onComplete }: Pick<StationProps, 'audioEnabled' | 'onComplete'>) {
  const [numGroups, setNumGroups] = useState(0);
  const [groupSize, setGroupSize] = useState(0);
  const [inputVal, setInputVal] = useState('');
  const [round, setRound] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [done, setDone] = useState(false);
  const narRef = useRef<{ cancel: () => void } | null>(null);

  useEffect(() => {
    setNumGroups(randInt(2, 5));
    setGroupSize(randInt(2, 5));
    setInputVal('');
    setShowHint(false);
    setDone(false);
  }, [round]);

  useEffect(() => {
    if (audioEnabled && numGroups > 0) {
      narRef.current = narrate(simulateStation3Intro(), true);
    }
    return () => {
      narRef.current?.cancel();
    };
  }, [numGroups, groupSize, audioEnabled]);

  const total = numGroups * groupSize;

  const handleNumClick = (n: string) => {
    if (done) return;
    const newVal = inputVal + n;
    setInputVal(newVal);
    sounds.click();
    if (parseInt(newVal, 10) === total) {
      setDone(true);
      sounds.correct();
      narRef.current?.cancel();
      if (audioEnabled) {
        narRef.current = narrate([celebrate(`Yes! ${numGroups} × ${groupSize} = ${total}!`)], true);
      }
    } else if (newVal.length >= String(total).length) {
      sounds.wrong();
      setTimeout(() => setInputVal(''), 500);
    }
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <div className="station-header"><h2>📝 Number Sentence</h2></div>
      <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', fontWeight: 700, marginBottom: 24 }}>Fill in the blank! Use the number pad.</p>
      <div className="sentence-row">
        <span className="given-value">{numGroups}</span>
        <span className="sentence-label">×</span>
        <span className="given-value">{groupSize}</span>
        <span className="sentence-equals">=</span>
        <div className={`blank-input ${done ? 'correct' : inputVal ? 'filled' : ''}`}>
          {inputVal || (done ? total : '?')}
        </div>
      </div>
      <button className="btn btn-sm btn-outline" onClick={() => setShowHint(!showHint)} style={{ marginBottom: 24 }}>
        {showHint ? 'Hide Hint' : 'Show Hint 🪸'}
      </button>
      {showHint && (
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24, animation: 'slideUp 0.3s' }}>
          <ArrayDiagram numGroups={numGroups} groupSize={groupSize} missingSlot="product" objectEmoji="🪸" animated size="small" />
        </div>
      )}
      {!done && (
        <div className="number-pad">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((n) => (
            <button key={n} className="num-pad-btn" onClick={() => handleNumClick(String(n))}>{n}</button>
          ))}
          <button className="num-pad-btn" onClick={() => setInputVal('')} style={{ gridColumn: 'span 2' }}>Clear</button>
        </div>
      )}
      {done && (
        <div style={{ marginTop: 24, animation: 'bounceIn 0.5s' }}>
          {round < 2 ? (
            <button className="btn btn-outline" onClick={() => setRound((r) => r + 1)}>Try Another →</button>
          ) : (
            <button className="btn btn-primary btn-lg" onClick={() => { narRef.current?.cancel(); stopNarration(); onComplete(); }}>
              🎉 Complete Simulation!
            </button>
          )}
        </div>
      )}
      <div style={{ marginTop: 24, fontSize: '1rem', fontWeight: 800, color: 'var(--text-muted)' }}>Round {Math.min(round + 1, 3)} / 3</div>
    </div>
  );
}

interface SimulatePhaseProps {
  onComplete: () => void;
  audioEnabled: boolean;
}

export default function SimulatePhase({ onComplete, audioEnabled }: SimulatePhaseProps) {
  const [station, setStation] = useState(0);
  const nextStation = useCallback(() => {
    if (station < 2) setStation((s) => s + 1);
  }, [station]);

  return (
    <div className="simulate-phase">
      <div className="simulate-header">
        <h3 className="simulate-label">🧪 Simulate</h3>
        <p className="simulate-sublabel">Explore and discover — no wrong answers!</p>
      </div>
      <div className="progress-dots">
        {STATIONS.map((s, i) => (
          <div key={i} className="simulate-dot-wrapper">
            <div className={`progress-dot ${i === station ? 'active' : i < station ? 'completed' : ''}`} />
            <span className="simulate-dot-label">{s.icon}</span>
          </div>
        ))}
      </div>
      <div className="glass-card" style={{ maxWidth: 800, width: '100%', animation: 'slideUp 0.4s ease' }}>
        {station === 0 && <Station1 audioEnabled={audioEnabled} onNext={nextStation} />}
        {station === 1 && <Station2 audioEnabled={audioEnabled} onNext={nextStation} />}
        {station === 2 && <Station3 audioEnabled={audioEnabled} onComplete={onComplete} />}
      </div>
    </div>
  );
}
