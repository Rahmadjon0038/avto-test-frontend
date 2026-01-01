'use client'
import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X, User, BookOpen, GraduationCap, History, CreditCard } from 'lucide-react';
import Profile from './Profile';
import { useGetMe } from '@/hooks/user';

const Navbar = () => {
  // ---- getme hook -----
  const { data, isLoading, error } = useGetMe()
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { name: 'Imtihon', href: '/exam', icon: <GraduationCap size={18} /> },
    { name: 'Xatolar ustida ishlash', href: '/errors', icon: <History size={18} /> },
  ];

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className=" mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">

          {/* LOGO */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="bg-blue-600 text-white p-2 rounded-xl group-hover:bg-blue-700 transition-colors">
                <GraduationCap size={24} />
              </div>
              <span className="font-bold text-xl text-gray-800 tracking-tight">
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
                className="flex items-center gap-1.5 text-gray-600 hover:text-blue-600 font-medium transition-all"
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
          </div>

          {/* USER & STATUS */}
          <div className="hidden md:flex items-center space-x-4">
            

            <Profile profiledata={{ data, isLoading, error }}>
              <button className="flex items-center gap-2 bg-gray-50 p-1.5 pr-4 rounded-full hover:bg-gray-100 transition-all border border-gray-200">
                <div className="bg-blue-100 text-blue-600 p-1.5 rounded-full">
                  <User size={18} />
                </div>
                <span className="text-sm font-semibold text-gray-700">Profil</span>
              </button>
            </Profile>
          </div>

          {/* MOBILE MENU BUTTON */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-all"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU PANEL */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="px-4 pt-2 pb-6 space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-3 py-4 text-base font-semibold text-gray-700 border-b border-gray-50 last:border-0 active:bg-blue-50"
              >
                <span className="text-blue-600">{item.icon}</span>
                {item.name}
              </Link>
            ))}
            <div className="pt-4 flex flex-col gap-3">
              <Link
                href="/profile"
                className="w-full flex justify-center items-center gap-2 bg-blue-600 text-white py-3 rounded-xl font-bold"
              >
                <User size={20} /> Profilga o'tish
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;