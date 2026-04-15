import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { motion } from 'motion/react';
import { Rocket, GraduationCap, User } from 'lucide-react';

const Login: React.FC = () => {
  const { setPlayer } = useGame();
  const [name, setName] = useState('');
  const [className, setClassName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && className) {
      setPlayer(name, className);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-bg">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white rounded-[24px] p-10 shadow-card w-full max-w-md border-4 border-[#B3E5FC]"
      >
        <div className="text-center mb-10">
          <div className="inline-block p-5 bg-blue-50 rounded-2xl mb-5">
            <Rocket className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-4xl font-black text-primary mb-2 tracking-tight uppercase">MATH CHALLENGE</h1>
          <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">Đấu trường Toán học hiện đại</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-black text-slate-400 mb-2 uppercase tracking-wider flex items-center gap-2">
              <User className="w-4 h-4" /> Tên của bạn
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-6 py-4 rounded-[20px] bg-white border-4 border-[#CFD8DC] focus:border-primary outline-none transition-all text-lg font-bold text-text"
              placeholder="Ví dụ: Minh Anh"
            />
          </div>

          <div>
            <label className="block text-xs font-black text-slate-400 mb-2 uppercase tracking-wider flex items-center gap-2">
              <GraduationCap className="w-4 h-4" /> Lớp học
            </label>
            <input
              type="text"
              required
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              className="w-full px-6 py-4 rounded-[20px] bg-white border-4 border-[#CFD8DC] focus:border-primary outline-none transition-all text-lg font-bold text-text"
              placeholder="Ví dụ: 3A1"
            />
          </div>

          <button
            type="submit"
            className="w-full py-5 bg-primary hover:bg-blue-600 text-white rounded-[20px] font-black text-xl shadow-[0_8px_0_#01579B] active:shadow-none active:translate-y-2 transition-all uppercase tracking-tight"
          >
            BẮT ĐẦU NGAY!
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;
