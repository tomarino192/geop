// src/app/api/deploy/route.ts
import { NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/jwt"
import { updateLambda } from "@/lib/awsLambda"

export async function POST(req: NextRequest) {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "") || ""
  const payload = await verifyToken(token)
  if (!payload) {
    return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
  }

  // По желанию, проверка: если нужно только владельцам бизнеса или админам
  // if (payload.role !== "ADMIN") {
  //   return NextResponse.json({ error: "Нет доступа" }, { status: 403 })
  // }

  try {
    // Допустим, в теле запроса приходит какой-то config
    const body = await req.json()

    // Вызываем функцию из awsLambda.ts
    const result = await updateLambda(body)

    return NextResponse.json({ message: "Lambda updated!", result })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
