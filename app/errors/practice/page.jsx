'use client'

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Loader2, AlertTriangle, CheckCircle2, XCircle, ArrowRight, ChevronLeft } from 'lucide-react';
import { instance } from '@/hooks/api';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3333';

const resolveImageSrc = (rawPath) => {
  if (!rawPath) return null;
  if (/^https?:\/\//i.test(rawPath)) return rawPath;
  const normalizedPath = rawPath.startsWith('/') ? rawPath : `/${rawPath}`;
  return `${BASE_URL}${normalizedPath}`;
};

const MistakesPracticePage = () => {
  const [mistakesData, setMistakesData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState(null);
  const [submitError, setSubmitError] = useState(null);

  const questions = useMemo(() => (mistakesData?.mistakes || []).map((item) => item.question), [mistakesData]);
  const currentQuestion = questions[currentIndex];
  const selectedAnswer = currentQuestion ? answers[currentQuestion.id] : undefined;
  const currentImageSrc = resolveImageSrc(currentQuestion?.image);

  const fetchMistakes = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await instance.get('/api/mistakes');
      setMistakesData(response.data);
      setCurrentIndex(0);
      setAnswers({});
      setSubmitResult(null);
      setSubmitError(null);
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || 'Xato savollarni olishda xatolik yuz berdi.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchMistakes();
  }, []);

  const handleSelectAnswer = (optionIndex) => {
    if (!currentQuestion || submitResult) return;
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionIndex,
    }));
  };

  const handleSubmitPractice = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const response = await instance.post('/api/mistakes/practice/submit', {
        answers,
      });
      setSubmitResult(response.data);
    } catch (err) {
      console.error(err);
      setSubmitError(err?.response?.data?.message || 'Xatolar bo\'limi javoblarini yuborishda xatolik yuz berdi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F3F4F6] dark:bg-slate-900 flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-xs">Xatolar yuklanmoqda...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F3F4F6] dark:bg-slate-900 flex items-center justify-center p-6 text-center">
        <div className="bg-white dark:bg-slate-800 rounded-[32px] p-10 shadow-2xl max-w-sm w-full">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-black mb-4 uppercase text-slate-900 dark:text-white">Xatolik</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-6">{error}</p>
          <button onClick={fetchMistakes} className="w-full py-4 bg-slate-900 dark:bg-blue-600 text-white rounded-2xl font-bold uppercase tracking-widest text-[11px]">Qayta urinib ko&apos;rish</button>
        </div>
      </div>
    );
  }

  if (!questions.length) {
    return (
      <div className="min-h-screen bg-[#F3F4F6] dark:bg-slate-900 flex items-center justify-center p-6 text-center">
        <div className="bg-white dark:bg-slate-800 rounded-[32px] p-10 shadow-2xl max-w-md w-full">
          <h2 className="text-2xl font-black mb-3 uppercase text-slate-900 dark:text-white">Xato savollar yo&apos;q</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-6">Sizda mashq qilish uchun xato savollar topilmadi.</p>
          <Link href="/errors" className="inline-block w-full py-4 bg-slate-900 dark:bg-blue-600 text-white rounded-2xl font-bold uppercase tracking-widest text-[11px]">Orqaga</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F3F4F6] dark:bg-slate-900 text-slate-900 dark:text-slate-100 py-6 px-3 md:px-12">
      <div className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link href="/errors" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 dark:bg-blue-600 text-white text-sm font-black uppercase tracking-wide">
            <ChevronLeft size={16} /> Orqaga
          </Link>
          <p className="text-xs font-black tracking-[0.3em] text-amber-600 uppercase">Xato Savollar Mashqi</p>
          <button onClick={fetchMistakes} className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 text-sm font-bold">
            Qayta yuklash
          </button>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-[28px] border border-slate-100 dark:border-slate-700 shadow-sm p-4 md:p-5">
          <div className="flex gap-2 flex-wrap mb-5">
            {questions.map((q, idx) => {
              const active = idx === currentIndex;
              const answered = answers[q.id] !== undefined;
              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-9 h-9 rounded-full text-xs font-bold border transition-all ${active
                    ? 'bg-blue-600 text-white border-blue-600 scale-110'
                    : answered
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700'
                      : 'bg-white dark:bg-slate-700 text-slate-500 dark:text-slate-300 border-slate-200 dark:border-slate-600'
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">{currentQuestion?.questionText}</h2>

          {currentImageSrc && (
            <div className="mb-4 rounded-2xl border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-700 overflow-hidden">
              <img
                src={currentImageSrc}
                alt="Savol rasmi"
                className="w-full h-64 object-contain"
                loading="lazy"
              />
            </div>
          )}

          <div className="space-y-2">
            {currentQuestion?.options?.map((option, idx) => {
              const isSelected = selectedAnswer === idx;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelectAnswer(idx)}
                  disabled={!!submitResult}
                  className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all ${isSelected
                    ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-400 dark:border-blue-600 text-blue-700 dark:text-blue-300'
                    : 'bg-slate-50 dark:bg-slate-700 border-transparent text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-500'
                  } ${submitResult ? 'cursor-not-allowed opacity-80' : ''}`}
                >
                  {option}
                </button>
              );
            })}
          </div>

          <div className="flex justify-between mt-6">
            <button
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className="px-5 py-3 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold disabled:opacity-50"
            >
              Oldingi
            </button>
            <button
              onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
              disabled={currentIndex === questions.length - 1}
              className="px-5 py-3 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold disabled:opacity-50 inline-flex items-center gap-2"
            >
              Keyingi <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {submitError && (
          <div className="rounded-2xl border border-red-200 dark:border-red-700 bg-red-50 dark:bg-red-900/20 p-4 text-red-600 dark:text-red-300 text-sm font-semibold">
            {submitError}
          </div>
        )}

        <div className="flex justify-end">
          <button
            onClick={handleSubmitPractice}
            disabled={isSubmitting || !Object.keys(answers).length}
            className="px-6 py-3 rounded-2xl bg-blue-600 text-white text-sm font-black uppercase tracking-[0.15em] hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? 'Yuborilmoqda...' : 'Javoblarni yuborish'}
          </button>
        </div>

        {submitResult && (
          <div className="bg-white dark:bg-slate-800 rounded-[28px] border border-slate-100 dark:border-slate-700 shadow-sm p-6 space-y-4">
            <h3 className="text-lg font-black text-slate-900 dark:text-white">{submitResult?.message}</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
              <div className="rounded-2xl bg-slate-50 dark:bg-slate-700 p-4"><p className="text-[11px] uppercase font-black text-slate-400">Yuborildi</p><p className="text-xl font-black">{submitResult?.summary?.submittedCount ?? 0}</p></div>
              <div className="rounded-2xl bg-green-50 dark:bg-green-900/20 p-4"><p className="text-[11px] uppercase font-black text-green-500">Yechildi</p><p className="text-xl font-black text-green-700 dark:text-green-300">{submitResult?.summary?.solvedCount ?? 0}</p></div>
              <div className="rounded-2xl bg-red-50 dark:bg-red-900/20 p-4"><p className="text-[11px] uppercase font-black text-red-500">Hali xato</p><p className="text-xl font-black text-red-700 dark:text-red-300">{submitResult?.summary?.stillWrongCount ?? 0}</p></div>
              <div className="rounded-2xl bg-amber-50 dark:bg-amber-900/20 p-4"><p className="text-[11px] uppercase font-black text-amber-500">Qolgan</p><p className="text-xl font-black text-amber-700 dark:text-amber-300">{submitResult?.summary?.remainingCount ?? 0}</p></div>
            </div>

            <div className="space-y-2">
              {(submitResult?.details || []).map((item) => (
                <div key={item.questionId} className="rounded-xl border border-slate-100 dark:border-slate-700 p-3 flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold">Savol ID: {item.questionId}</p>
                  <div className="flex items-center gap-2 text-xs font-black uppercase">
                    <span className="text-slate-500">Siz: {item.selectedOption}</span>
                    <span className="text-slate-500">To&apos;g&apos;ri: {item.correctAnswer}</span>
                    <span className={`px-2 py-1 rounded-lg ${item.isCorrect ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'}`}>
                      {item.isCorrect ? <CheckCircle2 size={14} className="inline mr-1" /> : <XCircle size={14} className="inline mr-1" />}
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MistakesPracticePage;
