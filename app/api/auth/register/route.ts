import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import nodemailer from 'nodemailer'
import crypto from 'crypto'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export async function POST(req: NextRequest) {
  const { username, email, password } = await req.json()

  const existing = await prisma.user.findFirst({ where: { OR: [{ username }, { email }] } })
  if (existing) return NextResponse.json({ error: 'Пользователь уже существует' }, { status: 400 })

  const token = crypto.randomBytes(32).toString('hex')

  const user = await prisma.user.create({
    data: {
      username,
      email,
      verificationToken: token,
    }
  })

  // Отправка письма
  await transporter.sendMail({
    from: '"Pixel Battle" <no-reply@pixelbattle.ru>',
    to: email,
    subject: 'Подтвердите email — Pixel Battle',
    html: `
      <h2>Привет, ${username}!</h2>
      <p>Кликни по ссылке для подтверждения:</p>
      <a href="http://localhost:3000/api/auth/verify?token=${token}" style="background:#e11d48;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;">
        Подтвердить email
      </a>
    `
  })

  return NextResponse.json({ success: true, message: 'Письмо отправлено' })
}