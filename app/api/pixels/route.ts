import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'

export async function GET() {
  const pixels = await prisma.pixel.findMany({
    select: { x: true, y: true, color: true }
  })
  return NextResponse.json(pixels)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })
  }

  const { x, y, color } = await req.json()

  // Проверка кулдауна (5 минут)
  const lastPixel = await prisma.pixel.findFirst({
    where: { userId: session.user.id },
    orderBy: { placedAt: 'desc' }
  })

  if (lastPixel && Date.now() - lastPixel.placedAt.getTime() < 5 * 60 * 1000) {
    return NextResponse.json({ error: 'Cooldown 5 минут' }, { status: 429 })
  }

  const pixel = await prisma.pixel.create({
    data: { x, y, color, userId: session.user.id }
  })

  // Обновляем счётчик пикселей пользователя
  await prisma.user.update({
    where: { id: session.user.id },
    data: { pixelsPlaced: { increment: 1 } }
  })

  // Реал-тайм (Socket.io)
  // (подключаем в следующем файле)

  return NextResponse.json(pixel)
}