import { useState, useCallback } from 'react';
import ArrayDiagram from './ArrayDiagram';
import { PlayQuestion } from '../types/play';

interface QuestionRendererProps {
  question: PlayQuestion;
  onAnswer: (isCorrect: boolean) => void;
  disabled: boolean;
}

function Visual({ question }: { question: PlayQuestion }) {
  if (!question.visual) return null;

  if (question.visual === 'arrayDiagram') {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
        <ArrayDiagram
          numGroups={question.multiplier}
          groupSize={question.multiplicand}
          missingSlot={question.missingSlot === 'product' ? 'product' : question.missingSlot}
          objectEmoji={question.objectEmoji || '⭐'}
          animated
          size="small"
        />
      </div>
    );
  }

  if (question.visual === 'picture') {
    return (
      <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', margin: '20px 0' }}>
        {Array.from({ length: question.multiplicand }, (_, gi) => (
          <div
            key={gi}
            style={{
              display: 'flex',
              gap: 4,
              padding: '8px 12px',
              background: 'rgba(255,255,255,0.06)',
              borderRadius: 12,
              border: '2px solid rgba(255,255,255,0.1)',
            }}
          >
            {Array.from({ length: question.multiplier }, (_, di) => (
              <span key={di} style={{ fontSize: '1.9rem' }}>{question.objectEmoji || '⭐'}</span>
            ))}
          </div>
        ))}
      </div>
    );
  }

  return null;
}

export default function QuestionRenderer({ question, onAnswer, disabled }: QuestionRendererProps) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const handleOptionClick = useCallback(
    (option: number) => {
      if (disabled) return;
      setSelectedOption(option);
      const isCorrect = option === question.correctAnswer;
      setTimeout(() => {
        onAnswer(isCorrect);
        setSelectedOption(null);
      }, 600);
    },
    [disabled, question.correctAnswer, onAnswer]
  );

  return (
    <div>
      <div
        style={{
          display: 'inline-block',
          background: 'var(--coral)',
          color: 'white',
          padding: '6px 16px',
          borderRadius: '12px',
          fontSize: '0.9rem',
          fontWeight: 900,
          marginBottom: 14,
          letterSpacing: '1px',
          fontFamily: 'var(--font-heading)',
        }}
      >
        ✖️ TIMES TABLES
      </div>
      <p className="question-text">{question.questionText}</p>
      <Visual question={question} />
      <div className="options-grid">
        {question.options.map((opt, i) => {
          let cls = 'option-btn';
          if (disabled) cls += ' disabled';
          if (selectedOption === opt) {
            cls += opt === question.correctAnswer ? ' correct' : ' wrong';
          } else if (disabled && opt === question.correctAnswer) {
            cls += ' correct';
          }
          return (
            <button key={i} className={cls} onClick={() => handleOptionClick(opt)}>
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}
