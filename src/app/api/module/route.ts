// src/app/api/module/route.ts
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyToken } from "@/lib/jwt"

export async function GET(req: NextRequest) {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "") || ""
  const payload = await verifyToken(token)
  if (!payload) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
  }

  // Получаем модули, связанные с чат-ботами пользователя
  const modules = await prisma.module.findMany({
    where: {
      chatbots: {
        some: {
          business: {
            ownerId: payload.userId
          }
        }
      }
    },
    include: {
      chatbots: {
        include: {
          business: true
        }
      }
    }
  })
  return NextResponse.json(modules)
}

export async function POST(req: NextRequest) {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "") || ""
  const payload = await verifyToken(token)
  if (!payload) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
  }

  const { name, config, chatbotIds } = await req.json()

  // Проверяем, что все чат-боты принадлежат бизнесам текущего пользователя
  const chatbots = await prisma.chatbot.findMany({
    where: {
      id: {
        in: chatbotIds
      }
    },
    include: {
      business: true
    }
  })

  // Проверяем доступ к каждому чат-боту
  const unauthorized = chatbots.some(
    chatbot => chatbot.business.ownerId !== payload.userId
  )
  if (unauthorized || chatbots.length !== chatbotIds.length) {
    return NextResponse.json({ error: "Нет доступа" }, { status: 403 })
  }

  const newModule = await prisma.module.create({
    data: {
      name,
      config,
      chatbots: {
        connect: chatbotIds.map(id => ({ id }))
      }
    }
  })
  return NextResponse.json(newModule)
}

export async function PATCH(req: NextRequest) {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "") || ""
  const payload = await verifyToken(token)
  if (!payload) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
  }

  const { id, name, config, chatbotIds } = await req.json()

  // Проверяем текущий модуль и его чат-боты
  const module = await prisma.module.findUnique({
    where: { id },
    include: {
      chatbots: {
        include: {
          business: true
        }
      }
    }
  })
  if (!module) {
    return NextResponse.json({ error: "Модуль не найден" }, { status: 404 })
  }

  // Проверяем, что у пользователя есть доступ хотя бы к одному чат-боту модуля
  const hasAccess = module.chatbots.some(
    chatbot => chatbot.business.ownerId === payload.userId
  )
  if (!hasAccess) {
    return NextResponse.json({ error: "Нет доступа" }, { status: 403 })
  }

  // Если переданы новые chatbotIds, проверяем доступ к ним
  if (chatbotIds) {
    const newChatbots = await prisma.chatbot.findMany({
      where: {
        id: {
          in: chatbotIds
        }
      },
      include: {
        business: true
      }
    })

    const unauthorized = newChatbots.some(
      chatbot => chatbot.business.ownerId !== payload.userId
    )
    if (unauthorized || newChatbots.length !== chatbotIds.length) {
      return NextResponse.json({ error: "Нет доступа к некоторым чат-ботам" }, { status: 403 })
    }
  }

  const updated = await prisma.module.update({
    where: { id },
    data: {
      name,
      config,
      ...(chatbotIds && {
        chatbots: {
          set: chatbotIds.map(id => ({ id }))
        }
      })
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

  // Проверяем, что у пользователя есть доступ хотя бы к одному чат-боту модуля
  const module = await prisma.module.findUnique({
    where: { id },
    include: {
      chatbots: {
        include: {
          business: true
        }
      }
    }
  })
  if (!module) {
    return NextResponse.json({ error: "Модуль не найден" }, { status: 404 })
  }

  const hasAccess = module.chatbots.some(
    chatbot => chatbot.business.ownerId === payload.userId
  )
  if (!hasAccess) {
    return NextResponse.json({ error: "Нет доступа" }, { status: 403 })
  }

  await prisma.module.delete({ where: { id } })
  return NextResponse.json({ message: "Модуль удалён" })
}