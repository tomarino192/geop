// src/app/(admin)/layout.tsx
import AdminNav from "@/components/AdminNav"
import { ReactNode } from "react"

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen">
      {/* Боковое меню */}
      <aside className="w-64 bg-gray-800 text-white">
        <AdminNav />
      </aside>

      {/* Основной контент */}
      <main className="flex-1 p-6 overflow-auto bg-gray-100">
        {children}
      </main>
    </div>
  )
}
