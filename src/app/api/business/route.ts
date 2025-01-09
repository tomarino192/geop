// src/app/api/business/route.ts
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyToken } from "@/lib/jwt"

export async function GET(req: NextRequest) {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "") || ""
  const payload = await verifyToken(token)
  if (!payload) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
  }
  const businesses = await prisma.business.findMany({
    where: { ownerId: payload.userId },
    include: { owner: true, chatbots: true } // добавим owner, чтобы увидеть email
  })
  return NextResponse.json(businesses)
}

export async function POST(req: NextRequest) {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "") || ""
  const payload = await verifyToken(token)
  if (!payload) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
  }
  const { name } = await req.json()
  const newBusiness = await prisma.business.create({
    data: {
      name,
      ownerId: payload.userId as string
    }
  })
  return NextResponse.json(newBusiness)
}

// Новое:
export async function PATCH(req: NextRequest) {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "") || ""
  const payload = await verifyToken(token)
  if (!payload) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
  }

  const { id, name } = await req.json()
  // Проверим, что это бизнес текущего пользователя
  const biz = await prisma.business.findUnique({ where: { id } })
  if (!biz || biz.ownerId !== payload.userId) {
    return NextResponse.json({ error: "Нет доступа" }, { status: 403 })
  }

  const updated = await prisma.business.update({
    where: { id },
    data: { name }
  })
  return NextResponse.json(updated)
}

// Новое:
export async function DELETE(req: NextRequest) {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "") || ""
  const payload = await verifyToken(token)
  if (!payload) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
  }

  // получаем ID из query-параметров: /api/business?id=xxx
  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")

  if (!id) {
    return NextResponse.json({ error: "ID не указан" }, { status: 400 })
  }

  // Проверим бизнес
  const biz = await prisma.business.findUnique({ where: { id } })
  if (!biz || biz.ownerId !== payload.userId) {
    return NextResponse.json({ error: "Нет доступа" }, { status: 403 })
  }

  await prisma.business.delete({ where: { id } })
  return NextResponse.json({ message: "Бизнес удалён" })
}
