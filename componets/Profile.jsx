'use client'
import * as React from 'react';
import { Box, Modal, Typography, Divider, Skeleton, Fade, Backdrop } from '@mui/material';
import { X, User, Phone, ShieldCheck, LogOut, Calendar, ChevronRight, BadgeCheck } from 'lucide-react';
import Cookies from 'js-cookie';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '95%', sm: 600 },
    bgcolor: '#F8FAFC',
    borderRadius: '32px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    p: 0,
    outline: 'none',
    overflow: 'hidden',
    border: '1px solid rgba(255, 255, 255, 0.3)',
};

export default function Profile({ children, profiledata }) {
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
                slots={{ backdrop: Backdrop }}
                slotProps={{
                    backdrop: {
                        timeout: 500,
                        sx: { backdropFilter: 'blur(8px)', backgroundColor: 'rgba(15, 23, 42, 0.4)' }
                    },
                }}
            >
                <Fade in={open}>
                    <Box sx={style}>
                        {/* Elegant Header */}
                        <div className="relative overflow-hidden bg-gradient-to-br from-[#1e293b] via-[#0f172a] to-[#1e293b] p-8 pb-10">
                            {/* Dekorativ aylana */}
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
                            
                            <button 
                                onClick={handleClose} 
                                className="absolute right-4 top-4 p-2 text-white/40 hover:text-white hover:bg-white/10 rounded-xl transition-all z-10"
                            >
                                <X size={20} />
                            </button>
                            
                            <div className="relative z-10 flex flex-col items-center text-center space-y-4">
                                <div className="relative">
                                    <div className="w-24 h-24 bg-gradient-to-tr from-blue-600 to-indigo-400 rounded-[30px] flex items-center justify-center shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500 border-4 border-white/10">
                                        {isLoading ? (
                                            <Skeleton variant="circular" width={60} height={60} sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
                                        ) : (
                                            <User size={48} className="text-white drop-shadow-md" strokeWidth={1.5} />
                                        )}
                                    </div>
                                    {!isLoading && data?.isSubscribed && (
                                        <div className="absolute -bottom-1 -right-1 bg-green-500 text-white p-1.5 rounded-full border-4 border-[#0f172a]">
                                            <BadgeCheck size={16} fill="currentColor" className="text-white" />
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-1">
                                    {isLoading ? (
                                        <Skeleton sx={{ bgcolor: 'grey.800' }} width={140} height={30} />
                                    ) : (
                                        <>
                                            <h2 className="text-2xl font-bold text-white tracking-tight leading-none">
                                                {data?.firstName} {data?.lastName}
                                            </h2>
                                            <p className="text-blue-300/60 text-xs font-mono tracking-[0.2em] uppercase">
                                                Member ID: {data?.id?.toString().padStart(5, '0')}
                                            </p>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Content Section */}
                        <div className="px-6 py-8 -mt-6 bg-[#F8FAFC] rounded-t-[32px] relative z-20 space-y-4">
                            
                            {/* Info Cards */}
                            <div className="space-y-3">
                                <InfoRow 
                                    icon={<Phone size={18} />} 
                                    label="Telefon raqam" 
                                    value={data?.phone} 
                                    isLoading={isLoading} 
                                />
                                <InfoRow 
                                    icon={<ShieldCheck size={18} />} 
                                    label="Hisob turi" 
                                    value={data?.isSubscribed ? 'Premium Plus' : 'Bepul Versiya'} 
                                    isLoading={isLoading}
                                    isStatus
                                    statusActive={data?.isSubscribed}
                                />
                                <InfoRow 
                                    icon={<Calendar size={18} />} 
                                    label="A'zolik sanasi" 
                                    value={new Date(data?.createdAt).toLocaleDateString('uz-UZ', { year: 'numeric', month: 'long', day: 'numeric' })} 
                                    isLoading={isLoading} 
                                />
                            </div>

                            <div className="pt-4">
                                <button 
                                    onClick={logout}
                                    className="w-full group flex items-center justify-between py-4 px-6 bg-white hover:bg-red-50 border border-slate-200 hover:border-red-100 rounded-2xl transition-all duration-300 shadow-sm"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-red-50 text-red-500 rounded-lg group-hover:bg-red-500 group-hover:text-white transition-colors">
                                            <LogOut size={18} />
                                        </div>
                                        <span className="font-bold text-slate-600 group-hover:text-red-600 transition-colors">Hisobdan chiqish</span>
                                    </div>
                                    <ChevronRight size={16} className="text-slate-300 group-hover:text-red-300 transition-colors" />
                                </button>
                            </div>
                        </div>
                    </Box>
                </Fade>
            </Modal>
        </div>
    );
}

// Yordamchi komponent - Qatorlar uchun
function InfoRow({ icon, label, value, isLoading, isStatus = false, statusActive = false }) {
    return (
        <div className="flex items-center gap-4 p-4 bg-white border border-slate-100 rounded-2xl shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
            <div className="w-10 h-10 shrink-0 bg-slate-50 rounded-xl flex items-center justify-center text-slate-500">
                {icon}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">{label}</p>
                {isLoading ? (
                    <Skeleton width="70%" height={20} />
                ) : (
                    <p className={`text-[15px] font-bold truncate ${isStatus ? (statusActive ? 'text-blue-600' : 'text-orange-500') : 'text-slate-700'}`}>
                        {value}
                    </p>
                )}
            </div>
        </div>
    );
}