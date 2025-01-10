import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyToken } from "@/lib/jwt"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "") || ""
  const payload = await verifyToken(token)
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
