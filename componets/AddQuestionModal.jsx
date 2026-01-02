'use client'
import * as React from 'react';
import { Box, Modal, Backdrop } from '@mui/material';
import { MdClose, MdCloudUpload, MdHelpOutline, MdSave, MdCancel, MdAdd, MdDeleteOutline } from 'react-icons/md';
import { useAddQuestion } from '@/hooks/questions';
import { getNotify } from '@/hooks/notify';
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '95%', sm: 800 },
    maxHeight: '92vh',
    bgcolor: '#F8FAFC',
    borderRadius: '24px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    outline: 'none',
    overflowY: 'auto',
};

export default function AddQuestion({ children, ticketId }) {
    const [open, setOpen] = React.useState(false);
    const fileInputRef = React.useRef(null);
    const addmutation = useAddQuestion();
    const notify = getNotify();

    const [formData, setFormData] = React.useState({
        questionText: '',
        options: ['', ''], // Kamida 2 ta variant bilan boshlanadi
        correctOption: 0,
        explanation: '',
        imageFile: null,
        imagePreview: null
    });

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setFormData({ questionText: '', options: ['', ''], correctOption: 0, explanation: '', imageFile: null, imagePreview: null });
    };

    // Variant qo'shish
    const addOption = () => {
        setFormData({ ...formData, options: [...formData.options, ''] });
    };

    // Variantni o'chirish
    const removeOption = (index) => {
        if (formData.options.length <= 2) return; // 2 tadan kam bo'lmasligi kerak
        const newOptions = formData.options.filter((_, i) => i !== index);

        // Agar o'chirilayotgan variant to'g'ri javob bo'lsa, birinchisini to'g'ri deb belgilaymiz
        let newCorrect = formData.correctOption;
        if (index === formData.correctOption) {
            newCorrect = 0;
        } else if (index < formData.correctOption) {
            newCorrect = formData.correctOption - 1;
        }

        setFormData({ ...formData, options: newOptions, correctOption: newCorrect });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, imageFile: file, imagePreview: URL.createObjectURL(file) });
        }
    };

    const removeImage = (e) => {
        e.stopPropagation();
        setFormData({ ...formData, imageFile: null, imagePreview: null });
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // FormData - bu binary fayllarni yuborish uchun standart usul
        const dataToSend = new FormData();

        // 1. ticketId (integer kabi ketadi)
        dataToSend.append('ticketId', ticketId);

        // 2. questionText (string)
        dataToSend.append('questionText', formData.questionText);

        // 3. correctOption (integer)
        dataToSend.append('correctOption', formData.correctOption);

        // 4. explanation (string)
        dataToSend.append('explanation', formData.explanation);

        // 5. options (JSON string sifatida - Swagger so'ragandek)
        // Bo'sh variantlarni yubormaslik uchun filtrlaymiz
        const filteredOptions = formData.options.filter(opt => opt.trim() !== '');
        dataToSend.append('options', JSON.stringify(filteredOptions));

        // 6. image (string($binary) - haqiqiy fayl obyekti)
        if (formData.imageFile) {
            dataToSend.append('image', formData.imageFile);
        }

        addmutation.mutate({
            formData: dataToSend,
            onSuccess: (data) => {
                console.log(data)
                notify('ok', "Test qo'shildi")
                setOpen(false);
            },
            onError: (err) => {
                console.log(err)
                notify('err', "Test qo'shil xatolik")
            }
        })
    };
    return (
        <>
            <div onClick={handleOpen} className="inline-block cursor-pointer">
                {children}
            </div>

            <Modal
                open={open}
                onClose={handleClose}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{ backdrop: { timeout: 500, sx: { backdropFilter: 'blur(4px)', backgroundColor: 'rgba(15, 23, 42, 0.3)' } } }}
            >
                <Box sx={style}>
                    <div className="bg-white px-6 py-4 border-b border-slate-100 flex justify-between items-center sticky top-0 z-10">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-5 bg-blue-600 rounded-full"></div>
                            <h2 className="text-[13px] font-black text-slate-800 uppercase tracking-widest">Yangi savol</h2>
                        </div>
                        <button onClick={handleClose} className="p-1.5 hover:bg-slate-100 rounded-lg transition-all text-slate-400">
                            <MdClose size={20} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Chap tomon */}
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Savol matni *</label>
                                    <textarea
                                        required
                                        rows={4}
                                        className="w-full text-[13px] font-bold p-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-blue-500 transition-all shadow-sm"
                                        placeholder="Savol matnini kiriting..."
                                        value={formData.questionText}
                                        onChange={(e) => setFormData({ ...formData, questionText: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Rasm yuklash</label>
                                    <div
                                        onClick={() => !formData.imagePreview && fileInputRef.current.click()}
                                        className={`w-full h-32 border-2 border-dashed rounded-xl flex flex-col items-center justify-center bg-slate-50 transition-all overflow-hidden relative ${!formData.imagePreview ? 'border-slate-200 hover:bg-blue-50 cursor-pointer' : 'border-blue-200'}`}
                                    >
                                        {formData.imagePreview ? (
                                            <>
                                                <img src={formData.imagePreview} className="h-full w-full object-contain p-1" alt="Preview" />
                                                <button type="button" onClick={removeImage} className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-lg shadow-lg hover:bg-red-600 transition-all z-20">
                                                    <MdCancel size={18} />
                                                </button>
                                            </>
                                        ) : (
                                            <div className="flex flex-col items-center text-slate-400">
                                                <MdCloudUpload size={22} />
                                                <span className="text-[9px] font-bold mt-1 uppercase">Tanlash</span>
                                            </div>
                                        )}
                                        <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleImageChange} />
                                    </div>
                                </div>
                            </div>

                            {/* O'ng tomon: Dinamik variantlar */}
                            <div className="space-y-3">
                                <div className="flex justify-between items-center ml-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Javoblar *</label>
                                    <button
                                        type="button"
                                        onClick={addOption}
                                        className="text-[10px] font-black text-blue-600 uppercase hover:text-blue-700 flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-lg transition-all"
                                    >
                                        <MdAdd size={14} /> Qo'shish
                                    </button>
                                </div>

                                <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1 custom-scrollbar">
                                    {formData.options.map((opt, idx) => (
                                        <div key={idx} className={`flex items-center gap-2 p-2 rounded-xl border transition-all group ${formData.correctOption === idx ? 'border-green-500 bg-green-50 ring-1 ring-green-100' : 'border-slate-100 bg-white'}`}>
                                            <input
                                                type="radio"
                                                name="correct"
                                                checked={formData.correctOption === idx}
                                                onChange={() => setFormData({ ...formData, correctOption: idx })}
                                                className="w-4 h-4 accent-green-600 cursor-pointer"
                                            />
                                            <input
                                                required
                                                type="text"
                                                className="flex-1 bg-transparent outline-none text-[12px] font-bold text-slate-700"
                                                placeholder={`Variant ${idx + 1}`}
                                                value={opt}
                                                onChange={(e) => {
                                                    const newOpts = [...formData.options];
                                                    newOpts[idx] = e.target.value;
                                                    setFormData({ ...formData, options: newOpts });
                                                }}
                                            />
                                            {formData.options.length > 2 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeOption(idx)}
                                                    className="p-1 text-slate-300 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
                                                >
                                                    <MdDeleteOutline size={18} />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Izoh */}
                        <div className="mt-6 space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1 ml-1">
                                <MdHelpOutline size={14} className="text-blue-500" /> Tushuntirish
                            </label>
                            <textarea
                                rows={2}
                                className="w-full p-3 bg-blue-50/20 border border-blue-100 rounded-xl outline-none text-[12px] font-medium text-slate-600 italic"
                                placeholder="Nima uchun bu javob to'g'ri? (ixtiyoriy)..."
                                value={formData.explanation}
                                onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                            />
                        </div>

                        <div className="mt-8 pt-4 border-t border-slate-100 flex gap-3">
                            <button type="button" onClick={handleClose} className="flex-1 px-4 py-3 rounded-xl font-bold text-[11px] text-slate-500 hover:bg-slate-100 transition-all uppercase tracking-widest">
                                Bekor qilish
                            </button>
                            <button type="submit" className="flex-[2] bg-slate-900 text-white py-3 rounded-xl font-black uppercase text-[11px] tracking-widest hover:bg-blue-600 transition-all flex items-center justify-center gap-2 shadow-lg">
                                <MdSave size={18} /> Saqlash
                            </button>
                        </div>
                    </form>
                </Box>
            </Modal>
        </>
    );
}