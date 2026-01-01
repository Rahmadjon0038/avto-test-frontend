'use client'
import * as React from 'react';
import { Box, Modal, Fade, Backdrop } from '@mui/material';
import { X, ShieldCheck, ArrowRight, Zap, BookOpen, Ban, Headphones } from 'lucide-react';
import { usepayTiket } from '@/hooks/pay';
import { getNotify } from '@/hooks/notify';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '95%', sm: 500 },
    bgcolor: '#FFFFFF',
    borderRadius: '32px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    p: 0,
    outline: 'none',
    overflow: 'hidden',
};

export default function PayModal({ children }) {
    const [open, setOpen] = React.useState(false);
    const [selectedMethod, setSelectedMethod] = React.useState(null);
    // -------- pay hook ---------
    const payMutation = usepayTiket();
    // -------- noify hook ---------
    const notify = getNotify();

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setSelectedMethod(null);
    };

    const paydata = { amount: 50000, paymentMethod: selectedMethod };
    console.log("🚀 Backendga yuborilmoqda:", paydata);

    const handleFinalPay = () => {
        payMutation.mutate({
            paydata,
            onSuccess: (data) => {
                notify('ok', data?.message || "Muvaffaqiyatli To'landi");
                handleClose();
            },
            onError: (err) => notify('err', err.response?.data?.message || "To'lashda xatolik")
        });

    };

    return (
        <div>
            <div onClick={handleOpen} className="cursor-pointer">{children}</div>
            <Modal
                open={open}
                onClose={handleClose}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{
                    backdrop: {
                        timeout: 500,
                        sx: { backdropFilter: 'blur(12px)', backgroundColor: 'rgba(15, 23, 42, 0.4)' }
                    },
                }}
            >
                <Fade in={open}>
                    <Box sx={style}>
                        {/* Header Section */}
                        <div className="bg-slate-50 border-b border-slate-100 p-8 flex justify-between items-start">
                            <div>
                                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Premium Obuna</h2>
                                <p className="text-sm text-slate-500 mt-1">Imtihonni birinchi urinishda topshiring!</p>
                            </div>
                            <button onClick={handleClose} className="p-2 hover:bg-white hover:shadow-md rounded-full transition-all text-slate-400">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-8">
                            {/* Key Benefits - IMKONIYaTLAR */}
                            <div className="space-y-4 mb-8">
                                <div className="flex items-start gap-4">
                                    <div className="bg-blue-100 p-2 rounded-xl text-blue-600">
                                        <BookOpen size={18} />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-800">Barcha biletlar ochiq</h4>
                                        <p className="text-[11px] text-slate-500">800 tadan ortiq rasmiy va yangilangan savollar to'plami.</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="bg-amber-100 p-2 rounded-xl text-amber-600">
                                        <Zap size={18} />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-800">Ekspert tushuntirishlari</h4>
                                        <p className="text-[11px] text-slate-500">Har bir xato javobingiz uchun qoidalarning batafsil izohi.</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="bg-red-100 p-2 rounded-xl text-red-600">
                                        <Ban size={18} />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-800">Reklamasiz interfeys</h4>
                                        <p className="text-[11px] text-slate-500">Hech qanday chalg'ituvchi reklamalarsiz test yechish imkoniyati.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Method Selection */}
                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <div
                                    onClick={() => setSelectedMethod('Click')}
                                    className={`cursor-pointer border-2 rounded-2xl  transition-all flex flex-col items-center justify-center gap-2 ${selectedMethod === 'Click' ? 'border-blue-500 bg-blue-50' : 'border-slate-100'
                                        }`}
                                >
                                    <img src="https://www.ictweek.uz/uploads/F5Q8C3029/click-01.png" className="w-24" alt="Click" />
                                </div>

                                <div
                                    onClick={() => setSelectedMethod('Payme')}
                                    className={`cursor-pointer border-2 rounded-2xl  transition-all flex flex-col items-center justify-center gap-2 ${selectedMethod === 'Payme' ? 'border-cyan-500 bg-cyan-50' : 'border-slate-100'
                                        }`}
                                >
                                    <img src="https://api.logobank.uz/media/logos_png/payme-01.png" className="w-24" alt="Payme" />
                                </div>
                            </div>

                            {/* Action Button */}
                            <button
                                disabled={!selectedMethod}
                                onClick={handleFinalPay}
                                className={`w-full flex items-center justify-center gap-3 py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${selectedMethod
                                    ? 'bg-slate-900 text-white hover:bg-slate-800 hover:scale-[1.02] shadow-xl'
                                    : 'bg-slate-100 text-slate-300 cursor-not-allowed'
                                    }`}
                            >
                                50,000 UZS TO'LOV QILISH <ArrowRight size={18} />
                            </button>
                        </div>

                        {/* Footer Security */}
                        <div className="bg-slate-50 p-4 flex items-center justify-center gap-2 text-slate-400">
                            <ShieldCheck size={14} />
                            <span className="text-[10px] font-semibold italic">Xavfsiz tranzaksiya kafolati</span>
                        </div>
                    </Box>
                </Fade>
            </Modal>
        </div>
    );
}