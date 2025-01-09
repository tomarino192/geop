"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export default function LogsPage() {
  const [logs, setLogs] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      const res = await fetch("/api/log", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      })
      const data = await res.json()

      if (data.error) {
        setError(data.error)
        setLogs([])
      } 
      else if (Array.isArray(data)) {
        setError(null)
        setLogs(data)
      } 
      else {
        setError("Неизвестный ответ от сервера")
        setLogs([])
      }
    }
    fetchData()
  }, [])

  if (error) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Логи</h2>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Логи</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {logs.map((log) => (
          <Card key={log.id}>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <p><span className="font-medium">Action:</span> {log.action}</p>
                  <time className="text-sm text-muted-foreground">{log.timestamp}</time>
                </div>
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium">Пользователь:</span> {log.user?.email || "N/A"}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}