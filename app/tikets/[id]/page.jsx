'use client'
import React, { useState } from 'react';
import { 
  ChevronLeft, 
  CheckCircle2, 
  XCircle, 
  Lightbulb, 
  ArrowRight, 
  RotateCcw,
  ImageOff
} from 'lucide-react';
import Link from 'next/link';

const TicketPracticePage = () => {
  // 1. Savollar Arrayi - Variantlar ichida harflari bilan (Siz beradigan format)
  const questions = [
    {
      id: 1,
      question: "Bunday taniqlik belgisi bilan belgilanadigan transport vositasi:",
      image: "https://avtoquiz.s3.eu-north-1.amazonaws.com/media/5-46.png",
      options: [
        "A. Furgon yukxonasida odamlarni tashuvchi",
        "B. Og'ir vaznli va yirik o'lchamli yuklarni tashuvchi",
        "C. Uzunligi yuk bilan yoki yuksiz 20 metrdan ortiq bo'lgan transport vositasi"
      ],
      correctAnswer: 2,
      explanation: "Ushbu belgi 'Uzun o'lchamli transport vositasi' deb nomlanadi va uzunligi yuk bilan yoki yuksiz 20 metrdan ortiq bo'lgan transport vositalarining orqa qismiga o'rnatiladi."
    },
    {
      id: 2,
      question: "Umurtqasining ko'krak qismi shikastlangan kishi transportda qanday tashiladi?",
      image: null, 
      options: [
        "A. Yumshoq to'shamada orqasi bilan yotgan holda",
        "B. Qattiq taxtada yoni bilan yotgan holda",
        "C. Qattiq taxtada orqasi bilan yotgan holda"
      ],
      correctAnswer: 2,
      explanation: "Umurtqa pog'onasi shikastlanganda bemorni faqat qattiq tekislikda (taxtada) orqasi bilan yotgan holda tashish shart. Bu umurtqalarning siljib ketishini oldini oladi."
    },
    {
      id: 3,
      question: "Chorrahadan birinchi bo‘lib qaysi avtomobil o‘tadi:",
      image: "https://avtoquiz.s3.eu-north-1.amazonaws.com/media/5-48.jpg",
      options: [
        "A. Ko'k avtomobil",
        "B. Qizil avtomobil",
        "C. Sariq avtomobil",
        "D. Yashil avtomobil"
      ],
      correctAnswer: 0,
      explanation: "Tartibga solinmagan chorrahalarda asosiy yo'lda turgan transport vositasi birinchi bo'lib o'tish imtiyoziga ega."
    }
  ];

  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});

  const currentQuestion = questions[currentIdx] || questions[0];
  const userAnswer = answers[currentIdx];

  const handleAnswer = (optionIdx) => {
    if (userAnswer) return;
    setAnswers({
      ...answers,
      [currentIdx]: { selected: optionIdx, isCorrect: optionIdx === currentQuestion.correctAnswer }
    });
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] font-sans antialiased text-slate-900">
      
      {/* 1. Header with Compact Button Style */}
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
             <p className="text-blue-600 font-black italic text-sm leading-none mt-1">BILET №01</p>
          </div>

          <button 
            onClick={() => {setAnswers({}); setCurrentIdx(0);}} 
            className="p-2 text-slate-300 hover:text-red-500 transition-all hover:rotate-180 duration-500"
          >
            <RotateCcw size={20} />
          </button>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-6 mt-6 pb-20">
        
        {/* 2. Compact Navigation Boxes */}
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

        {/* 3. Main Split View */}
        <div className="grid grid-cols-12 gap-6 items-start">
          
          {/* Image Part */}
          <div className="col-span-12 lg:col-span-6">
            <div className="bg-white rounded-xl p-1.5 shadow-sm border border-slate-200">
              <div className="aspect-[16/10] bg-slate-50 rounded-lg overflow-hidden flex items-center justify-center border border-slate-100">
                {currentQuestion.image ? (
                  <img 
                    src={currentQuestion.image} 
                    alt="Savol tasviri" 
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="text-center text-slate-300 flex flex-col items-center gap-3">
                    <ImageOff size={48} strokeWidth={1} className="opacity-40" />
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em]">Rasm mavjud emas</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Options Part */}
          <div className="col-span-12 lg:col-span-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <h2 className="text-xl font-bold text-slate-800 mb-6 leading-snug">
                {currentQuestion.question}
              </h2>

              <div className="space-y-2.5">
                {currentQuestion.options.map((option, i) => {
                  const isSelected = userAnswer?.selected === i;
                  const isCorrect = currentQuestion.correctAnswer === i;
                  
                  let btnClass = "bg-slate-50 border-transparent text-slate-600 hover:bg-slate-100 hover:border-slate-200";
                  if (userAnswer) {
                    if (isCorrect) btnClass = "bg-green-50 border-green-500 text-green-700 font-bold shadow-sm shadow-green-100";
                    else if (isSelected) btnClass = "bg-red-50 border-red-500 text-red-700 shadow-sm shadow-red-100";
                  }

                  return (
                    <button
                      key={i}
                      disabled={!!userAnswer}
                      onClick={() => handleAnswer(i)}
                      className={`w-full text-left px-5 py-4 rounded-lg border-2 transition-all text-[15px] flex justify-between items-center ${btnClass}`}
                    >
                      <span className="leading-tight">{option}</span>
                      {userAnswer && isCorrect && <CheckCircle2 size={20} className="text-green-600 shrink-0 ml-2" />}
                      {userAnswer && isSelected && !isCorrect && <XCircle size={20} className="text-red-600 shrink-0 ml-2" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* 4. Bottom Wide Explanation Block */}
        {userAnswer && (
          <div className="mt-8 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden animate-in slide-in-from-bottom-8 duration-500">
            <div className="flex flex-col md:flex-row items-stretch">
              {/* Left Side Info */}
              <div className="bg-amber-50 px-8 py-8 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-amber-100 min-w-[160px]">
                <div className="p-4 bg-white rounded-2xl shadow-md text-amber-500 mb-2">
                  <Lightbulb size={32} />
                </div>
                <span className="text-[10px] font-black text-amber-800 uppercase tracking-widest">Qoida Tahlili</span>
              </div>
              
              {/* Center Text */}
              <div className="p-8 flex-1 flex items-center bg-white border-b md:border-b-0">
                <p className="text-lg text-slate-700 leading-relaxed font-medium italic">
                  "{currentQuestion.explanation}"
                </p>
              </div>

              {/* Right Side Navigation */}
              <div className="p-8 flex items-center justify-center bg-slate-50 min-w-[280px]">
                {currentIdx < questions.length - 1 ? (
                  <button 
                    onClick={() => setCurrentIdx(prev => prev + 1)}
                    className="group flex items-center gap-3 bg-blue-600 text-white px-10 py-4 rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-xl active:scale-95"
                  >
                    KEYINGI SAVOL 
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                ) : (
                  <button className="bg-green-600 text-white px-10 py-4 rounded-xl font-bold text-sm shadow-xl hover:bg-green-700 transition-all">
                    TESTNI YAKUNLASH
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