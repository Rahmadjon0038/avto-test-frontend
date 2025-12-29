import React from 'react';
import { Lock, PlayCircle, ChevronRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

const mockTickets = [
  { id: 3, ticket_number: 1, name: "1-bilet", is_demo: true, questions: 20 },
  { id: 2, ticket_number: 2, name: "2-bilet", is_demo: true, questions: 20 },
  { id: 4, ticket_number: 3, name: "3-bilet", is_demo: true, questions: 20 },
  { id: 5, ticket_number: 4, name: "4-bilet", is_demo: false, questions: 20 },
  { id: 6, ticket_number: 5, name: "5-bilet", is_demo: false, questions: 20 },
  { id: 7, ticket_number: 6, name: "6-bilet", is_demo: false, questions: 20 },
];

const HomePage = () => {
  return (
    <div className="min-h-screen mx-12 bg-[#FDFDFD] py-10 px-4 sm:px-6">
      {/* Kichikroq va ixcham Header */}
      <div className=" mx-auto mb-8 flex justify-between items-end border-b border-gray-100 pb-6">
        <div>
          <h1 className="text-xl font-black text-slate-800 uppercase tracking-tight">
            Imtihon biletlari
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-medium">Jami: 50 ta bilet</p>
        </div>
        <div className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg">
          Barcha savollar yangilangan 2025
        </div>
      </div>

      {/* Ixcham Grid Layout */}
      <div className="mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {mockTickets.map((ticket) => (
          <div 
            key={ticket.id} 
            className="group relative bg-white border-2 border-slate-300 rounded-2xl p-4 hover:border-blue-500 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 cursor-pointer"
          >
            <div className="flex items-center gap-4">
              {/* Raqam aylana ichida */}
              <div className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center font-black text-sm transition-colors ${
                ticket.is_demo 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
                : 'bg-slate-100 text-slate-400 group-hover:bg-slate-800 group-hover:text-white'
              }`}>
                {ticket.ticket_number}
              </div>

              {/* Matn qismi */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-700 truncate text-sm">
                    {ticket.name}
                  </h3>
                 
                </div>
                <p className="text-[11px] text-slate-400 font-medium">
                  {ticket.questions} ta savol
                </p>
              </div>

             
            </div>

            {/* Pastki yupqa chiziq yoki tugma o'rniga hoverda chiqadigan text */}
            {!ticket.is_demo && (
              <div className="mt-3 pt-3 border-t border-slate-50 flex justify-between items-center">
                <span className="text-[10px] font-bold text-slate-400 group-hover:text-amber-600 transition-colors">
                  OBUNA BO'LING
                </span>
                <ChevronRight size={14} className="text-slate-300 group-hover:text-amber-600" />
              </div>
            )}
            
            {ticket.is_demo && (
              <Link href={`/tikets/${ticket?.ticket_number}`} className="mt-3 pt-3 border-t border-slate-50 flex justify-between items-center">
                <span className="text-[10px] font-bold text-blue-600">
                  HOZIROQ BOSHLASH
                </span>
                <ChevronRight size={14} className="text-blue-600 group-hover:translate-x-1 transition-transform" />
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;