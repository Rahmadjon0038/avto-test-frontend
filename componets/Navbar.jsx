'use client'
import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X, User, GraduationCap, History, Sun, Moon } from 'lucide-react';
import Profile from './Profile';
import { useGetMe } from '@/hooks/user';
import { useTheme } from './ThemeProvider';

const Navbar = () => {
  // ---- getme hook -----
  const { data, isLoading, error } = useGetMe()
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const isAdmin = data?.role === 'admin' || data?.isAdmin === true;

  const menuItems = [
    { name: 'Imtihon', href: '/exam', icon: <GraduationCap size={18} /> },
    { name: 'Xatolar ustida ishlash', href: '/errors', icon: <History size={18} /> },
    ...(isAdmin ? [{ name: 'Admin boshqaruvi', href: '/admin', icon: <User size={18} /> }] : []),
  ];

  return (
    <nav className="bg-white dark:bg-slate-800 border-b border-gray-100 dark:border-slate-700 sticky top-0 z-50 shadow-sm">
      <div className=" mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">

          {/* LOGO */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="bg-blue-600 text-white p-2 rounded-xl group-hover:bg-blue-700 transition-colors">
                <GraduationCap size={24} />
              </div>
              <span className="font-bold text-xl text-gray-800 dark:text-white tracking-tight">
                AVTO<span className="text-blue-600">TEST</span>
              </span>
            </Link>
          </div>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex gap-12 items-center space-x-6">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-1.5 text-gray-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-all"
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
          </div>

          {/* USER & STATUS */}
          <div className="hidden md:flex items-center space-x-4">
            
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Mavzuni almashtirish"
              className="flex items-center gap-2 px-3 py-2 rounded-full border border-gray-200 dark:border-slate-600 text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-all"
            >
              {theme === 'light' ? (
                <><Moon size={16} className="text-slate-500" /><span className="text-xs font-semibold uppercase tracking-wide">Tungi rejim</span></>
              ) : (
                <><Sun size={16} className="text-amber-400" /><span className="text-xs font-semibold uppercase tracking-wide">Kunduzgi rejim</span></>
              )}
            </button>

            <Profile profiledata={{ data, isLoading, error }}>
              <button className="flex items-center gap-2 bg-gray-50 dark:bg-slate-700 p-1.5 pr-4 rounded-full hover:bg-gray-100 dark:hover:bg-slate-600 transition-all border border-gray-200 dark:border-slate-600">
                <div className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 p-1.5 rounded-full">
                  <User size={18} />
                </div>
                <span className="text-sm font-semibold text-gray-700 dark:text-slate-200">Profil</span>
              </button>
            </Profile>
          </div>

          {/* MOBILE MENU BUTTON */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-all"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU PANEL */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-slate-800 border-t border-gray-100 dark:border-slate-700 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="px-4 pt-2 pb-6 space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-3 py-4 text-base font-semibold text-gray-700 dark:text-slate-200 border-b border-gray-50 dark:border-slate-700 last:border-0 active:bg-blue-50 dark:active:bg-slate-700"
              >
                <span className="text-blue-600 dark:text-blue-400">{item.icon}</span>
                {item.name}
              </Link>
            ))}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Mavzuni almashtirish"
              className="w-full flex items-center justify-center gap-2 border border-gray-200 dark:border-slate-600 rounded-xl py-3 text-sm font-semibold text-gray-700 dark:text-slate-200"
            >
              {theme === 'light' ? (
                <><Moon size={16} className="text-slate-500" /> Tungi rejim</>
              ) : (
                <><Sun size={16} className="text-amber-400" /> Kunduzgi rejim</>
              )}
            </button>
            <div className="pt-4 flex flex-col gap-3">
              <Profile profiledata={{ data, isLoading, error }}>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-full flex justify-center items-center gap-2 bg-blue-600 text-white py-3 rounded-xl font-bold"
                >
                  <User size={20} /> Profilni ochish
                </button>
              </Profile>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
