export type QuestionType = 'multiple' | 'true_false' | 'short_answer' | 'ordering';
export type Level = 'easy' | 'medium' | 'hard';

export interface Question {
  id: string;
  question: string;
  type: QuestionType;
  options?: string[];
  correctAnswer: string | number;
  level: Level;
}

export interface Player {
  name: string;
  className: string;
  score: number;
  timestamp: number;
}

export interface GameState {
  player: { name: string; className: string } | null;
  currentLevel: Level | null;
  currentType: QuestionType | null;
  score: number;
  currentQuestionIndex: number;
  questions: Question[];
  isGameOver: boolean;
  timeLeft: number;
}
