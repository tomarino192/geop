import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcrypt"
import { prisma } from "@/lib/prisma"
import { signToken } from "@/lib/jwt"

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return NextResponse.json({ error: "Пользователь не найден" }, { status: 404 })
    }
    if (user.accountLocked) {
      return NextResponse.json({ error: "Аккаунт заблокирован" }, { status: 403 })
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      await prisma.user.update({
        where: { email },
        data: { failedLoginAttempts: user.failedLoginAttempts + 1 }
      })
      if (user.failedLoginAttempts + 1 >= 3) {
        await prisma.user.update({
          where: { email },
          data: { accountLocked: true }
        })
      }
      return NextResponse.json({ error: "Неверный пароль" }, { status: 401 })
    }
    const token = await signToken({ userId: user.id, role: user.role })
    // Сброс счетчика неудачных попыток
    await prisma.user.update({
      where: { email },
      data: { failedLoginAttempts: 0 }
    })
    return NextResponse.json({ token, user })
  } catch (err) {
    return NextResponse.json({ error: "Ошибка при входе" }, { status: 500 })
  }
}
