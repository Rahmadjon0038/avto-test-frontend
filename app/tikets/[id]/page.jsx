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
  AlertTriangle // Modal uchun yangi ikonka
} from 'lucide-react';
import Link from 'next/link';
import { usegetQuestionTicketid } from '@/hooks/questions';
import { useParams } from 'next/navigation';

const TicketPracticePage = () => {
  const { id } = useParams();
  const { data, isLoading, error } = usegetQuestionTicketid(id);
  
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isInitialized, setIsInitialized] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false); // Modal holati uchun

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

  // 3. Qayta boshlash funksiyasi (Modal tasdiqlanganda)
  const confirmReset = () => {
    setAnswers({});
    setCurrentIdx(0);
    localStorage.removeItem(`ticket_progress_${id}`);
    setShowResetModal(false);
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
      <div className="min-h-screen bg-[#F3F4F6] flex items-center justify-center p-6">
        <div className="bg-white rounded-[32px] p-10 shadow-2xl shadow-slate-200 max-w-sm w-full text-center border border-white">
          <div className="relative w-24 h-24 mx-auto mb-8">
            <div className="absolute inset-0 bg-blue-50 rounded-full animate-pulse"></div>
            <div className="relative bg-white rounded-full w-full h-full flex items-center justify-center shadow-inner border border-blue-100">
              <Lightbulb size={40} className="text-blue-500 opacity-80" />
            </div>
          </div>
          <h2 className="text-2xl font-black text-slate-800 mb-3 tracking-tight">Tez kunda!</h2>
          <p className="text-slate-500 text-sm leading-relaxed mb-8 px-2 font-medium">
            Ushbu bilet uchun test savollari hozirda mutaxassislarimiz tomonidan tayyorlanmoqda.
          </p>
          <Link href="/">
            <button className="w-full py-4 bg-[#1E212B] text-white rounded-2xl font-bold text-[11px] tracking-[0.2em] uppercase transition-all hover:bg-blue-600 active:scale-95">
              Boshqa biletni tanlash
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F3F4F6] font-sans antialiased text-slate-900 relative">
      
      {/* --- CUSTOM RESET MODAL --- */}
      {showResetModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Orqa fon (Overlay) */}
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
            onClick={() => setShowResetModal(false)}
          ></div>
          
          {/* Modal Konteyneri */}
          <div className="relative bg-white rounded-[32px] p-8 shadow-2xl max-w-[500px] w-full text-center transform transition-all animate-in zoom-in-95 duration-200">
            <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle size={40} className="text-amber-500" />
            </div>
            
            <h3 className="text-xl font-black text-slate-800 mb-3 tracking-tight">
              Testni qayta boshlash?
            </h3>
            
            <p className="text-slate-500 text-sm leading-relaxed mb-8 font-medium">
              Barcha belgilangan javoblaringiz o'chib ketadi. Haqiqatdan ham boshidan boshlamoqchimisiz?
            </p>
            
            <div className="flex flex-col gap-3">
              <button
                onClick={confirmReset}
                className="w-full py-4 bg-red-500 text-white rounded-2xl font-bold text-[11px] tracking-[0.2em] uppercase hover:bg-red-600 transition-all active:scale-95 shadow-lg shadow-red-100"
              >
                Ha, qayta boshlash
              </button>
              <button
                onClick={() => setShowResetModal(false)}
                className="w-full py-4 bg-slate-100 text-slate-500 rounded-2xl font-bold text-[11px] tracking-[0.2em] uppercase hover:bg-slate-200 transition-all"
              >
                Yo'q, davom etish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-3 sticky top-0 z-50 shadow-sm">
        <div className="flex items-center justify-between max-w-[1400px] mx-auto">
          <Link href="/">
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-600 transition-all active:scale-95 font-bold text-[11px] uppercase tracking-wider">
              <ChevronLeft size={16} strokeWidth={2.5} />
              Chiqish
            </button>
          </Link>

          <div className="text-center">
            <h1 className="font-bold text-[10px] tracking-[0.2em] uppercase text-slate-400">O'quv Testi</h1>
            <p className="text-blue-600 font-black italic text-sm leading-none mt-1">
              {data?.ticket_name || `BILET №${id}`}
            </p>
          </div>

          <button
            onClick={() => setShowResetModal(true)}
            className="p-2 text-slate-300 hover:text-red-500 transition-all hover:rotate-180 duration-500"
            title="Qayta boshlash"
          >
            <RotateCcw size={20} />
          </button>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-6 mt-6 pb-20">
        {/* Navigation Boxes */}
        <div className="flex justify-center items-center gap-1.5 mb-8 flex-wrap">
          {questions.map((_, i) => {
            const status = answers[i];
            const isActive = currentIdx === i;
            return (
              <button
                key={i}
                onClick={() => setCurrentIdx(i)}
                className={`w-10 h-10 rounded-lg font-bold text-sm transition-all border-2
                  ${isActive ? 'bg-[#1E212B] text-white border-[#1E212B] shadow-md scale-110' :
                    status ? (status.isCorrect ? 'bg-green-500 text-white border-green-500' : 'bg-red-500 text-white border-red-500') :
                      'bg-white text-slate-300 border-slate-200 hover:border-slate-400'}
                `}
              >
                {i + 1}
              </button>
            );
          })}
        </div>

        {/* Question View */}
        <div className="grid grid-cols-12 gap-6 items-start">
          <div className="col-span-12 lg:col-span-6">
            <div className="bg-white rounded-xl p-1.5 shadow-sm border border-slate-200">
              <div className="aspect-[16/10] bg-slate-50 rounded-lg overflow-hidden flex items-center justify-center border border-slate-100">
                {currentQuestion?.image ? (
                  <img src={currentQuestion.image} alt="Savol" className="w-full h-full object-contain" />
                ) : (
                  <div className="text-center text-slate-300 flex flex-col items-center gap-3">
                    <ImageOff size={48} strokeWidth={1} className="opacity-40" />
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em]">Rasm mavjud emas</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <h2 className="text-xl font-bold text-slate-800 mb-6 leading-snug">
                {currentQuestion?.questionText}
              </h2>
              <div className="space-y-2.5">
                {currentQuestion?.options.map((option, i) => {
                  const isSelected = userAnswer?.selected === i;
                  const isCorrect = currentQuestion.correctOption === i;
                  let btnClass = "bg-slate-50 border-transparent text-slate-600 hover:bg-slate-100";
                  if (userAnswer) {
                    if (isCorrect) btnClass = "bg-green-50 border-green-500 text-green-700 font-bold shadow-sm";
                    else if (isSelected) btnClass = "bg-red-50 border-red-500 text-red-700 shadow-sm";
                  }
                  return (
                    <button
                      key={i}
                      disabled={!!userAnswer}
                      onClick={() => handleAnswer(i)}
                      className={`w-full text-left px-5 py-4 rounded-lg border-2 transition-all text-[15px] flex justify-between items-center ${btnClass}`}
                    >
                      <span className="leading-tight">{option}</span>
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
          <div className="mt-8 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden animate-in slide-in-from-bottom-8 duration-500">
            <div className="flex flex-col md:flex-row items-stretch">
              <div className="bg-amber-50 px-8 py-8 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-amber-100 min-w-[160px]">
                <div className="p-4 bg-white rounded-2xl shadow-md text-amber-500 mb-2">
                  <Lightbulb size={32} />
                </div>
                <span className="text-[10px] font-black text-amber-800 uppercase tracking-widest">Qoida Tahlili</span>
              </div>
              <div className="p-8 flex-1 flex items-center bg-white border-b md:border-b-0">
                <p className="text-lg text-slate-700 leading-relaxed font-medium italic">"{currentQuestion?.explanation}"</p>
              </div>
              <div className="p-8 flex items-center justify-center bg-slate-50 min-w-[280px]">
                {currentIdx < questions.length - 1 ? (
                  <button
                    onClick={() => setCurrentIdx(prev => prev + 1)}
                    className="group flex items-center gap-3 bg-blue-600 text-white px-10 py-4 rounded-xl font-bold text-sm hover:bg-blue-700 transition-all active:scale-95"
                  >
                    KEYINGI SAVOL <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                ) : (
                  <Link href="/">
                    <button 
                      onClick={() => localStorage.removeItem(`ticket_progress_${id}`)}
                      className="bg-green-600 text-white px-10 py-4 rounded-xl font-bold text-sm shadow-xl hover:bg-green-700 transition-all"
                    >
                      TESTNI YAKUNLASH
                    </button>
                  </Link>
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