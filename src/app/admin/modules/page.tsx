"use client"

import { useState, useEffect } from "react"
import { Edit, Trash2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
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
import ModuleForm from "@/components/ModuleForm"

export default function ModulesPage() {
  const [modules, setModules] = useState<any[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState("")

  const fetchData = async () => {
    const res = await fetch("/api/module", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
    const data = await res.json()
    setModules(data)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleEdit = (mod: any) => {
    setEditingId(mod.id)
    setEditName(mod.name)
  }

  const saveEdit = async (id: string) => {
    const res = await fetch("/api/module", {
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
    const res = await fetch(`/api/module?id=${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
    const data = await res.json()
    if (data.error) {
      alert(data.error)
    } else {
      alert("Модуль удалён")
    }
    fetchData()
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Модули</h2>
      <ModuleForm onCreated={fetchData} />

      {modules.map((mod) => (
        <Card key={mod.id} className="mb-2">
          <CardContent className="pt-6">
            {editingId === mod.id ? (
              <div className="flex items-center space-x-2">
                <Input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="max-w-sm"
                />
                <Button variant="default" onClick={() => saveEdit(mod.id)}>
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
                  <h3 className="font-semibold">{mod.name}</h3>
                  <p className="text-sm text-muted-foreground">ID: {mod.id}</p>
                </div>
                <div className="flex items-center space-x-2 mt-4">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleEdit(mod)}
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
                          Вы уверены, что хотите удалить этот модуль? Это действие необратимо.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Отмена</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(mod.id)}>
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