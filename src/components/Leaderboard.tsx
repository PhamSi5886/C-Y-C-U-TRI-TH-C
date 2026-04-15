import React from 'react';
import { useGame } from '../context/GameContext';
import { Trophy, Medal, User } from 'lucide-react';

const Leaderboard: React.FC = () => {
  const { leaderboard } = useGame();

  return (
    <div className="bg-white rounded-[24px] p-8 shadow-card border-4 border-blue-50">
      <div className="flex items-center gap-4 mb-8">
        <div className="bg-blue-50 p-3 rounded-2xl">
          <Trophy className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-3xl font-black text-text uppercase tracking-tight">BẢNG VINH DANH</h3>
      </div>

      {leaderboard.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
          <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">Chưa có kỷ lục nào</p>
        </div>
      ) : (
        <div className="space-y-3">
          {leaderboard.map((player, index) => (
            <div
              key={index}
              className={`flex items-center justify-between p-5 rounded-2xl border-2 transition-all ${
                index === 0 ? 'bg-yellow-50 border-yellow-200' :
                'bg-white border-slate-100'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg ${
                  index === 0 ? 'bg-secondary text-white' :
                  'bg-slate-100 text-slate-400'
                }`}>
                  {index + 1}
                </div>
                <div>
                  <p className="font-black text-text flex items-center gap-2 uppercase">
                    {player.name}
                    {index === 0 && <Medal className="w-4 h-4 text-secondary" />}
                  </p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Lớp {player.className}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-black text-primary">{player.score}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Điểm</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
