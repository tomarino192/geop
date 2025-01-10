import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyToken } from "@/lib/jwt"

export async function GET(req: NextRequest) {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "") || ""
  const payload = await verifyToken(token)
  if (!payload) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
  }

  // Чат-боты бизнесов текущего пользователя
  const chatbots = await prisma.chatbot.findMany({
    where: {
      business: {
        ownerId: payload.userId
      }
    },
    include: { business: true, modules: true }
  })
  return NextResponse.json(chatbots)
}

export async function POST(req: NextRequest) {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "") || ""
  const payload = await verifyToken(token)
  if (!payload) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
  }

  // Извлекаем поля для чат-бота (включая ML, рабочие часы и т.д.)
  const {
    name,
    businessId,
    templateKey,
    mlEnabled,
    botWorkingDays,
    botStartTime,
    botEndTime,
    botWorkSaturday,
    botStartTimeSat,
    botEndTimeSat,
    botWorkSunday,
    botStartTimeSun,
    botEndTimeSun,
    paymentMethods,  // опционально, если храните
    deliveryOptions
  } = await req.json()

  // Проверка доступа
  const business = await prisma.business.findUnique({ where: { id: businessId } })
  if (!business || business.ownerId !== payload.userId) {
    return NextResponse.json({ error: "Нет доступа" }, { status: 403 })
  }

  // Создаём чат-бот
  const newChatbot = await prisma.chatbot.create({
    data: {
      name,
      businessId,
      mlEnabled: mlEnabled || false,
      botWorkingDays: botWorkingDays || [],
      botStartTime,
      botEndTime,
      botWorkSaturday,
      botStartTimeSat,
      botEndTimeSat,
      botWorkSunday,
      botStartTimeSun,
      botEndTimeSun,
      paymentMethods,
      deliveryOptions,
      templateKey
    }
  })
  return NextResponse.json(newChatbot)
}

export async function PATCH(req: NextRequest) {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "") || ""
  const payload = await verifyToken(token)
  if (!payload) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
  }

  const {
    id,
    name,
    templateKey,
    mlEnabled,
    botWorkingDays,
    botStartTime,
    botEndTime,
    botWorkSaturday,
    botStartTimeSat,
    botEndTimeSat,
    botWorkSunday,
    botStartTimeSun,
    botEndTimeSun,
    catalogType,
    catalogLink,
    catalogApiKey,
    faqLink,
    paymentMethods,
    deliveryOptions
  } = await req.json()

  // Проверяем, что чат-бот принадлежит бизнесу текущего пользователя
  const chatbot = await prisma.chatbot.findUnique({
    where: { id },
    include: { business: true }
  })
  if (!chatbot || chatbot.business.ownerId !== payload.userId) {
    return NextResponse.json({ error: "Нет доступа" }, { status: 403 })
  }

  // Обновляем
  const updated = await prisma.chatbot.update({
    where: { id },
    data: {
      name,
      templateKey,
      mlEnabled,
      botWorkingDays: botWorkingDays || [],
      botStartTime,
      botEndTime,
      botWorkSaturday,
      botStartTimeSat,
      botEndTimeSat,
      botWorkSunday,
      botStartTimeSun,
      botEndTimeSun,
      catalogType,
      catalogLink,
      catalogApiKey,
      faqLink,
      paymentMethods,
      deliveryOptions
    }
  })
  return NextResponse.json(updated)
}

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

  // Проверяем чат-бот
  const chatbot = await prisma.chatbot.findUnique({
    where: { id },
    include: { business: true }
  })
  if (!chatbot || chatbot.business.ownerId !== payload.userId) {
    return NextResponse.json({ error: "Нет доступа" }, { status: 403 })
  }

  await prisma.chatbot.delete({ where: { id } })
  return NextResponse.json({ message: "Чат-бот удалён" })
}
