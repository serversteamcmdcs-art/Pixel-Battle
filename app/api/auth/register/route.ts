// app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { username, email } = await req.json();

    if (!username || username.length < 3) {
      return NextResponse.json({ error: "Никнейм должен быть минимум 3 символа" }, { status: 400 });
    }

    const existingUser = await prisma.user.findFirst({
      where: { 
        OR: [{ username }, { email: email || undefined }]
      }
    });

    if (existingUser) {
      return NextResponse.json({ error: "Пользователь с таким ником или email уже существует" }, { status: 400 });
    }

    const user = await prisma.user.create({
      data: {
        username,
        email: email || `${username.toLowerCase()}@example.com`,
      }
    });

    return NextResponse.json({
      success: true,
      message: "Регистрация успешна",
      user: {
        id: user.id,
        username: user.username,
      }
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
