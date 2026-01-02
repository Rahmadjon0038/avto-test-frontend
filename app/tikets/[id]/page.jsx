'use client'
import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  CheckCircle2,
  XCircle,
  Lightbulb,
  ArrowRight,
  RotateCcw,
  ImageOff,
  Loader2,
  AlertTriangle,
  Trophy,
  Target,
  FileQuestion,
  Home
} from 'lucide-react';
import Link from 'next/link';
import { usegetQuestionTicketid } from '@/hooks/questions';
import { useParams, useRouter } from 'next/navigation';

const TicketPracticePage = () => {
  const { id } = useParams();
  const router = useRouter();
  const { data, isLoading, error } = usegetQuestionTicketid(id);
  const BASE_URL = "http://localhost:5000";
  
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isInitialized, setIsInitialized] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showResult, setShowResult] = useState(false); // Natija modali uchun

  const questions = data?.questions || [];
  const currentQuestion = questions[currentIdx];
  const userAnswer = answers[currentIdx];

  // 1. LocalStorage yuklash
  useEffect(() => {
    const savedAnswers = localStorage.getItem(`ticket_progress_${id}`);
    if (savedAnswers) {
      try {
        setAnswers(JSON.parse(savedAnswers));
      } catch (e) {
        console.error("LocalStorage xatosi:", e);
      }
    }
    setIsInitialized(true);
  }, [id]);

  // 2. LocalStorage saqlash
  useEffect(() => {
    if (isInitialized && Object.keys(answers).length > 0) {
      localStorage.setItem(`ticket_progress_${id}`, JSON.stringify(answers));
    }
  }, [answers, id, isInitialized]);

  // 3. Natijalarni hisoblash
  const calculateResults = () => {
    const total = questions.length;
    const answeredCount = Object.keys(answers).length;
    const correct = Object.values(answers).filter(a => a.isCorrect).length;
    const wrong = answeredCount - correct;
    const skipped = total - answeredCount;
    
    return { total, correct, wrong, skipped, percent: Math.round((correct / total) * 100) };
  };

  const confirmReset = () => {
    setAnswers({});
    setCurrentIdx(0);
    localStorage.removeItem(`ticket_progress_${id}`);
    setShowResetModal(false);
    setShowResult(false);
  };

  const handleAnswer = (optionIdx) => {
    if (userAnswer) return;
    setAnswers(prev => ({
      ...prev,
      [currentIdx]: { 
        selected: optionIdx, 
        isCorrect: optionIdx === currentQuestion.correctOption 
      }
    }));
  };

  if (isLoading || !isInitialized) {
    return (
      <div className="min-h-screen bg-[#F3F4F6] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Savollar yuklanmoqda...</p>
      </div>
    );
  }

  if (error || !questions.length || data?.message === "Bilet topilmadi") {
    return (
      <div className="min-h-screen bg-[#F3F4F6] flex items-center justify-center p-6 text-center">
        {/* ... Error view (o'zgarishsiz qoladi) ... */}
        <div className="bg-white rounded-[32px] p-10 shadow-2xl max-w-sm w-full">
            <h2 className="text-2xl font-black mb-4 uppercase">Bilet bo'sh</h2>
            <Link href="/"><button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold uppercase tracking-widest text-[11px]">Orqaga</button></Link>
        </div>
      </div>
    );
  }

  const stats = calculateResults();

  return (
    <div className="min-h-screen bg-[#F3F4F6] font-sans antialiased text-slate-900 relative">
      
      {/* --- RESULT MODAL (NATIJA) --- */}
      {showResult && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"></div>
          <div className="relative bg-white rounded-[40px] p-8 shadow-2xl max-w-[450px] w-full transform transition-all animate-in zoom-in-95">
            <div className={`w-20 h-20 mx-auto mb-6 rounded-3xl flex items-center justify-center ${stats.percent >= 70 ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
              <Trophy size={40} />
            </div>
            
            <h2 className="text-2xl font-black text-center text-slate-800 mb-2 uppercase tracking-tight">Test Yakunlandi!</h2>
            <p className="text-center text-slate-500 font-medium mb-8">Bilet bo'yicha umumiy natijangiz:</p>
            
            <div className="grid grid-cols-3 gap-3 mb-8">
              <div className="bg-green-50 p-4 rounded-2xl text-center border border-green-100">
                <Target className="mx-auto mb-1 text-green-600" size={20} />
                <div className="text-xl font-black text-green-700">{stats.correct}</div>
                <div className="text-[9px] font-bold text-green-600 uppercase tracking-widest">To'g'ri</div>
              </div>
              <div className="bg-red-50 p-4 rounded-2xl text-center border border-red-100">
                <XCircle className="mx-auto mb-1 text-red-600" size={20} />
                <div className="text-xl font-black text-red-700">{stats.wrong}</div>
                <div className="text-[9px] font-bold text-red-600 uppercase tracking-widest">Xato</div>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl text-center border border-slate-100">
                <FileQuestion className="mx-auto mb-1 text-slate-400" size={20} />
                <div className="text-xl font-black text-slate-600">{stats.skipped}</div>
                <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Qoldi</div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={confirmReset}
                className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold text-[11px] tracking-[0.2em] uppercase hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
              >
                <RotateCcw size={16} /> Qayta urinish
              </button>
              <Link href="/" className="w-full">
                <button 
                   onClick={() => localStorage.removeItem(`ticket_progress_${id}`)}
                   className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-[11px] tracking-[0.2em] uppercase hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                >
                  <Home size={16} /> Bosh sahifa
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Reset Modal (O'zgarishsiz) */}
      {showResetModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowResetModal(false)}></div>
          <div className="relative bg-white rounded-[32px] p-8 shadow-2xl max-w-[400px] w-full text-center">
            <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4"><AlertTriangle size={32} className="text-amber-500" /></div>
            <h3 className="text-xl font-black text-slate-800 mb-2 uppercase">Qayta boshlash?</h3>
            <p className="text-slate-500 text-sm mb-6">Barcha javoblar o'chiriladi.</p>
            <div className="flex gap-2">
                <button onClick={() => setShowResetModal(false)} className="flex-1 py-3 bg-slate-100 rounded-xl font-bold text-[10px] uppercase">Yo'q</button>
                <button onClick={confirmReset} className="flex-1 py-3 bg-red-500 text-white rounded-xl font-bold text-[10px] uppercase">Ha</button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-3 sticky top-0 z-50 shadow-sm">
        <div className="flex items-center justify-between max-w-[1400px] mx-auto">
          <Link href="/">
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-600 transition-all font-bold text-[11px] uppercase tracking-wider">
              <ChevronLeft size={16} strokeWidth={2.5} /> Chiqish
            </button>
          </Link>
          <div className="text-center">
            <p className="text-blue-600 font-black italic text-sm uppercase">{data?.ticket_name || `BILET №${id}`}</p>
          </div>
          <button onClick={() => setShowResetModal(true)} className="p-2 text-slate-300 hover:text-red-500 transition-all"><RotateCcw size={20} /></button>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-6 mt-6 pb-20">
        {/* Navigation Boxes */}
        <div className="flex justify-center items-center gap-1.5 mb-8 flex-wrap">
          {questions.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIdx(i)}
              className={`w-10 h-10 rounded-lg font-bold text-sm transition-all border-2
                ${currentIdx === i ? 'bg-slate-900 text-white border-slate-900 scale-110 shadow-lg' :
                  answers[i] ? (answers[i].isCorrect ? 'bg-green-500 text-white border-green-500' : 'bg-red-500 text-white border-red-500') :
                  'bg-white text-slate-300 border-slate-200'}
              `}
            >
              {i + 1}
            </button>
          ))}
        </div>

        {/* Question View */}
        <div className="grid grid-cols-12 gap-6 items-start">
          <div className="col-span-12 lg:col-span-6">
            <div className="bg-white rounded-2xl p-2 shadow-sm border border-slate-200">
              <div className="aspect-[16/10] bg-slate-50 rounded-xl overflow-hidden flex items-center justify-center">
                {currentQuestion?.image ? (
                  <img src={`${BASE_URL}${currentQuestion.image}`} crossOrigin='anonymous' className="w-full h-full object-contain" alt="Savol" />
                ) : (
                  <ImageOff size={48} className="text-slate-200" />
                )}
              </div>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <h2 className="text-xl font-bold text-slate-800 mb-6 leading-tight">{currentQuestion?.questionText}</h2>
              <div className="space-y-2.5">
                {currentQuestion?.options.map((option, i) => {
                  const isSelected = userAnswer?.selected === i;
                  const isCorrect = currentQuestion.correctOption === i;
                  let btnClass = "bg-slate-50 border-transparent text-slate-600 hover:bg-slate-100";
                  if (userAnswer) {
                    if (isCorrect) btnClass = "bg-green-50 border-green-500 text-green-700 font-bold";
                    else if (isSelected) btnClass = "bg-red-50 border-red-500 text-red-700";
                  }
                  return (
                    <button
                      key={i}
                      disabled={!!userAnswer}
                      onClick={() => handleAnswer(i)}
                      className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-all flex justify-between items-center ${btnClass}`}
                    >
                      <span className="text-[15px] leading-tight">{option}</span>
                      {userAnswer && isCorrect && <CheckCircle2 size={20} className="text-green-600" />}
                      {userAnswer && isSelected && !isCorrect && <XCircle size={20} className="text-red-600" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Explanation Block */}
        {userAnswer && (
          <div className="mt-8 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden animate-in slide-in-from-bottom-8">
            <div className="flex flex-col md:flex-row">
              <div className="bg-amber-50 p-6 flex flex-col items-center justify-center md:border-r border-amber-100 min-w-[140px]">
                <Lightbulb className="text-amber-500 mb-1" size={28} />
                <span className="text-[9px] font-black uppercase text-amber-700">Tahlil</span>
              </div>
              <div className="p-6 flex-1 flex items-center">
                <p className="text-slate-700 italic font-medium leading-relaxed">{currentQuestion?.explanation}</p>
              </div>
              <div className="p-6 bg-slate-50 flex items-center justify-center min-w-[250px]">
                {currentIdx < questions.length - 1 ? (
                  <button
                    onClick={() => setCurrentIdx(prev => prev + 1)}
                    className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-sm uppercase"
                  >
                    Keyingi <ArrowRight size={18} />
                  </button>
                ) : (
                  <button 
                    onClick={() => setShowResult(true)}
                    className="w-full bg-green-600 text-white px-8 py-4 rounded-xl font-bold text-sm uppercase shadow-lg shadow-green-100"
                  >
                    Natijani ko'rish
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default TicketPracticePage;