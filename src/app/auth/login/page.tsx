// src/app/auth/login/page.tsx
"use client"

import AuthForm from "@/components/AuthForm"

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="p-6 bg-white rounded shadow w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Добро пожаловать в Geopard Admin Panel</h1>
        <p className="mb-4 text-center text-gray-600">Пожалуйста, войдите или зарегистрируйтесь</p>
        <AuthForm />
      </div>
    </main>
  )
}
