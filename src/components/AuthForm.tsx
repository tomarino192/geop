"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"

export default function AuthForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { toast } = useToast()
  const router = useRouter()
  const showError = (message: string) => {
    toast({
      variant: "destructive",
      description: message,
    })
  }

  const showSuccess = (message: string) => {
    toast({
      description: message,
    })
  }

  const onLogin = async () => {
    if (!email || !password) {
      showError("Укажите email и пароль")
      return
    }
    
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()
      
      if (data.token) {
        localStorage.setItem("token", data.token)
        showSuccess("Добро пожаловать в Geopard Alpha!")
        router.push('/admin/dashboard')
      } else {
        showError(data.error || "Ошибка входа")
      }
    } catch (error) {
      showError("Произошла ошибка при входе")
    }
  }

  const onRegister = async () => {
    if (!email || !password) {
      showError("Укажите email и пароль")
      return
    }
    
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()
      
      if (data.user) {
        showSuccess("Регистрация прошла успешна, пожалуйста авторизуйтесь")
      } else {
        showError(data.error || "Ошибка регистрации")
      }
    } catch (error) {
      showError("Произошла ошибка при регистрации")
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Вход в систему</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Пароль</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="flex justify-between pt-2">
          <Button onClick={onLogin} className="flex-1 mr-2">
            Войти
          </Button>
          <Button onClick={onRegister} variant="outline" className="flex-1 ml-2">
            Зарегистрироваться
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}