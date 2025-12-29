'use client'
import Link from 'next/link';
import React, { useState } from 'react';
import { MdAdd, MdEdit, MdDelete, MdVisibility, MdLibraryAdd, MdClose, MdLayers } from 'react-icons/md';

const Admin = () => {
  const [tickets, setTickets] = useState([
    { id: 1, ticket_number: 1, name: "Matematika fanidan 1-bilet", is_demo: true },
    { id: 2, ticket_number: 2, name: "Tarix fanidan 2-bilet", is_demo: false },
  ]);

  const [modal, setModal] = useState({ open: false, edit: false, data: {} });

  const logAction = (type, id, data = null) => {
    console.log(`Action: ${type} | ID: ${id}`, data ? `| Data: ${JSON.stringify(data)}` : "");
  };

  const handleOpenModal = (edit = false, ticket = {}) => {
    setModal({
      open: true,
      edit: edit,
      data: edit ? ticket : { ticket_number: '', name: '', is_demo: false }
    });
  };

  const handleSave = (e) => {
    e.preventDefault();
    logAction(modal.edit ? "SAVE_EDIT" : "SAVE_NEW", modal.data.id || "NEW", modal.data);
    setModal({ ...modal, open: false });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans p-4 md:p-10">
      <div className="mx-12">
        
        {/* Breadcrumb & Header */}
        <div className="mb-10">
          <p className="text-xs font-semibold tracking-widest text-blue-600 uppercase mb-2">Boshqaruv Paneli</p>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h1 className="text-3xl font-bold text-slate-800">Biletlar Ro'yxati</h1>
            <button 
              onClick={() => handleOpenModal(false)}
              className="flex items-center justify-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 active:scale-95"
            >
              <MdAdd size={22} />
              <span className="font-medium">Yangi bilet yaratish</span>
            </button>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><MdLayers size={24} /></div>
              <div>
                <p className="text-sm text-slate-500 font-medium">Jami Biletlar</p>
                <p className="text-2xl font-bold">{tickets.length} ta</p>
              </div>
            </div>
          </div>
        </div>

        {/* List Table Header */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="hidden md:flex items-center justify-between px-8 py-4 bg-slate-50/50 border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
            <div className="flex gap-12">
              <span className="w-12">No.</span>
              <span>Bilet nomi va holati</span>
            </div>
            <span>Amallar</span>
          </div>

          {/* List Items */}
          <div className="divide-y divide-slate-50">
            {tickets.map((ticket) => (
              <div key={ticket.id} className="group flex flex-col md:flex-row md:items-center justify-between p-6 md:px-8 hover:bg-slate-50/80 transition-all">
                <div className="flex items-center gap-6 mb-4 md:mb-0">
                  <span className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 text-slate-600 font-mono text-sm font-bold">
                    {ticket.ticket_number}
                  </span>
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold text-slate-700 text-lg group-hover:text-blue-600 transition-colors tracking-tight">
                      {ticket.name}
                    </span>
                    {ticket.is_demo ? (
                      <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase w-fit bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-md border border-emerald-100">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> Demo versiya
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold uppercase w-fit bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md">Premium</span>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Link href={`/admin/tikets/${ticket.ticket_number}`}
                    onClick={() => logAction("ADD_TEST", ticket.id)} 
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-white border border-slate-200 text-slate-600 rounded-lg hover:border-green-500 hover:text-green-600 hover:bg-green-50 transition-all"
                  >
                    <MdLibraryAdd size={16} /> Test qo'shish
                  </Link>
                  
                  

                  <button 
                    onClick={() => handleOpenModal(true, ticket)} 
                    className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                    title="Tahrirlash"
                  >
                    <MdEdit size={20} />
                  </button>
                  
                  <button 
                    onClick={() => logAction("DELETE", ticket.id)} 
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    title="O'chirish"
                  >
                    <MdDelete size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal - Yaxshilangan animatsiya va ko'rinish */}
      {modal.open && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-8 transform transition-all">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-800">
                {modal.edit ? "Biletni tahrirlash" : "Yangi bilet yaratish"}
              </h2>
              <button onClick={() => setModal({ ...modal, open: false })} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <MdClose size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">Bilet tartib raqami</label>
                <input 
                  type="number" 
                  placeholder="Masalan: 5"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                  value={modal.data.ticket_number}
                  onChange={(e) => setModal({...modal, data: {...modal.data, ticket_number: e.target.value}})}
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">Biletning to'liq nomi</label>
                <input 
                  type="text" 
                  placeholder="Masalan: 5-bilet (Ingliz tili)"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                  value={modal.data.name}
                  onChange={(e) => setModal({...modal, data: {...modal.data, name: e.target.value}})}
                />
              </div>

              <label className="flex items-center gap-3 cursor-pointer p-4 bg-slate-50 rounded-xl border border-slate-100 hover:bg-slate-100 transition-colors">
                <input 
                  type="checkbox" 
                  className="w-5 h-5 rounded-md border-slate-300 accent-slate-900"
                  checked={modal.data.is_demo}
                  onChange={(e) => setModal({...modal, data: {...modal.data, is_demo: e.target.checked}})}
                />
                <div>
                  <p className="text-sm font-bold text-slate-700">Demo sifatida belgilash</p>
                  <p className="text-xs text-slate-500">Ushbu bilet hamma uchun ochiq bo'ladi</p>
                </div>
              </label>
              
              <div className="pt-4 flex gap-3">
                 <button 
                  type="button"
                  onClick={() => setModal({ ...modal, open: false })}
                  className="flex-1 bg-slate-100 text-slate-600 py-3.5 rounded-xl text-sm font-bold hover:bg-slate-200 transition-colors"
                >
                  Bekor qilish
                </button>
                <button 
                  type="submit" 
                  className="flex-[2] bg-slate-900 text-white py-3.5 rounded-xl text-sm font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
                >
                  {modal.edit ? "O'zgarishlarni saqlash" : "Biletni yaratish"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;