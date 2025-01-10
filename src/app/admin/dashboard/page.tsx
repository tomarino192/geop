// src/app/admin/dashboard/page.tsx
"use client"

import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { useLocale } from "@/context/LocaleContext"
import { Activity, Bot, Users } from "lucide-react" // пример красивых иконок
import { Separator } from "@/components/ui/separator"

export default function DashboardPage() {
  const { t } = useLocale()

  const [activeUserBots, setActiveUserBots] = useState<number>(0)
  const [totalUserBots, setTotalUserBots] = useState<number>(0)

  const [totalBotsSystem, setTotalBotsSystem] = useState<number>(0)
  const [totalUsers, setTotalUsers] = useState<number>(0)
  const [dialogsMonth, setDialogsMonth] = useState<number>(0)
  const [dialogsTotal, setDialogsTotal] = useState<number>(0)

  useEffect(() => {
    // Получаем ботов текущего юзера
    fetch("/api/user-bots", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
      .then((res) => res.json())
      .then((data) => {
        // data = [{ id, name, active: boolean }, ...]
        const activeCount = data.filter((bot: any) => bot.active).length
        setActiveUserBots(activeCount)
        setTotalUserBots(data.length)
      })
      .catch(() => {})

    // Получаем глобальную статистику
    fetch("/api/stats", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
      .then((res) => res.json())
      .then((data) => {
        // data = { totalBots, totalUsers, dialogsMonth, dialogsTotal }
        setTotalBotsSystem(data.totalBots)
        setTotalUsers(data.totalUsers)
        setDialogsMonth(data.dialogsMonth)
        setDialogsTotal(data.dialogsTotal)
      })
      .catch(() => {})
  }, [])

  return (
    <div className="space-y-6 p-4">
      <h2 className="text-2xl font-bold">{t("dashboard.userBotsTitle")}</h2>
      <div className="grid grid-cols-2 gap-4">
        {/* Активные / Всего у пользователя */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bot className="w-5 h-5" />
              <span>
                {t("dashboard.activeBots")}: {activeUserBots} / {t("dashboard.totalBots")} : {totalUserBots}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Здесь можно вывести более детальную инфу о чат-ботах юзера
            </p>
          </CardContent>
        </Card>
      </div>

      <Separator />

      <h2 className="text-2xl font-bold">{t("dashboard.systemBotsTitle")}</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Общее кол-во чат-ботов в системе */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bot className="w-5 h-5" />
              <span>{t("dashboard.systemBotsTitle")}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{totalBotsSystem}</p>
          </CardContent>
        </Card>

        {/* Общее кол-во пользователей */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>{t("dashboard.usersTitle")}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{totalUsers}</p>
          </CardContent>
        </Card>

        {/* Диалогов за месяц */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="w-5 h-5" />
              <span>{t("dashboard.dialogsMonth")}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{dialogsMonth}</p>
          </CardContent>
        </Card>

        {/* Всего диалогов */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="w-5 h-5" />
              <span>{t("dashboard.dialogsTotal")}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{dialogsTotal}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
