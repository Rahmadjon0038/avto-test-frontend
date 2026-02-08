'use client'
import React from 'react';
import { Lock, ChevronRight, Sparkles, CreditCard, Unlock } from 'lucide-react';
import Link from 'next/link';
import { usegetAlltikets } from '@/hooks/tickets';
import { Skeleton } from '@mui/material';
import { useGetMe } from '@/hooks/user';
import PayModal from '../SubsicribedModal';

const HomePage = () => {
  const { data, isLoading, error } = usegetAlltikets();
  const skeletonArray = Array(8).fill(0);
  const { data: me } = useGetMe();
  const premiumUiEnabled = false; // Toggle to hide premium-only UI without deleting it
  const hasTickets = Array.isArray(data) && data.length > 0;

  if (error) return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <p className="text-red-500 font-bold italic">Xatolik yuz berdi: {error.message}</p>
    </div>
  );

  return (
    <div className="min-h-screen mx-4 md:mx-12 bg-[#FDFDFD] dark:bg-slate-900 py-10 px-4 sm:px-6">
      {/* Header */}
      <div className="mb-6 md:mb-10 flex flex-col md:flex-row md:items-end justify-between border-b border-slate-100 dark:border-slate-700 pb-5 md:pb-8 gap-3 md:gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
            Imtihon biletlari
          </h1>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-2 font-bold tracking-[0.2em] uppercase">
            {isLoading ? <Skeleton width={80} /> : `Jami: ${data?.length || 0} ta bilet`}
          </p>
        </div>
        {premiumUiEnabled && !isLoading && (
          me?.isSubscribed ? (
            <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-xl border border-green-100">
              <Unlock size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest">Premium Faol</span>
            </div>
          ) : (
            <PayModal>
              <button  className="flex items-center gap-2 bg-amber-50 text-amber-700 px-4 py-2 rounded-xl border border-amber-100 hover:bg-amber-100 transition-all group">
                <Sparkles size={16} className="group-hover:rotate-12 transition-transform" />
                <span className="text-[10px] font-black uppercase tracking-widest">Premiumga o&apos;tish</span>
              </button>
            </PayModal>
          )
        )}
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">

        {isLoading ? (
          skeletonArray.map((_, index) => (
            <div key={index} className="bg-white dark:bg-slate-800 border-2 border-slate-50 dark:border-slate-700 rounded-2xl md:rounded-[32px] p-3 md:p-6 shadow-sm">
              <Skeleton variant="circular" width={44} height={44} className="mb-4" />
              <Skeleton width="100%" height={80} className="rounded-2xl" />
              <Skeleton width="100%" height={45} className="mt-6 rounded-xl" />
            </div>
          ))
        ) : hasTickets ? (
          data?.map((ticket) => {
            const isLocked = premiumUiEnabled && ticket.is_locked;
            return (
              <div
                key={ticket.id}
                className={`group flex flex-col bg-white dark:bg-slate-800 border-2 rounded-2xl md:rounded-[32px] p-3 md:p-6 transition-all duration-500 relative ${!isLocked
                  ? 'border-slate-500 dark:border-slate-600 hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-500/10'
                  : 'border-amber-100/50 hover:border-amber-400 opacity-90'
                }`}
            >
              {/* Card Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-slate-800 dark:text-white text-sm uppercase leading-tight tracking-tight">
                    {ticket.name}
                  </h3>
                </div>
                {/* Agar qulflangan bo'lsa Lock ikonkasini ko'rsatish */}
                {isLocked && <Lock size={18} className="text-amber-500 mt-1 animate-pulse" />}
              </div>

              {/* Description Section */}
              <div className="flex-1 mb-6">
                <div className={`text-[12px] font-medium leading-relaxed p-3 md:p-4 rounded-xl md:rounded-2xl border transition-all italic ${!isLocked ? 'text-slate-500 dark:text-slate-400 bg-white/50 dark:bg-slate-700/50 border-slate-50 dark:border-slate-600 group-hover:border-slate-200 dark:group-hover:border-slate-500' : 'text-amber-600/70 bg-amber-50/30 border-amber-100'
                  }`}>
                  {ticket.description || "Ushbu bilet uchun qo'shimcha ma'lumot kiritilmagan."}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4">
                {!isLocked ? (
                  /* BILET OCHIQ BO'LSA */
                  <Link
                    href={`/tikets/${ticket.id}`}
                    className="flex justify-between items-center bg-slate-900 text-white px-3 py-2.5 rounded-xl group-hover:bg-blue-600 transition-all duration-300 shadow-lg"
                  >
                    <span className="text-[10px] font-black uppercase tracking-widest">
                      Boshlash
                    </span>
                    <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                ) : (
                  /* BILET QULFLANGAN BO'LSA */
                  <Link
                    href="/subscription"
                    className="flex justify-between items-center bg-amber-500 text-white px-3 md:px-5 py-3 md:py-4 rounded-xl md:rounded-2xl hover:bg-amber-600 transition-all duration-300 shadow-lg shadow-amber-100"
                  >
                    <div className="flex items-center gap-2">
                      <CreditCard size={16} />
                      <span className="text-[10px] font-black uppercase tracking-widest">
                        Obuna bilan ochish
                      </span>
                    </div>
                    <ChevronRight size={18} />
                  </Link>
                )}
              </div>

              {/* Premium Badge - Faqat pullik va qulflangan biletlar uchun */}
              {premiumUiEnabled && !ticket.is_demo && isLocked && (
                <div className="absolute top-0 right-10 transform -translate-y-1/2">
                  <span className="bg-amber-500 text-white text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-tighter shadow-lg shadow-amber-200">
                    Premium
                  </span>
                </div>
              )}
            </div>
            );
          })
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center bg-white dark:bg-slate-800 border-2 border-dashed border-slate-200 dark:border-slate-600 rounded-2xl md:rounded-[32px] py-12 md:py-16 text-center">
            <p className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-wide">Hali mavjud emas</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-md">Imtihon biletlari hozircha yuklanmagan. Tez orada yangi biletlarga tayyor turing.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
