// app/api/pixels/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const pixels = await prisma.pixel.findMany({
    select: { x: true, y: true, color: true },
  });
  return NextResponse.json(pixels);
}

export async function POST(req: NextRequest) {
  const { x, y, color, username } = await req.json();

  if (!username) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
  }

  // Проверка кулдауна (5 минут)
  const lastPixel = await prisma.pixel.findFirst({
    where: { 
      user: { username }
    },
    orderBy: { placedAt: "desc" },
  });

  if (lastPixel && Date.now() - lastPixel.placedAt.getTime() < 5 * 60 * 1000) {
    return NextResponse.json({ error: "Cooldown 5 минут" }, { status: 429 });
  }

  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) {
    return NextResponse.json({ error: "Пользователь не найден" }, { status: 401 });
  }

  const pixel = await prisma.pixel.create({
    data: {
      x,
      y,
      color,
      userId: user.id,
    },
  });

  await prisma.user.update({
    where: { id: user.id },
    data: { pixelsPlaced: { increment: 1 } },
  });

  return NextResponse.json(pixel);
}
