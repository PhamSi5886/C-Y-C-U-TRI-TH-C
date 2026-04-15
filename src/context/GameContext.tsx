import React, { createContext, useContext, useState, useEffect } from 'react';
import { GameState, Question, Player, Level, QuestionType } from '../types';
import { SAMPLE_QUESTIONS } from '../constants';

interface GameContextType {
  state: GameState;
  setPlayer: (name: string, className: string) => void;
  startGame: (level: Level, type: QuestionType) => void;
  submitAnswer: (answer: string | number) => void;
  resetGame: () => void;
  leaderboard: Player[];
  updateQuestions: (questions: Question[]) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<GameState>({
    player: null,
    currentLevel: null,
    currentType: null,
    score: 0,
    currentQuestionIndex: 0,
    questions: [],
    isGameOver: false,
    timeLeft: 20,
  });

  const [leaderboard, setLeaderboard] = useState<Player[]>([]);
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (state.currentLevel && !state.isGameOver && state.timeLeft > 0) {
      timer = setInterval(() => {
        setState(prev => ({ ...prev, timeLeft: prev.timeLeft - 1 }));
      }, 1000);
    } else if (state.timeLeft === 0 && !state.isGameOver) {
      submitAnswer('TIMEOUT'); // Special value for timeout
    }
    return () => clearInterval(timer);
  }, [state.currentLevel, state.isGameOver, state.timeLeft]);

  useEffect(() => {
    const savedQuestions = localStorage.getItem('math_questions');
    if (savedQuestions) {
      setAllQuestions(JSON.parse(savedQuestions));
    } else {
      setAllQuestions(SAMPLE_QUESTIONS);
      localStorage.setItem('math_questions', JSON.stringify(SAMPLE_QUESTIONS));
    }

    const savedLeaderboard = localStorage.getItem('math_leaderboard');
    if (savedLeaderboard) {
      setLeaderboard(JSON.parse(savedLeaderboard));
    }
  }, []);

  const setPlayer = (name: string, className: string) => {
    setState(prev => ({ ...prev, player: { name, className } }));
  };

  const startGame = (level: Level, type: QuestionType) => {
    const filteredQuestions = allQuestions.filter(q => q.level === level && q.type === type);
    // If not enough questions of that type, just take from level
    const finalQuestions = filteredQuestions.length > 0 ? filteredQuestions : allQuestions.filter(q => q.level === level);
    
    setState(prev => ({
      ...prev,
      currentLevel: level,
      currentType: type,
      questions: finalQuestions.sort(() => Math.random() - 0.5).slice(0, 10),
      score: 0,
      currentQuestionIndex: 0,
      isGameOver: false,
      timeLeft: 20,
    }));
  };

  const submitAnswer = (answer: string | number) => {
    const currentQuestion = state.questions[state.currentQuestionIndex];
    const isCorrect = String(answer) === String(currentQuestion.correctAnswer);
    
    const newScore = isCorrect ? state.score + 10 : state.score;
    const nextIndex = state.currentQuestionIndex + 1;
    
    if (nextIndex >= state.questions.length) {
      // Game Over
      const finalPlayer: Player = {
        name: state.player!.name,
        className: state.player!.className,
        score: newScore,
        timestamp: Date.now(),
      };
      
      const newLeaderboard = [...leaderboard, finalPlayer]
        .sort((a, b) => b.score - a.score)
        .slice(0, 10);
      
      setLeaderboard(newLeaderboard);
      localStorage.setItem('math_leaderboard', JSON.stringify(newLeaderboard));
      
      setState(prev => ({
        ...prev,
        score: newScore,
        isGameOver: true,
        timeLeft: 0,
      }));
    } else {
      setState(prev => ({
        ...prev,
        score: newScore,
        currentQuestionIndex: nextIndex,
        timeLeft: 20,
      }));
    }
    
    return isCorrect;
  };

  const resetGame = () => {
    setState(prev => ({
      ...prev,
      currentLevel: null,
      currentType: null,
      score: 0,
      currentQuestionIndex: 0,
      questions: [],
      isGameOver: false,
    }));
  };

  const updateQuestions = (questions: Question[]) => {
    setAllQuestions(questions);
    localStorage.setItem('math_questions', JSON.stringify(questions));
  };

  return (
    <GameContext.Provider value={{ state, setPlayer, startGame, submitAnswer, resetGame, leaderboard, updateQuestions }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame must be used within a GameProvider');
  return context;
};
