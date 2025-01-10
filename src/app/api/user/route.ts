// src/app/api/user/route.ts
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyToken } from "@/lib/jwt"

export async function GET(req: NextRequest) {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "") || ""
  const payload = await verifyToken(token)
  if (!payload) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
  }
  if (payload.role !== "ADMIN") {
    return NextResponse.json({ error: "Нет доступа" }, { status: 403 })
  }

  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      role: true,
      failedLoginAttempts: true,
      accountLocked: true,
      businesses: true,
      logs: true,
      lang: true
    }
  })
  return NextResponse.json(users)
}

export async function PATCH(req: NextRequest) {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "") || ""
  const payload = await verifyToken(token)
  if (!payload || typeof payload.userId !== 'string') {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
  }
  if (payload.role !== "ADMIN") {
    return NextResponse.json({ error: "Нет доступа" }, { status: 403 })
  }

  const { id, role, accountLocked, lang } = await req.json()

  if (!id) {
    return NextResponse.json({ error: "ID не указан" }, { status: 400 })
  }

  const user = await prisma.user.findUnique({ where: { id } })
  if (!user) {
    return NextResponse.json({ error: "Пользователь не найден" }, { status: 404 })
  }

   // Проверяем, не пытается ли пользователь изменить свои данные
   if (id === payload.userId) {
      return NextResponse.json({ error: "Нельзя изменить свои права" }, { status: 403 })
   }

  const updated = await prisma.user.update({
    where: { id },
    data: {
      ...(role && { role }),
      ...(typeof accountLocked === 'boolean' && { accountLocked }),
      ...(accountLocked === false && { failedLoginAttempts: 0 }),
      ...(lang && { lang })
    },
    select: {
      id: true,
      email: true,
      role: true,
      failedLoginAttempts: true,
      accountLocked: true,
      lang: true
    }
  })

  await prisma.log.create({
    data: {
      userId: payload.userId,
      action: "UPDATE_USER",
      status: "SUCCESS",
      details: `Updated user ${id}: ${JSON.stringify({ role, accountLocked })}`
    }
  })

  return NextResponse.json(updated)
}

export async function DELETE(req: NextRequest) {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "") || ""
  const payload = await verifyToken(token)
  if (!payload || typeof payload.userId !== 'string') {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
  }
  if (payload.role !== "ADMIN") {
    return NextResponse.json({ error: "Нет доступа" }, { status: 403 })
  }

  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")

  if (!id) {
    return NextResponse.json({ error: "ID не указан" }, { status: 400 })
  }

  const user = await prisma.user.findUnique({ where: { id } })
  if (!user) {
    return NextResponse.json({ error: "Пользователь не найден" }, { status: 404 })
  }

  if (id === payload.userId) {
    return NextResponse.json({ error: "Нельзя удалить свой аккаунт" }, { status: 403 })
  }

  await prisma.user.delete({ where: { id } })

  await prisma.log.create({
    data: {
      userId: payload.userId,
      action: "DELETE_USER",
      status: "SUCCESS",
      details: `Deleted user ${id}`
    }
  })

  return NextResponse.json({ message: "Пользователь удалён" })
}