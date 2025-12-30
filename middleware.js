import { NextResponse } from 'next/server'

export function middleware(request) {
  // Cookies'dan accessToken'ni olish
  const token = request.cookies.get('accessToken')?.value
  
  // Hozirgi sahifa manzilini olish
  const { pathname } = request.nextUrl

  // Agar foydalanuvchi auth sahifasida bo'lsa va tokenga ega bo'lsa, uni bosh sahifaga yuboramiz
  if (pathname.startsWith('/auth') && token) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Agar token bo'lmasa va foydalanuvchi auth bo'lmagan sahifada bo'lsa, /auth sahifasiga yuboramiz
  // Bu yerda statik fayllar va api'larni tekshirishdan o'tkazib yuborish kerak
  if (!token && !pathname.startsWith('/auth')) {
    return NextResponse.redirect(new URL('/auth', request.url))
  }

  return NextResponse.next()
}

// Qaysi sahifalar uchun middleware ishlashi kerakligini belgilaymiz
export const config = {
  matcher: [
    /*
     * Quyidagi manzillardan tashqari hamma sahifalarda ishlaydi:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}