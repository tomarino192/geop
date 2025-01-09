// src/app/api/auth/register/route.ts
import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcrypt"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return NextResponse.json({ error: "Пользователь уже существует" }, { status: 400 })
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword
      }
    })
    return NextResponse.json({ user: newUser })
  } catch (err) {
    return NextResponse.json({ error: "Ошибка при регистрации" }, { status: 500 })
  }
}
