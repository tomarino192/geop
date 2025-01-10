import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyToken } from "@/lib/jwt"

export async function GET(req: NextRequest) {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "") || ""
  const payload = await verifyToken(token) as { userId: string }
  if (!payload) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
  }
  // Находим все бизнесы текущего пользователя
  const businesses = await prisma.business.findMany({
    where: { ownerId: payload.userId },
    include: { owner: true, chatbots: true }
  })
  return NextResponse.json(businesses)
}

// GET /api/business/:id (для получения одного бизнеса)
// Можно оформить как отдельный файл /src/app/api/business/[id]/route.ts
// но если нужно в одном — можно условно парсить URL.
// Ниже — пример для отдельного route. 
// Если не нужно, уберите этот комментарий.

/*
export async function GET_ONE(req: NextRequest, { params }: { params: { id: string } }) {
  // Пример: /api/business/abc123
  const token = req.headers.get("Authorization")?.replace("Bearer ", "") || ""
  const payload = await verifyToken(token) as { userId: string }
  if (!payload) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
  }
  const { id } = params
  const biz = await prisma.business.findUnique({ where: { id } })
  if (!biz || biz.ownerId !== payload.userId) {
    return NextResponse.json({ error: "Нет доступа или бизнес не найден" }, { status: 403 })
  }
  return NextResponse.json(biz)
}
*/

export async function POST(req: NextRequest) {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "") || ""
  const payload = await verifyToken(token) as { userId: string }

  if (!payload) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
  }
  // Забираем все поля, которые можем записать в бизнес
  const {
    name,
    type,
    promoLink,
    phone,
    geo,
    style,
    targetAction,
    workingDays,
    startTime,
    endTime,
    workSaturday,
    startTimeSat,
    endTimeSat,
    workSunday,
    startTimeSun,
    endTimeSun
  } = await req.json()

  const newBusiness = await prisma.business.create({
    data: {
      name,
      ownerId: payload.userId,
      type,
      promoLink,
      phone,
      geo,
      style,
      targetAction,
      workingDays: workingDays || [],
      startTime,
      endTime,
      workSaturday,
      startTimeSat,
      endTimeSat,
      workSunday,
      startTimeSun,
      endTimeSun
    }
  })
  return NextResponse.json(newBusiness)
}

// PATCH (обновление)
export async function PATCH(req: NextRequest) {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "") || ""
  const payload = await verifyToken(token)
  if (!payload) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
  }

  const {
    id,
    name,
    type,
    promoLink,
    phone,
    geo,
    style,
    targetAction,
    workingDays,
    startTime,
    endTime,
    workSaturday,
    startTimeSat,
    endTimeSat,
    workSunday,
    startTimeSun,
    endTimeSun
  } = await req.json()

  // Проверка прав
  const biz = await prisma.business.findUnique({ where: { id } })
  if (!biz || biz.ownerId !== payload.userId) {
    return NextResponse.json({ error: "Нет доступа" }, { status: 403 })
  }

  const updated = await prisma.business.update({
    where: { id },
    data: {
      name,
      type,
      promoLink,
      phone,
      geo,
      style,
      targetAction,
      workingDays: workingDays || [],
      startTime,
      endTime,
      workSaturday,
      startTimeSat,
      endTimeSat,
      workSunday,
      startTimeSun,
      endTimeSun
    }
  })
  return NextResponse.json(updated)
}

// DELETE
export async function DELETE(req: NextRequest) {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "") || ""
  const payload = await verifyToken(token)
  if (!payload) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")

  if (!id) {
    return NextResponse.json({ error: "ID не указан" }, { status: 400 })
  }

  const biz = await prisma.business.findUnique({ where: { id } })
  if (!biz || biz.ownerId !== payload.userId) {
    return NextResponse.json({ error: "Нет доступа" }, { status: 403 })
  }

  await prisma.business.delete({ where: { id } })
  return NextResponse.json({ message: "Бизнес удалён" })
}
