"use client"

import { useState, useEffect } from "react"
import { Edit, Trash2, Lock, Unlock } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editEmail, setEditEmail] = useState("")
  const [editRole, setEditRole] = useState("")

  const fetchData = async () => {
    const res = await fetch("/api/user", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
    const data = await res.json()

    if (data.error) {
      setError(data.error)
      setUsers([])
    } else if (Array.isArray(data)) {
      setError(null)
      setUsers(data)
    } else {
      setError("Неизвестный ответ от сервера")
      setUsers([])
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Редактирование
  const handleEdit = (user: any) => {
    setEditingId(user.id)
    setEditEmail(user.email)
    setEditRole(user.role)
  }

  const saveEdit = async (id: string) => {
    const res = await fetch("/api/user", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({ id, email: editEmail, role: editRole })
    })
    const data = await res.json()
    if (data.error) {
      alert(data.error)
    }
    setEditingId(null)
    setEditEmail("")
    setEditRole("")
    fetchData()
  }

  // Удаление
  const handleDelete = async (id: string) => {
    if (!confirm("Удалить этого пользователя?")) return
    const res = await fetch(`/api/user?id=${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
    const data = await res.json()
    if (data.error) {
      alert(data.error)
    } else {
      alert("Пользователь удалён")
    }
    fetchData()
  }

  // Блокировка/разблокировка аккаунта
  const toggleLock = async (id: string, currentLockState: boolean) => {
    const res = await fetch("/api/user/lock", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({ id, locked: !currentLockState })
    })
    const data = await res.json()
    if (data.error) {
      alert(data.error)
    }
    fetchData()
  }

  if (error) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Пользователи</h2>
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Пользователи</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {users.map((user) => (
          <Card key={user.id}>
            <CardContent className="pt-6">
              {editingId === user.id ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email:</Label>
                    <Input
                      id="email"
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role:</Label>
                    <Select value={editRole} onValueChange={setEditRole}>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите роль" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USER">User</SelectItem>
                        <SelectItem value="ADMIN">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex space-x-2">
                    <Button onClick={() => saveEdit(user.id)}>
                      Сохранить
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setEditingId(null)
                        setEditEmail("")
                        setEditRole("")
                      }}
                    >
                      Отмена
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <p>
                      <span className="font-medium">Email:</span> {user.email}
                    </p>
                    <p>
                      <span className="font-medium">Role:</span> {user.role}
                    </p>
                    <p>
                      <span className="font-medium">Account locked:</span>{" "}
                      {user.accountLocked ? "Да" : "Нет"}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 mt-4">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleEdit(user)}
                      title="Редактировать"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Подтверждение удаления</AlertDialogTitle>
                          <AlertDialogDescription>
                            Вы уверены, что хотите удалить этого пользователя? Это действие необратимо.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Отмена</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(user.id)}>
                            Удалить
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleLock(user.id, user.accountLocked)}
                      className={user.accountLocked ? "text-green-600" : "text-orange-600"}
                    >
                      {user.accountLocked ? (
                        <Unlock className="h-4 w-4" />
                      ) : (
                        <Lock className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}