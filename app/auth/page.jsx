'use client'
import React, { useState } from 'react';
import { User, Phone, Lock, ArrowRight } from 'lucide-react';
import { uselogin, useRegister } from '@/hooks/auth';
import { getNotify } from '@/hooks/notify';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

const AuthPage = () => {
    // ----- register hook -----
    const registerMutation = useRegister();
    // ------- login hook ------
    const loginMutation = uselogin();
    // ------- notify ---------
    const notify = getNotify()
    // ------ navigate ----
    const navigate = useRouter()

    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isLogin) {
            const loginPayload = {
                phone: formData.phone,
                password: formData.password
            };
            loginMutation.mutate({
                loginPayload,
                onSuccess: (data) => {
                    console.log(data)
                    notify('ok', 'Tizimga kirish mofaqqiyatli')
                    Cookies.set('accessToken',data?.accessToken)
                    Cookies.set('refreshToken',data?.refreshToken)
                    Cookies.set('role',data?.role)
                    navigate.push('/')

                },
                onError: (err) => {
                    console.log(err)
                    notify('err', err.response.data.message)
                }
            })
        } else {
            registerMutation.mutate({
                formData,
                onSuccess: (data) => {
                    console.log(data)
                    notify('ok', data?.message)

                },
                onError: (err) => {
                    console.log(err)
                    notify('err', err.response.data.message)
                }
            })

        }
    };

    return (
        <div className="min-h-screen bg-[#F3F4F6] flex items-center justify-center p-6">
            <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
                {/* Tab Header */}
                <div className="flex border-b border-slate-100">
                    <button
                        onClick={() => setIsLogin(true)}
                        className={`flex-1 py-5 text-sm font-extrabold uppercase tracking-wider transition-all ${isLogin ? 'text-blue-600 border-b-4 border-blue-600 bg-blue-50/40' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        Kirish
                    </button>
                    <button
                        onClick={() => setIsLogin(false)}
                        className={`flex-1 py-5 text-sm font-extrabold uppercase tracking-wider transition-all ${!isLogin ? 'text-blue-600 border-b-4 border-blue-600 bg-blue-50/40' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        Ro'yxatdan o'tish
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-10 space-y-6">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-black text-slate-800 tracking-tight italic">
                            AVTO<span className="text-blue-600">TEST</span>
                        </h2>
                        <p className="text-sm text-slate-400 uppercase font-bold tracking-[0.2em] mt-2">
                            {isLogin ? "Profilingizga kiring" : "Yangi profil yarating"}
                        </p>
                    </div>

                    {!isLogin && (
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-400 uppercase tracking-wider">Ism</label>
                                <input
                                    name="firstName"
                                    type="text"
                                    required
                                    onChange={handleChange}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-5 pr-5 text-base focus:border-blue-500 outline-none transition-all"
                                    placeholder="Ali"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-400 uppercase tracking-wider">Familiya</label>
                                <input
                                    name="lastName"
                                    type="text"
                                    required
                                    onChange={handleChange}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-5 pr-5 text-base focus:border-blue-500 outline-none transition-all"
                                    placeholder="Valiyev"
                                />
                            </div>
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-400 uppercase tracking-wider">Telefon raqam</label>
                        <div className="relative flex items-center">
                            <Phone className="absolute left-5 text-slate-300" size={20} />
                            <input
                                name="phone"
                                type="tel"
                                required
                                onChange={handleChange}
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-14 pr-5 text-base focus:border-blue-500 outline-none font-mono transition-all"
                                placeholder="998901234567"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-400 uppercase tracking-wider">Parol</label>
                        <div className="relative flex items-center">
                            <Lock className="absolute left-5 text-slate-300" size={20} />
                            <input
                                name="password"
                                type="password"
                                required
                                onChange={handleChange}
                                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-14 pr-5 text-base focus:border-blue-500 outline-none transition-all"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-[#1E212B] text-white py-5 rounded-2xl font-bold text-base hover:bg-black transition-all shadow-xl flex items-center justify-center gap-4 active:scale-[0.97] mt-6"
                    >
                        {isLogin ? "TIZIMGA KIRISH" : "RO'YXATDAN O'TISH"}
                        <ArrowRight size={20} />
                    </button>
                </form>

                <div className="p-8 bg-slate-50 border-t border-slate-100 text-center">
                    <p className="text-sm text-slate-400 font-medium italic">
                        "Yo'l harakati qoidalarini biz bilan o'rganing"
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
