'use client'
import * as React from 'react';
import { Box, Modal, Typography, Divider, Skeleton, Fade } from '@mui/material';
import { X, User, Phone, ShieldCheck, LogOut, Calendar, Clock } from 'lucide-react';
import Cookies from 'js-cookie';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '92%', sm: 420 },
    bgcolor: 'white',
    borderRadius: '28px',
    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    p: 0,
    outline: 'none',
    overflow: 'hidden'
};

export default function Profile({ children, profiledata }) {
    // profiledata ichidan kerakli narsalarni olamiz
    const { data, isLoading } = profiledata;
    const [open, setOpen] = React.useState(false);
    
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const logout = () => {
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');
        Cookies.remove('role');
        window.location.href = '/auth';
    };

    return (
        <div>
            <div onClick={handleOpen} className="cursor-pointer">{children}</div>
            <Modal 
                open={open} 
                onClose={handleClose}
                closeAfterTransition
            >
                <Fade in={open}>
                    <Box sx={style}>
                        {/* Header Section */}
                        <div className="bg-[#1E212B] p-8 text-white relative">
                            <button 
                                onClick={handleClose} 
                                className="absolute right-5 top-5 p-1 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-all"
                            >
                                <X size={20} />
                            </button>
                            
                            <div className="flex items-center gap-5 mt-2">
                                <div className="w-20 h-20 bg-blue-600 rounded-[22px] flex items-center justify-center shadow-lg shadow-blue-900/20 border-2 border-white/10 text-white">
                                    {isLoading ? <Skeleton variant="circular" width={40} height={40} /> : <User size={40} strokeWidth={1.5} />}
                                </div>
                                <div className="space-y-1">
                                    {isLoading ? (
                                        <>
                                            <Skeleton sx={{ bgcolor: 'grey.800' }} width={120} height={25} />
                                            <Skeleton sx={{ bgcolor: 'grey.800' }} width={80} height={15} />
                                        </>
                                    ) : (
                                        <>
                                            <Typography variant="h6" className="font-black leading-tight tracking-tight">
                                                {data?.firstName} <br /> {data?.lastName}
                                            </Typography>
                                            <div className="inline-flex px-2 py-0.5 bg-blue-500/20 rounded-md">
                                                <span className="text-[10px] font-black uppercase tracking-[0.15em] text-blue-400">
                                                    ID: {data?.id}
                                                </span>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Info Section */}
                        <div className="p-8 space-y-6 bg-white">
                            <div className="grid gap-5">
                                {/* Telefon raqam */}
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                                        <Phone size={18} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Telefon</p>
                                        {isLoading ? <Skeleton width="60%" /> : <p className="text-sm font-bold text-slate-700">{data?.phone}</p>}
                                    </div>
                                </div>

                                {/* Obuna holati */}
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${data?.isSubscribed ? 'bg-green-50 text-green-500' : 'bg-orange-50 text-orange-500'}`}>
                                        <ShieldCheck size={18} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Obuna holati</p>
                                        {isLoading ? <Skeleton width="40%" /> : (
                                            <p className={`text-sm font-bold ${data?.isSubscribed ? 'text-green-600' : 'text-orange-500'}`}>
                                                {data?.isSubscribed ? 'Premium Faol' : 'Demo Versiya'}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Ro'yxatdan o'tgan sana */}
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                                        <Calendar size={18} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ro'yxatdan o'tish</p>
                                        {isLoading ? <Skeleton width="50%" /> : (
                                            <p className="text-sm font-bold text-slate-700">
                                                {new Date(data?.createdAt).toLocaleDateString('uz-UZ')}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <Divider sx={{ borderStyle: 'dashed', my: 1 }} />

                            {/* Logout tugmasi */}
                            <button 
                                onClick={logout}
                                className="w-full flex items-center justify-center gap-3 py-4 px-4 bg-slate-50 hover:bg-red-50 hover:text-red-600 text-slate-500 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-[0.98]"
                            >
                                <LogOut size={18} /> 
                                Hisobdan chiqish
                            </button>
                        </div>
                    </Box>
                </Fade>
            </Modal>
        </div>
    );
}