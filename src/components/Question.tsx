import React from 'react';
import { Question } from '../types';
import { motion } from 'motion/react';

interface QuestionProps {
  question: Question;
}

const QuestionDisplay: React.FC<QuestionProps> = ({ question }) => {
  const options = question.options || [];
  const labels = ['A', 'B', 'C', 'D'];
  const gestures = ['☝️ 1 Ngón', '✌️ 2 Ngón', '🤟 3 Ngón', '✋ Bàn tay'];

  return (
    <div className="flex flex-col gap-6 flex-1 overflow-hidden">
      <div className="bg-white rounded-[24px] p-10 text-center shadow-card border-4 border-[#B3E5FC] relative overflow-hidden">
        <div className="text-primary font-bold text-lg mb-3 uppercase tracking-wider">
          CÂU HỎI {question.id.padStart(2, '0')} • ĐỘ KHÓ: {question.level === 'easy' ? 'DỄ' : question.level === 'medium' ? 'TRUNG BÌNH' : 'KHÓ'}
        </div>
        <h2 className="text-[56px] font-extrabold text-text leading-tight my-2">
          {question.question}
        </h2>
        <div className="absolute bottom-0 left-0 h-2 bg-secondary w-[70%] rounded-r-full" />
      </div>

      <div className="grid grid-cols-2 gap-5 flex-1 overflow-hidden">
        {options.map((option, index) => (
          <motion.div
            key={index}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white border-4 border-[#CFD8DC] rounded-[20px] p-6 flex items-center gap-5 relative group hover:border-primary hover:bg-blue-50 transition-all cursor-pointer"
          >
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-extrabold text-xl ${
              index === 0 ? 'bg-[#FFCDD2] text-[#C62828]' :
              index === 1 ? 'bg-[#C8E6C9] text-[#2E7D32]' :
              index === 2 ? 'bg-[#BBDEFB] text-[#1565C0]' :
              'bg-[#FFF9C4] text-[#F9A825]'
            }`}>
              {labels[index]}
            </div>
            <span className="text-3xl font-bold text-text">
              {option}
            </span>
            <div className="absolute right-3 bottom-2 text-[11px] text-slate-400 font-bold uppercase tracking-tight">
              {gestures[index]}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default QuestionDisplay;
