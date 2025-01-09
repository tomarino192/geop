"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export default function DashboardPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Административная панель</h2>
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Статистика</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Пока нет данных</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Активные чаты</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Пока нет данных</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}