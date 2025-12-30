'use client'
import React from 'react';
import { Lock, ChevronRight, Sparkles, CreditCard } from 'lucide-react';
import Link from 'next/link';
import { usegetAlltikets } from '@/hooks/tickets';
import { Skeleton } from '@mui/material';

const HomePage = () => {
  const { data, isLoading, error } = usegetAlltikets();
  const skeletonArray = Array(8).fill(0);

  if (error) return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <p className="text-red-500 font-bold italic">Xatolik yuz berdi: {error.message}</p>
    </div>
  );

  return (
    <div className="min-h-screen mx-4 md:mx-12 bg-[#FDFDFD] py-10 px-4 sm:px-6">
      {/* Header */}
      <div className="mx-auto mb-10 flex flex-col md:flex-row md:items-end justify-between border-b border-slate-100 pb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">
            Imtihon biletlari
          </h1>
          <p className="text-xs text-slate-400 mt-2 font-bold tracking-[0.2em] uppercase">
            {isLoading ? <Skeleton width={80} /> : `Jami: ${data?.length || 0} ta bilet`}
          </p>
        </div>
        {!isLoading && (
          <Link href="/subscription" className="flex items-center gap-2 bg-amber-50 text-amber-700 px-4 py-2 rounded-xl border border-amber-100 hover:bg-amber-100 transition-all group">
            <Sparkles size={16} className="group-hover:rotate-12 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-widest">Premiumga o'tish</span>
          </Link>
        )}
      </div>

      {/* Grid Layout */}
      <div className="mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        
        {isLoading ? (
          skeletonArray.map((_, index) => (
            <div key={index} className="bg-white border-2 border-slate-50 rounded-[32px] p-6 shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <Skeleton variant="circular" width={44} height={44} />
                <Skeleton width="60%" height={25} />
              </div>
              <Skeleton width="100%" height={80} className="rounded-2xl" />
              <Skeleton width="100%" height={45} className="mt-6 rounded-xl" />
            </div>
          ))
        ) : (
          data?.map((ticket) => (
            <div 
              key={ticket.id} 
              className={`group flex flex-col bg-white border-2 rounded-[32px] p-6 transition-all duration-500 relative ${
                ticket.is_demo 
                ? 'border-slate-100 hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-500/10' 
                : 'border-amber-100/50 hover:border-amber-400 hover:shadow-2xl hover:shadow-amber-500/10 bg-gradient-to-b from-white to-amber-50/20'
              }`}
            >
              {/* Card Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 shrink-0 rounded-2xl flex items-center justify-center font-black text-lg transition-all duration-500 ${
                    ticket.is_demo 
                    ? 'bg-slate-900 text-white group-hover:bg-blue-600' 
                    : 'bg-amber-100 text-amber-600 group-hover:bg-amber-500 group-hover:text-white'
                  }`}>
                    {ticket.ticket_number}
                  </div>
                  <h3 className="font-black text-slate-800 text-sm uppercase leading-tight tracking-tight">
                    {ticket.name}
                  </h3>
                </div>
                {!ticket.is_demo && <Lock size={18} className="text-amber-400 mt-1" />}
              </div>

              {/* Description Section */}
              <div className="flex-1 mb-6">
                <div className="text-[12px] text-slate-500 font-medium leading-relaxed bg-white/50 p-4 rounded-2xl border border-slate-50 group-hover:border-slate-200 transition-all italic">
                  {ticket.description || "Ushbu bilet uchun qo'shimcha ma'lumot kiritilmagan."}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4">
                {ticket.is_demo ? (
                  <Link 
                    href={`/tikets/${ticket.ticket_number}`} 
                    className="flex justify-between items-center bg-slate-900 text-white px-5 py-4 rounded-2xl group-hover:bg-blue-600 transition-all duration-300 shadow-lg shadow-slate-100 group-hover:shadow-blue-200"
                  >
                    <span className="text-[10px] font-black uppercase tracking-widest">
                      Sinovni boshlash
                    </span>
                    <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                ) : (
                  <Link 
                    href="/subscription" 
                    className="flex justify-between items-center bg-amber-500 text-white px-5 py-4 rounded-2xl hover:bg-amber-600 transition-all duration-300 shadow-lg shadow-amber-100"
                  >
                    <div className="flex items-center gap-2">
                      <CreditCard size={16} />
                      <span className="text-[10px] font-black uppercase tracking-widest">
                        Obuna bo'lish
                      </span>
                    </div>
                    <ChevronRight size={18} />
                  </Link>
                )}
              </div>
              
              {/* Premium Badge for Non-Demo */}
              {!ticket.is_demo && (
                <div className="absolute top-0 right-10 transform -translate-y-1/2">
                   <span className="bg-amber-500 text-white text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-tighter shadow-lg shadow-amber-200">
                     Premium
                   </span>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HomePage;