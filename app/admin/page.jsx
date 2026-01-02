'use client'
import { usecreateTiket, usedeleteTiket, usegetAlltikets, useupdateTiket } from '@/hooks/tickets';
import Link from 'next/link';
import React, { useState } from 'react';
import { MdAdd, MdEdit, MdDelete, MdLibraryAdd, MdClose, MdLayers, MdHourglassEmpty, MdWarning } from 'react-icons/md';
import { Skeleton } from '@mui/material';
import { getNotify } from '@/hooks/notify';

const Admin = () => {
  const { data: tickets, isLoading, error } = usegetAlltikets();
  const [modal, setModal] = useState({ open: false, edit: false, data: {} });
  
  // O'chirish uchun alohida state
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null, name: '' });

  const notify = getNotify();
  const deleteTiketMutation = usedeleteTiket();
  const createMutation = usecreateTiket();
  const updateMutation = useupdateTiket();

  // O'chirish modalini ochish
  const confirmDelete = (ticket) => {
    setDeleteModal({ open: true, id: ticket.id, name: ticket.name });
  };

  // Haqiqiy o'chirish funksiyasi
  const handleFinalDelete = () => {
    if (!deleteModal.id) return;

    deleteTiketMutation.mutate({
      id: deleteModal.id,
      onSuccess: (data) => {
        notify('ok', data?.message || "Muvaffaqiyatli o'chirildi");
        setDeleteModal({ open: false, id: null, name: '' });
      },
      onError: (err) => {
        notify('err', err.response?.data?.message || "Xatolik yuz berdi");
        setDeleteModal({ open: false, id: null, name: '' });
      }
    });
  };

  const handleOpenModal = (edit = false, ticket = {}) => {
    setModal({
      open: true,
      edit: edit,
      data: edit ? { ...ticket } : {
        ticket_number: '',
        name: '',
        description: '',
        is_demo: false
      }
    });
  };

  const handleSave = (e) => {
    e.preventDefault();
    const payload = {
      ticket_number: Number(modal.data.ticket_number),
      name: modal.data.name,
      description: modal.data.description,
      is_demo: modal.data.is_demo
    };

    if (modal.edit) {
      updateMutation.mutate({
        id: modal.data.id,
        payload: payload,
        onSuccess: (data) => {
          notify('ok', data?.message || "Bilet muvaffaqiyatli yangilandi");
          setModal({ open: false, edit: false, data: {} });
        },
        onError: (err) => notify('err', err.response?.data?.message || "Yangilashda xatolik")
      });
    } else {
      createMutation.mutate({
        payload,
        onSuccess: (data) => {
          notify('ok', data?.message || "Muvaffaqiyatli yaratildi");
          setModal({ open: false, edit: false, data: {} });
        },
        onError: (err) => notify('err', err.response?.data?.message || "Yaratishda xatolik")
      });
    }
  };

  if (error) return <div className="p-10 text-red-500 font-bold text-center italic">Xatolik: {error.message}</div>;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans p-4 md:p-10">
      <div className="mx-4 md:mx-12">
        {/* Header Section */}
        <div className="mb-10">
          <p className="text-xs font-semibold tracking-widest text-blue-600 uppercase mb-2">Boshqaruv Paneli</p>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Biletlar Ro'yxati</h1>
            <button
              onClick={() => handleOpenModal(false)}
              className="flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 active:scale-95"
            >
              <MdAdd size={24} />
              <span className="font-bold uppercase text-xs tracking-widest">Yangi bilet yaratish</span>
            </button>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-5">
            <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl"><MdLayers size={28} /></div>
            <div>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Jami Biletlar</p>
              <p className="text-2xl font-black">{isLoading ? <Skeleton width={50} /> : `${tickets?.length || 0} ta`}</p>
            </div>
          </div>
        </div>

        {/* List Section */}
        <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden mb-20">
          <div className="divide-y divide-slate-50">
            {isLoading ? (
              [1, 2, 3, 4].map((i) => (
                <div key={i} className="p-8 flex items-center gap-6"><Skeleton variant="circular" width={40} height={40} /><div className="flex-1"><Skeleton width="40%" height={25} /></div></div>
              ))
            ) : tickets?.length > 0 ? (
              tickets.map((ticket) => (
                <div key={ticket.id} className="group flex flex-col md:flex-row md:items-center justify-between p-6 md:px-10 hover:bg-slate-50/80 transition-all">
                  <div className="flex items-center gap-8 mb-4 md:mb-0">
                    <span className="flex items-center justify-center w-12 h-12 rounded-2xl bg-slate-100 text-slate-800 font-black text-sm group-hover:bg-slate-900 group-hover:text-white transition-all">{ticket.ticket_number}</span>
                    <div className="flex flex-col gap-1">
                      <span className="font-bold text-slate-700 text-lg group-hover:text-blue-600 transition-colors uppercase tracking-tight">{ticket.name}</span>
                      <p className="text-sm text-slate-500 line-clamp-1 max-w-md">{ticket.description}</p>
                      <span className={`text-[9px] font-black uppercase w-fit px-2 py-0.5 rounded-lg border ${ticket.is_demo ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-slate-100 text-slate-400 border-slate-200'}`}>{ticket.is_demo ? 'Demo' : 'Premium'}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Link href={`/admin/tikets/${ticket.id}`} className="flex items-center gap-2 px-4 py-2 text-xs font-black uppercase bg-white border-2 border-slate-100 text-slate-600 rounded-xl hover:border-blue-600 transition-all"><MdLibraryAdd size={18} /> Testlar</Link>
                    <button onClick={() => handleOpenModal(true, ticket)} className="p-3 text-slate-300 hover:text-blue-600 hover:bg-blue-50 rounded-xl"><MdEdit size={22} /></button>
                    <button onClick={() => confirmDelete(ticket)} className="p-3 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-xl"><MdDelete size={22} /></button>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-20"><MdHourglassEmpty size={48} className="text-slate-200 mb-4" /><h3 className="text-xl font-black text-slate-400 uppercase">Biletlar mavjud emas</h3></div>
            )}
          </div>
        </div>
      </div>

      {/* --- DELETE CONFIRMATION MODAL --- */}
      {deleteModal.open && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 z-[100] animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-sm rounded-[32px] shadow-2xl p-8 text-center animate-in zoom-in duration-300">
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <MdWarning size={40} />
            </div>
            <h2 className="text-xl font-black text-slate-800 uppercase mb-2">O'chirishni tasdiqlaysizmi?</h2>
            <p className="text-slate-500 text-sm mb-8">
              Siz haqiqatdan ham <span className="font-bold text-slate-800">"{deleteModal.name}"</span> biletini o'chirib yubormoqchimisiz? Bu amalni ortga qaytarib bo'lmaydi.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteModal({ open: false, id: null, name: '' })}
                className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all"
              >
                Bekor qilish
              </button>
              <button
                onClick={handleFinalDelete}
                disabled={deleteTiketMutation.isPending}
                className="flex-1 py-4 bg-red-600 text-white rounded-2xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-200 disabled:opacity-50"
              >
                {deleteTiketMutation.isPending ? "O'chmoqda..." : "Ha, o'chirilsin"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- CREATE/EDIT MODAL --- */}
      {modal.open && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4 z-50 transition-all">
          <div className="bg-white w-full max-w-lg rounded-[40px] shadow-2xl p-8 md:p-10">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">{modal.edit ? "Biletni tahrirlash" : "Yangi bilet"}</h2>
              <button onClick={() => setModal({ ...modal, open: false })} className="p-2 hover:bg-slate-100 rounded-full"><MdClose size={24} /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-1">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Raqami</label>
                  <input type="number" required className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 outline-none focus:border-blue-600 font-bold"
                    value={modal.data.ticket_number} onChange={(e) => setModal({ ...modal, data: { ...modal.data, ticket_number: e.target.value } })} />
                </div>
                <div className="md:col-span-3">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Bilet nomi</label>
                  <input type="text" required className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 outline-none focus:border-blue-600 font-bold"
                    value={modal.data.name} onChange={(e) => setModal({ ...modal, data: { ...modal.data, name: e.target.value } })} />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Bilet tavsifi</label>
                <textarea rows="3" required className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 outline-none focus:border-blue-600 font-bold resize-none"
                  value={modal.data.description} onChange={(e) => setModal({ ...modal, data: { ...modal.data, description: e.target.value } })} />
              </div>
              <div onClick={() => setModal({ ...modal, data: { ...modal.data, is_demo: !modal.data.is_demo } })}
                className={`flex items-center justify-between p-5 rounded-3xl border-2 cursor-pointer transition-all ${modal.data.is_demo ? 'bg-blue-50 border-blue-200' : 'bg-slate-50 border-slate-100'}`}>
                <p className="text-sm font-black text-slate-700 uppercase">Demo rejim</p>
                <div className={`w-12 h-6 rounded-full relative ${modal.data.is_demo ? 'bg-blue-600' : 'bg-slate-300'}`}>
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${modal.data.is_demo ? 'right-1' : 'left-1'}`}></div>
                </div>
              </div>
              <div className="pt-4">
                <button type="submit" disabled={createMutation.isPending || updateMutation.isPending}
                  className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-600 transition-all disabled:opacity-50">
                  {createMutation.isPending || updateMutation.isPending ? "Saqlanmoqda..." : (modal.edit ? "Yangilash" : "Yaratish")}
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