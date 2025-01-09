"use client"

import { useState, useEffect } from "react"
import { Edit, Trash2 } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function ChatbotsPage() {
  const [chatbots, setChatbots] = useState<any[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState("")

  const fetchData = async () => {
    const res = await fetch("/api/chatbot", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
    const data = await res.json()
    setChatbots(data)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleEdit = (bot: any) => {
    setEditingId(bot.id)
    setEditName(bot.name)
  }

  const saveEdit = async (id: string) => {
    const res = await fetch("/api/chatbot", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({ id, name: editName })
    })
    const data = await res.json()
    if (data.error) {
      alert(data.error)
    }
    setEditingId(null)
    setEditName("")
    fetchData()
  }

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/chatbot?id=${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
    const data = await res.json()
    if (data.error) {
      alert(data.error)
    } else {
      alert("Чат-бот удалён")
    }
    fetchData()
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Список чат-ботов</h2>
      
      {chatbots.map((bot) => (
        <Card key={bot.id} className="mb-2">
          <CardContent className="pt-6">
            {editingId === bot.id ? (
              <div className="flex items-center space-x-2">
                <Input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="max-w-sm"
                />
                <Button variant="default" onClick={() => saveEdit(bot.id)}>
                  Сохранить
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditingId(null)
                    setEditName("")
                  }}
                >
                  Отмена
                </Button>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <h3 className="font-semibold">{bot.name}</h3>
                  <p className="text-sm text-muted-foreground">ID: {bot.id}</p>
                </div>
                <div className="flex items-center space-x-4 mt-4">
                  <Button variant="outline" onClick={() => handleEdit(bot)}>
                    <Edit className="w-4 h-4 mr-2" />
                    Редактировать
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Удалить
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Подтверждение удаления</AlertDialogTitle>
                        <AlertDialogDescription>
                          Вы уверены, что хотите удалить этого чат-бота? Это действие необратимо.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Отмена</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(bot.id)}>
                          Удалить
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}