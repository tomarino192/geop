// src/app/api/log/route.ts
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
  const logs = await prisma.log.findMany({
    include: { user: true }
  })
  return NextResponse.json(logs)
}
