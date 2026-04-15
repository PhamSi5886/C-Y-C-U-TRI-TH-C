import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Star, Brain, Timer, CheckCircle2, XCircle } from 'lucide-react';
import HandTracking from './HandTracking';
import QuestionDisplay from './Question';
import Leaderboard from './Leaderboard';
import confetti from 'canvas-confetti';
import useSound from 'use-sound';

const Game: React.FC = () => {
  const { state, startGame, submitAnswer, resetGame } = useGame();
  const [showFeedback, setShowFeedback] = useState<'correct' | 'incorrect' | null>(null);
  
  // Placeholder sounds
  const [playCorrect] = useSound('https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3');
  const [playWrong] = useSound('https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3');

  const handleGesture = (gesture: string) => {
    if (showFeedback || state.isGameOver) return;
    
    const isCorrect = submitAnswer(gesture);
    
    if (isCorrect) {
      setShowFeedback('correct');
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      playCorrect();
    } else {
      setShowFeedback('incorrect');
      playWrong();
    }

    setTimeout(() => {
      setShowFeedback(null);
    }, 2000);
  };

  if (!state.currentLevel) {
    return (
      <div className="min-h-screen bg-bg flex flex-col">
        <header className="h-20 bg-white border-b-4 border-primary flex items-center justify-between px-10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-2xl">🌉</div>
            <div className="text-2xl font-extrabold text-primary tracking-tight">CÂY CẦU TRI THỨC</div>
          </div>
          <div className="flex items-center gap-5">
            <div className="bg-blue-50 text-primary px-4 py-2 rounded-full font-bold text-sm uppercase">LỚP {state.player?.className}</div>
            <div className="font-extrabold text-text uppercase">{state.player?.name}</div>
            <button onClick={() => resetGame()} className="text-slate-400 hover:text-danger font-bold transition-colors">Đăng xuất</button>
          </div>
        </header>

        <main className="flex-1 p-10 max-w-6xl mx-auto w-full">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-text mb-4">CHỌN VÒNG CHƠI</h2>
            <p className="text-slate-500 font-bold">Hãy chọn độ khó phù hợp với bạn nhé!</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {(['easy', 'medium', 'hard'] as const).map((level) => (
              <motion.button
                key={level}
                whileHover={{ y: -8 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => startGame(level, 'multiple')}
                className={`p-10 rounded-3xl bg-white border-4 shadow-card text-center transition-all ${
                  level === 'easy' ? 'border-green-200 hover:border-accent' :
                  level === 'medium' ? 'border-yellow-200 hover:border-secondary' :
                  'border-red-200 hover:border-danger'
                }`}
              >
                <div className={`w-20 h-20 rounded-2xl mx-auto mb-6 flex items-center justify-center ${
                  level === 'easy' ? 'bg-green-100 text-accent' :
                  level === 'medium' ? 'bg-yellow-100 text-secondary' :
                  'bg-red-100 text-danger'
                }`}>
                  {level === 'easy' ? <Star className="w-10 h-10" /> :
                   level === 'medium' ? <Brain className="w-10 h-10" /> :
                   <Trophy className="w-10 h-10" />}
                </div>
                <h3 className="text-2xl font-black uppercase mb-2 text-text">
                  {level === 'easy' ? 'Dễ' : level === 'medium' ? 'Trung bình' : 'Khó'}
                </h3>
                <p className="font-bold text-slate-400 text-sm">
                  {level === 'easy' ? 'Cơ bản' : level === 'medium' ? 'Nâng cao' : 'Thử thách'}
                </p>
              </motion.button>
            ))}
          </div>

          <div className="mt-16">
            <Leaderboard />
          </div>
        </main>
      </div>
    );
  }

  if (state.isGameOver) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center p-8">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-[2rem] p-12 text-center max-w-lg w-full border-4 border-blue-200 shadow-card"
        >
          <div className="w-24 h-24 bg-yellow-100 rounded-3xl flex items-center justify-center mx-auto mb-8">
            <Trophy className="w-12 h-12 text-secondary" />
          </div>
          <h2 className="text-5xl font-black text-primary mb-4 uppercase tracking-tight">HOÀN THÀNH CÂY CẦU!</h2>
          <p className="text-2xl font-bold text-slate-500 mb-10">
            Bạn đã xây dựng được <span className="text-primary text-4xl">{state.score}</span> điểm tri thức
          </p>
          
          <div className="space-y-4">
            <button
              onClick={() => resetGame()}
              className="w-full py-5 bg-primary text-white rounded-2xl font-black text-xl shadow-[0_8px_0_#01579B] active:shadow-none active:translate-y-2 transition-all"
            >
              CHƠI LẠI
            </button>
            <button
              onClick={() => resetGame()}
              className="w-full py-5 bg-slate-100 text-slate-500 rounded-2xl font-black text-xl hover:bg-slate-200 transition-all"
            >
              MENU CHÍNH
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  const currentQuestion = state.questions[state.currentQuestionIndex];

  return (
    <div className="h-screen bg-bg flex flex-col overflow-hidden">
      <header className="h-20 bg-white border-b-4 border-primary flex items-center justify-between px-10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-2xl">🌉</div>
          <div className="text-2xl font-extrabold text-primary tracking-tight uppercase">CÂY CẦU TRI THỨC</div>
        </div>
        <div className="flex items-center gap-5">
          <div className="bg-blue-50 text-primary px-4 py-2 rounded-full font-bold text-sm uppercase">LỚP {state.player?.className}</div>
          <div className="bg-yellow-50 text-secondary px-4 py-2 rounded-full font-bold text-sm uppercase flex items-center gap-2">
            <Trophy className="w-4 h-4" /> {state.score} ĐIỂM
          </div>
          <div className="font-extrabold text-text uppercase">{state.player?.name}</div>
          <div className="w-11 h-11 rounded-full bg-orange-200 border-2 border-white shadow-sm"></div>
        </div>
      </header>

      <main className="flex-1 grid grid-cols-[1fr_320px] gap-6 p-6 overflow-hidden">
        <div className="flex flex-col gap-6 overflow-hidden">
          <QuestionDisplay question={currentQuestion} />
        </div>

        <aside className="flex flex-col gap-6 overflow-hidden">
          <HandTracking onGesture={handleGesture} active={!showFeedback} />
          
          <div className="bg-white p-6 rounded-3xl shadow-card flex flex-col flex-1 overflow-hidden">
            <h3 className="text-primary font-black text-sm uppercase mb-4 tracking-wider">Thông tin vòng chơi</h3>
            <div className="space-y-4 flex-1">
              <div className="flex justify-between py-3 border-b border-dashed border-slate-200">
                <span className="font-bold text-slate-400">Câu hỏi</span>
                <span className="font-black text-text">{state.currentQuestionIndex + 1} / 10</span>
              </div>
              <div className="flex justify-between py-3 border-b border-dashed border-slate-200">
                <span className="font-bold text-slate-400">Độ khó</span>
                <span className="font-black text-text uppercase text-sm">{state.currentLevel === 'easy' ? 'Dễ' : state.currentLevel === 'medium' ? 'Trung bình' : 'Khó'}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-dashed border-slate-200">
                <span className="font-bold text-slate-400">Chuỗi đúng</span>
                <span className="font-black text-text">🔥 0 câu</span>
              </div>
            </div>
            <button
              onClick={() => resetGame()}
              className="w-full py-4 bg-slate-100 text-slate-500 rounded-xl font-black text-sm hover:bg-slate-200 transition-all"
            >
              TẠM DỪNG
            </button>
          </div>
        </aside>
      </main>

      <footer className="h-[80px] bg-white border-t-4 border-blue-50 flex items-center px-10 shrink-0 relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-slate-100" />
        <div className="font-bold text-slate-400 text-sm uppercase mr-8">Cầu tri thức:</div>
        <div className="flex-1 flex items-center justify-between max-w-4xl relative">
          <div className="absolute h-2 bg-slate-100 w-full rounded-full top-1/2 -translate-y-1/2" />
          <div 
            className="absolute h-2 bg-primary rounded-full top-1/2 -translate-y-1/2 transition-all duration-500" 
            style={{ width: `${(state.currentQuestionIndex / 10) * 100}%` }}
          />
          {Array.from({ length: 11 }).map((_, i) => (
            <div
              key={i}
              className={`w-6 h-6 rounded-full z-10 flex items-center justify-center transition-all border-4 ${
                i <= state.currentQuestionIndex ? 'bg-primary border-blue-100' : 'bg-white border-slate-200'
              }`}
            >
              {i === 10 && <Trophy className={`w-3 h-3 ${i <= state.currentQuestionIndex ? 'text-white' : 'text-slate-300'}`} />}
            </div>
          ))}
        </div>
      </footer>

      <AnimatePresence>
        {showFeedback && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm ${
              showFeedback === 'correct' ? 'bg-accent/20' : 'bg-danger/20'
            }`}
          >
            <motion.div
              initial={{ scale: 0.5, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white p-12 rounded-[3rem] shadow-2xl border-8 border-white flex flex-col items-center"
            >
              {showFeedback === 'correct' ? (
                <>
                  <CheckCircle2 className="w-32 h-32 text-accent mb-4" />
                  <h2 className="text-4xl font-black text-accent uppercase tracking-tight">CHÍNH XÁC!</h2>
                </>
              ) : (
                <>
                  <XCircle className="w-32 h-32 text-danger mb-4" />
                  <h2 className="text-4xl font-black text-danger uppercase tracking-tight">SAI RỒI!</h2>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Game;
