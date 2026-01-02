'use client'
import { usedeletequestion, usegetQuestionTicketid } from "@/hooks/questions";
import { useParams } from "next/navigation";
import { useState, useRef } from "react";
import { MdEdit, MdDelete, MdAdd, MdArrowBack, MdHelpOutline, MdSave, MdClose, MdCloudUpload, MdImage } from 'react-icons/md';
import { Skeleton } from '@mui/material';
import Link from "next/link";
import AddQuestion from "@/componets/AddQuestionModal";
import { getNotify } from "@/hooks/notify";

const BASE_URL = "http://localhost:5000"; // Backend manzilingiz

const QuestionAdminPage = () => {
  const { id } = useParams();
  const { data, isLoading, error } = usegetQuestionTicketid(id);
  const deletemutation = usedeletequestion();
  const fileInputRef = useRef(null);
  const notify = getNotify();

  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(null);

  const startEdit = (question) => {
    setEditingId(question.id);
    setEditForm({ ...question });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditForm({ ...editForm, image: reader.result, imageFile: file });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (qId) => {
    console.log("🚀 Serverga yuborilmoqda:", editForm);
    // Bu yerda update mutation chaqirilishi kerak
    setEditingId(null);
  };

  const handleDelete = (id) => {
    if(window.confirm("Ushbu savolni o'chirishni tasdiqlaysizmi?")) {
        deletemutation.mutate({
          id,
          onSuccess: (data) => {
            notify('ok', data?.message || "Muvaffaqiyatli o'chirildi");
          },
          onError: (err) => {
            notify('err', "Savolni o'chirishda xatolik yuz berdi");
          }
        });
    }
  };

  if (error) return <div className="p-10 text-red-500 text-center font-bold">Xatolik: {error.message}</div>;

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 font-sans text-slate-900">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 sticky top-0 z-10 shadow-sm">
        <div className="mx-4 md:mx-12 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="p-2 hover:bg-slate-100 rounded-lg transition-all text-slate-600">
              <MdArrowBack size={22} />
            </Link>
            <h1 className="text-xl font-black text-slate-800 uppercase tracking-tight">
              {isLoading ? <Skeleton width={120} /> : data?.ticket_name}
            </h1>
          </div>
          
          <AddQuestion ticketId={id}>
            <button className="bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-all font-bold uppercase text-[10px] tracking-widest flex items-center gap-2 shadow-lg shadow-blue-100">
              <MdAdd size={18} /> Qo'shish
            </button>
          </AddQuestion>
        </div>
      </div>

      <div className="mx-4 md:mx-12 mt-6">
        <div className="grid grid-cols-1 gap-6">
          
          {isLoading ? (
            // Skeleton yuklanish holati
            [1, 2, 3].map((i) => (
                <div key={i} className="h-64 bg-white rounded-[32px] animate-pulse border border-slate-100 shadow-sm" />
            ))
          ) : data?.questions && data.questions.length > 0 ? (
            // Savollar ro'yxati
            data.questions.map((question, index) => (
              <div 
                key={question.id} 
                className={`bg-white rounded-[32px] border transition-all duration-300 overflow-hidden ${
                  editingId === question.id ? 'border-blue-500 shadow-2xl ring-4 ring-blue-50' : 'border-slate-100 shadow-sm hover:shadow-md'
                }`}
              >
                <div className="flex flex-col lg:flex-row min-h-[300px]">
                  
                  {/* --- IMAGE SECTION --- */}
                  <div className="lg:w-[400px] bg-slate-50 flex items-center justify-center border-b lg:border-b-0 lg:border-r border-slate-100 relative overflow-hidden group">
                    {editingId === question.id ? (
                      <div
                        onClick={() => fileInputRef.current.click()}
                        className="w-full h-full min-h-[250px] cursor-pointer flex flex-col items-center justify-center bg-white border-4 border-dashed border-blue-100 m-4 rounded-3xl hover:border-blue-300 transition-all"
                      >
                        {editForm.image ? (
                          <img src={editForm.image} className="w-full h-full object-contain p-2" alt="Preview" />
                        ) : (
                          <div className="text-center p-6">
                            <MdCloudUpload size={40} className="mx-auto text-blue-400 mb-2" />
                            <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Yangi rasm tanlash</p>
                          </div>
                        )}
                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} />
                      </div>
                    ) : (
                      question.image ? (
                        <img 
                          src={`${BASE_URL}${question.image}`} 
                          className="w-full h-full object-cover min-h-[250px]" 
                          alt="Savol rasmi"
                          crossOrigin="anonymous" // CORS muammosini hal qilish uchun
                        />
                      ) : (
                        <div className="flex flex-col items-center text-slate-200 py-12">
                          <MdImage size={80} />
                          <span className="text-[10px] uppercase font-black tracking-widest mt-2">Rasm mavjud emas</span>
                        </div>
                      )
                    )}
                  </div>

                  {/* --- CONTENT SECTION --- */}
                  <div className="flex-1 p-6 md:p-8 flex flex-col">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-2">
                         <span className="bg-slate-900 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg shadow-slate-200">
                           Savol #{index + 1}
                         </span>
                      </div>
                      
                      <div className="flex gap-2">
                        {editingId === question.id ? (
                          <>
                            <button onClick={() => handleSave(question.id)} className="flex items-center gap-2 px-5 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all font-black text-[10px] uppercase tracking-widest shadow-lg shadow-green-100">
                              <MdSave size={18} /> Saqlash
                            </button>
                            <button onClick={cancelEdit} className="p-2 bg-slate-100 text-slate-500 rounded-xl hover:bg-slate-200 transition-all">
                              <MdClose size={22} />
                            </button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => startEdit(question)} className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                              <MdEdit size={22} />
                            </button>
                            <button onClick={() => handleDelete(question.id)} className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                              <MdDelete size={22} />
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Savol Matni */}
                    {editingId === question.id ? (
                      <textarea
                        className="w-full text-lg font-bold text-slate-800 mb-6 p-4 border-2 border-blue-100 rounded-2xl outline-none focus:border-blue-500 bg-blue-50/10 transition-all"
                        value={editForm.questionText}
                        onChange={(e) => setEditForm({ ...editForm, questionText: e.target.value })}
                        rows={3}
                      />
                    ) : (
                      <h2 className="text-xl md:text-2xl font-black text-slate-800 mb-8 leading-tight tracking-tight">
                        {question.questionText}
                      </h2>
                    )}

                    {/* Variantlar Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
                      {(editingId === question.id ? editForm.options : question.options).map((option, idx) => (
                        <div
                          key={idx}
                          className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-200 ${
                            editingId === question.id
                              ? (idx === editForm.correctOption ? 'border-green-500 bg-green-50 shadow-sm' : 'border-slate-100 bg-white')
                              : (idx === question.correctOption ? 'border-green-200 bg-green-50/50 text-green-700' : 'border-slate-50 bg-slate-50/30 text-slate-400')
                          }`}
                        >
                          {editingId === question.id ? (
                            <>
                              <input 
                                type="radio" 
                                checked={idx === editForm.correctOption} 
                                onChange={() => setEditForm({ ...editForm, correctOption: idx })} 
                                className="w-5 h-5 accent-green-600 cursor-pointer" 
                              />
                              <input 
                                type="text" 
                                className="flex-1 bg-transparent outline-none text-sm font-bold text-slate-700" 
                                value={option} 
                                onChange={(e) => {
                                  const newOpts = [...editForm.options];
                                  newOpts[idx] = e.target.value;
                                  setEditForm({ ...editForm, options: newOpts });
                                }} 
                              />
                            </>
                          ) : (
                            <div className="flex items-center gap-3">
                              <span className={`w-6 h-6 flex items-center justify-center rounded-lg text-[10px] font-black shadow-sm ${
                                idx === question.correctOption ? 'bg-green-500 text-white' : 'bg-white text-slate-400 border border-slate-100'
                              }`}>
                                {String.fromCharCode(65 + idx)}
                              </span>
                              <span className="text-sm font-bold">{option}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Izoh qismi */}
                    <div className="mt-auto pt-6 border-t border-slate-50 flex gap-4 items-start">
                      <div className="p-2 bg-blue-50 rounded-xl text-blue-500">
                        <MdHelpOutline size={20} />
                      </div>
                      <div className="flex-1">
                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-1">Tushuntirish</p>
                        {editingId === question.id ? (
                          <textarea 
                            className="w-full text-sm font-medium bg-blue-50/30 border-b-2 border-blue-100 focus:border-blue-400 outline-none py-2 px-1 transition-all italic" 
                            value={editForm.explanation} 
                            onChange={(e) => setEditForm({ ...editForm, explanation: e.target.value })} 
                            rows={2} 
                          />
                        ) : (
                          <p className="text-sm text-slate-500 font-medium italic leading-relaxed">
                            {question.explanation || "Bu savol uchun tushuntirish kiritilmagan."}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            // --- EMPTY STATE: Savollar mavjud emas ---
            <div className="bg-white border-2 border-dashed border-slate-200 rounded-[40px] py-24 px-10 flex flex-col items-center justify-center text-center shadow-sm">
                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-8">
                    <MdImage size={48} className="text-slate-200" />
                </div>
                <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight mb-3">
                    Biletda savollar yo'q
                </h3>
                <p className="text-slate-400 max-w-sm mb-10 font-medium leading-relaxed">
                    Hozircha ushbu bilet bo'sh turibdi. Quyidagi tugma orqali birinchi savolni qo'shishingiz mumkin.
                </p>
                <AddQuestion ticketId={id}>
                    <button className="flex items-center gap-3 bg-slate-900 text-white px-10 py-5 rounded-[20px] font-black uppercase text-xs tracking-[0.2em] hover:bg-blue-600 transition-all shadow-2xl shadow-slate-200 group">
                        <MdAdd size={22} className="group-hover:rotate-90 transition-all duration-300" /> Birinchi savolni yaratish
                    </button>
                </AddQuestion>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionAdminPage;