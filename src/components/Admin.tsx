import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { Question, Level, QuestionType } from '../types';
import { Plus, Trash2, Edit2, Save, X, Settings, Database } from 'lucide-react';
import { motion } from 'motion/react';

const Admin: React.FC = () => {
  const { updateQuestions } = useGame();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newQuestion, setNewQuestion] = useState<Partial<Question>>({
    question: '',
    type: 'multiple',
    level: 'easy',
    options: ['', '', '', ''],
    correctAnswer: ''
  });

  useEffect(() => {
    const saved = localStorage.getItem('math_questions');
    if (saved) setQuestions(JSON.parse(saved));
  }, []);

  const handleSave = () => {
    const updated = [...questions];
    if (editingId) {
      const index = updated.findIndex(q => q.id === editingId);
      updated[index] = { ...newQuestion, id: editingId } as Question;
    } else {
      updated.push({ ...newQuestion, id: Date.now().toString() } as Question);
    }
    setQuestions(updated);
    updateQuestions(updated);
    setEditingId(null);
    setNewQuestion({
      question: '',
      type: 'multiple',
      level: 'easy',
      options: ['', '', '', ''],
      correctAnswer: ''
    });
  };

  const handleDelete = (id: string) => {
    const updated = questions.filter(q => q.id !== id);
    setQuestions(updated);
    updateQuestions(updated);
  };

  const handleResetLeaderboard = () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa toàn bộ bảng xếp hạng?')) {
      localStorage.removeItem('math_leaderboard');
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-4">
            <div className="bg-slate-800 p-3 rounded-2xl">
              <Settings className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-black text-slate-800 uppercase tracking-tight">Quản trị viên</h1>
          </div>
          <div className="flex gap-4">
            <button
              onClick={handleResetLeaderboard}
              className="px-6 py-3 bg-red-100 text-red-600 rounded-xl font-bold hover:bg-red-200 transition-all"
            >
              Reset Bảng Điểm
            </button>
            <a href="/" className="px-6 py-3 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-900 transition-all">
              Về Trang Chủ
            </a>
          </div>
        </header>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-3xl border-4 border-slate-200 shadow-sm sticky top-8">
              <h3 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-2">
                <Plus className="w-6 h-6" /> {editingId ? 'Sửa câu hỏi' : 'Thêm câu hỏi mới'}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-500 mb-1">Câu hỏi</label>
                  <textarea
                    value={newQuestion.question}
                    onChange={e => setNewQuestion({ ...newQuestion, question: e.target.value })}
                    className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-blue-500 outline-none font-bold"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-500 mb-1">Độ khó</label>
                    <select
                      value={newQuestion.level}
                      onChange={e => setNewQuestion({ ...newQuestion, level: e.target.value as Level })}
                      className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-blue-500 outline-none font-bold"
                    >
                      <option value="easy">Dễ</option>
                      <option value="medium">Trung bình</option>
                      <option value="hard">Khó</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-500 mb-1">Dạng bài</label>
                    <select
                      value={newQuestion.type}
                      onChange={e => setNewQuestion({ ...newQuestion, type: e.target.value as QuestionType })}
                      className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-blue-500 outline-none font-bold"
                    >
                      <option value="multiple">Trắc nghiệm</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-500 mb-1">Các đáp án</label>
                  <div className="space-y-2">
                    {['A', 'B', 'C', 'D'].map((label, i) => (
                      <div key={label} className="flex items-center gap-2">
                        <span className="font-black text-slate-300 w-4">{label}</span>
                        <input
                          type="text"
                          value={newQuestion.options?.[i] || ''}
                          onChange={e => {
                            const opts = [...(newQuestion.options || [])];
                            opts[i] = e.target.value;
                            setNewQuestion({ ...newQuestion, options: opts });
                          }}
                          className="flex-1 p-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-blue-500 outline-none font-bold"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-500 mb-1">Đáp án đúng (A, B, C hoặc D)</label>
                  <input
                    type="text"
                    value={newQuestion.correctAnswer}
                    onChange={e => setNewQuestion({ ...newQuestion, correctAnswer: e.target.value.toUpperCase() })}
                    className="w-full p-4 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-blue-500 outline-none font-black text-blue-600"
                    placeholder="Ví dụ: A"
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <button
                    onClick={handleSave}
                    className="flex-1 py-4 bg-blue-600 text-white rounded-xl font-black shadow-[0_4px_0_rgb(30,58,138)] active:translate-y-1 active:shadow-none transition-all"
                  >
                    {editingId ? 'CẬP NHẬT' : 'THÊM CÂU HỎI'}
                  </button>
                  {editingId && (
                    <button
                      onClick={() => setEditingId(null)}
                      className="p-4 bg-slate-100 text-slate-400 rounded-xl"
                    >
                      <X />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl border-4 border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 bg-slate-50 border-b-4 border-slate-200 flex justify-between items-center">
                <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
                  <Database className="w-6 h-6" /> Danh sách câu hỏi ({questions.length})
                </h3>
              </div>
              <div className="divide-y-4 divide-slate-100">
                {questions.map((q) => (
                  <div key={q.id} className="p-6 hover:bg-slate-50 transition-all group">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                            q.level === 'easy' ? 'bg-green-100 text-green-600' :
                            q.level === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                            'bg-red-100 text-red-600'
                          }`}>
                            {q.level}
                          </span>
                          <span className="text-xs font-bold text-slate-400">ID: {q.id}</span>
                        </div>
                        <p className="text-xl font-bold text-slate-800">{q.question}</p>
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                        <button
                          onClick={() => {
                            setEditingId(q.id);
                            setNewQuestion(q);
                          }}
                          className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(q.id)}
                          className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {q.options?.map((opt, i) => (
                        <div key={i} className={`p-2 rounded-lg text-sm font-bold ${
                          ['A', 'B', 'C', 'D'][i] === q.correctAnswer ? 'bg-green-50 text-green-700 border-2 border-green-200' : 'bg-slate-50 text-slate-500'
                        }`}>
                          {['A', 'B', 'C', 'D'][i]}. {opt}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
