import { useState, useEffect } from 'react';
import { TableId, Question, QuestionType } from '../types';
import { generateTableQuestions, generateMixedQuestions } from '../utils/generateQuestions';

export function useRandomQuestions(tables: TableId[], count: number, types: QuestionType[] = ['product']) {
  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    if (tables.length === 1) {
      setQuestions(generateTableQuestions(tables[0], count, types));
    } else {
      setQuestions(generateMixedQuestions(tables, count, types));
    }
  }, [tables, count, types]);

  return questions;
}
