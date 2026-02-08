'use client'

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCcw, Target } from 'lucide-react';
import { instance } from '@/hooks/api';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3333';

const formatDateTime = (value) => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleString('uz-UZ');
};

const resolveImageSrc = (rawPath) => {
  if (!rawPath) return null;
  if (/^https?:\/\//i.test(rawPath)) return rawPath;
  const normalizedPath = rawPath.startsWith('/') ? rawPath : `/${rawPath}`;
  return `${BASE_URL}${normalizedPath}`;
};

const MistakesPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMistakes = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await instance.get('/api/mistakes');
      setData(response.data);
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Xatolarni olishda xatolik yuz berdi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchMistakes();
  }, []);

  return (
    <div className="min-h-screen bg-[#F3F4F6] dark:bg-slate-900 py-6 px-3 md:px-12">
      <div className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-black tracking-[0.3em] text-amber-600 uppercase">Xatolar Bo&apos;limi</p>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mt-1">Xato savollar ro&apos;yxati</h1>
          </div>
          <button onClick={fetchMistakes} className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-blue-600 text-white text-sm font-black uppercase tracking-wide flex items-center gap-2">
            <RefreshCcw size={16} /> Yangilash
          </button>
        </div>

        {loading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 rounded-3xl bg-slate-200 dark:bg-slate-700 animate-pulse" />
            ))}
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-red-200 dark:border-red-700 bg-red-50 dark:bg-red-900/20 p-4 text-red-600 dark:text-red-300 text-sm font-semibold flex items-center gap-2">
            <AlertTriangle size={16} /> {error}
          </div>
        )}

        {!loading && !error && (
          <div className="space-y-3">
            <p className="text-sm text-slate-500 dark:text-slate-400">Jami xato savollar: <span className="font-black text-slate-900 dark:text-white">{data?.total ?? 0}</span></p>

            {(data?.mistakes || []).map((item, index) => {
              const question = item?.question;
              const imageSrc = resolveImageSrc(question?.image);
              const wrongAnswerText = typeof item?.lastWrongAnswer === 'number'
                ? (question?.options?.[item.lastWrongAnswer] || item.lastWrongAnswer)
                : '-';

              return (
                <div key={item.id} className="bg-white dark:bg-slate-800 rounded-[24px] border border-slate-100 dark:border-slate-700 shadow-sm p-4 md:p-6">
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                    <p className="text-xs font-black tracking-[0.2em] uppercase text-amber-600">#{index + 1} Xato savol</p>
                    <span className="px-3 py-1 rounded-lg text-xs font-black uppercase bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300">{item.wrongCount} marta xato</span>
                  </div>

                  <p className="text-base md:text-lg font-bold text-slate-900 dark:text-slate-100">{question?.questionText}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Bilet: {question?.ticket?.name || '-'} | Oxirgi xato vaqt: {formatDateTime(item?.lastWrongAt)}</p>

                  {imageSrc && (
                    <div className="mt-4 rounded-2xl border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-700 overflow-hidden">
                      <img
                        src={imageSrc}
                        alt="Savol rasmi"
                        className="w-full h-56 object-contain"
                        loading="lazy"
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                    <div className="rounded-2xl bg-red-50 dark:bg-red-900/20 p-4 border border-red-100 dark:border-red-800">
                      <p className="text-[11px] font-black uppercase text-red-500">Oxirgi noto&apos;g&apos;ri javobingiz</p>
                      <p className="text-sm mt-1 text-red-700 dark:text-red-300">{wrongAnswerText}</p>
                    </div>
                    <div className="rounded-2xl bg-green-50 dark:bg-green-900/20 p-4 border border-green-100 dark:border-green-800">
                      <p className="text-[11px] font-black uppercase text-green-500">To&apos;g&apos;ri javob</p>
                      <p className="text-sm mt-1 text-green-700 dark:text-green-300">{question?.options?.[question?.correctOption] || '-'}</p>
                    </div>
                  </div>

                  {question?.explanation && (
                    <div className="mt-4 rounded-2xl border border-slate-100 dark:border-slate-700 p-4">
                      <p className="text-[11px] font-black uppercase text-slate-400">Izoh</p>
                      <p className="text-sm mt-1 text-slate-600 dark:text-slate-300">{question.explanation}</p>
                    </div>
                  )}
                </div>
              );
            })}

            {(data?.mistakes || []).length === 0 && (
              <div className="bg-white dark:bg-slate-800 rounded-[24px] border border-slate-100 dark:border-slate-700 p-5 md:p-8 text-center">
                <Target size={36} className="mx-auto text-green-500 mb-3" />
                <p className="text-lg font-black text-slate-900 dark:text-white">Xato savollar topilmadi</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Ajoyib, hammasi to&apos;g&apos;ri ishlangan.</p>
              </div>
            )}
          </div>
        )}

        <div className="pt-2">
          <Link href="/errors/practice" className="inline-flex items-center gap-2 px-6 py-4 rounded-2xl bg-blue-600 text-white text-sm font-black uppercase tracking-[0.15em] hover:bg-blue-700">
            Xato savollarni imtihon ko&apos;rinishida ishlash
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MistakesPage;
