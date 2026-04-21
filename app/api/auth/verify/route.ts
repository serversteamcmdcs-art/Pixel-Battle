import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token')
  if (!token) return NextResponse.json({ error: 'Нет токена' }, { status: 400 })

  const user = await prisma.user.update({
    where: { verificationToken: token },
    data: { emailVerified: true, verificationToken: null }
  })

  if (!user) return NextResponse.json({ error: 'Неверный токен' }, { status: 400 })

  return NextResponse.redirect('http://localhost:3000?verified=true')
}