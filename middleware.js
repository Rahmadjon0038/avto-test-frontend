import { NextResponse } from 'next/server'

export function middleware(request) {
  const token = request.cookies.get('accessToken')?.value
  const role = request.cookies.get('role')?.value // Role cookiesdan olinadi
  const { pathname } = request.nextUrl

  // 1. Auth sahifasi uchun tekshiruv (Login qilgan bo'lsa, ichkariga kirib ketadi)
  if (pathname.startsWith('/auth') && token) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // 2. Token bo'lmasa, auth sahifasiga yuborish
  if (!token && !pathname.startsWith('/auth')) {
    return NextResponse.redirect(new URL('/auth', request.url))
  }

  // 3. ADMIN PAGE himoyasi
  // Agar yo'l /admin bilan boshlansa va foydalanuvchi ADMIN bo'lmasa
  if (pathname.startsWith('/admin') && role !== 'admin') {
    // Uni bosh sahifaga yoki "Ruxsat yo'q" sahifasiga yuboramiz
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}