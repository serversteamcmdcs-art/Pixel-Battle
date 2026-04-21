// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const { username } = await req.json();

  if (!username || username.length < 3) {
    return NextResponse.json({ error: "Никнейм должен быть минимум 3 символа" }, { status: 400 });
  }

  let user = await prisma.user.findUnique({
    where: { username },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        username,
        email: `${username.toLowerCase()}@example.com`,
      },
    });
  }

  // Возвращаем данные пользователя
  return NextResponse.json({
    success: true,
    user: {
      id: user.id,
      username: user.username,
      pixelsPlaced: user.pixelsPlaced,
    },
  });
}
