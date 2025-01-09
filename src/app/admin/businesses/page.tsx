// src/app/admin/businesses/page.tsx
"use client"

import { useState, useEffect } from "react"
import BusinessForm from "@/components/BusinessForm"
import { Edit, Trash2 } from "lucide-react"

export default function BusinessesPage() {
  const [businesses, setBusinesses] = useState<any[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState("")

  const fetchData = async () => {
    const res = await fetch("/api/business", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
    const data = await res.json()
    setBusinesses(data)
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Редактирование
  const handleEdit = (biz: any) => {
    setEditingId(biz.id)
    setEditName(biz.name)
  }
  const saveEdit = async (id: string) => {
    const res = await fetch("/api/business", {
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

  // Удаление
  const handleDelete = async (id: string) => {
    if (!confirm("Удалить этот бизнес?")) return
    const res = await fetch(`/api/business?id=${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    })
    const data = await res.json()
    if (data.error) {
      alert(data.error)
    } else {
      alert("Бизнес удалён")
    }
    fetchData()
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Список бизнесов</h2>
      <BusinessForm onCreated={fetchData} />

      {businesses.map((biz) => (
        <div key={biz.id} className="p-4 bg-white shadow rounded mb-2">
          {editingId === biz.id ? (
            <div className="flex items-center space-x-2">
              <input
                className="border p-2 rounded"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
              <button
                onClick={() => saveEdit(biz.id)}
                className="bg-blue-500 text-white px-2 py-1 rounded"
              >
                Сохранить
              </button>
              <button
                onClick={() => {
                  setEditingId(null)
                  setEditName("")
                }}
                className="bg-gray-300 text-gray-700 px-2 py-1 rounded"
              >
                Отмена
              </button>
            </div>
          ) : (
            <>
              <p className="font-semibold">{biz.name}</p>
              <p className="text-sm text-gray-600">ID: {biz.id}</p>
              <p className="text-sm text-gray-500">
                Владелец бизнеса: {biz.owner?.email || "(не найден)"}
              </p>
              <div className="flex items-center space-x-4 mt-2">
                <button
                  onClick={() => handleEdit(biz)}
                  className="text-blue-600 flex items-center space-x-1"
                >
                  <Edit size={16} />
                  <span>Редактировать</span>
                </button>
                <button
                  onClick={() => handleDelete(biz.id)}
                  className="text-red-500 flex items-center space-x-1"
                >
                  <Trash2 size={16} />
                  <span>Удалить</span>
                </button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  )
}
