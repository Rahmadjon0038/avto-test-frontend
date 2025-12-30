'use client'
import { usePathname } from 'next/navigation';
import Navbar from './Navbar'; // Navbarni chaqiring

export default function NavbarWrapper() {
  const pathname = usePathname();
  
  // Navbar chiqmasligi kerak bo'lgan sahifalar
  const hideNavbarRoutes = ['/auth'];
  
  if (hideNavbarRoutes.includes(pathname)) {
    return null;
  }

  return <Navbar />;
}