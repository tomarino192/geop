import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { MessageSquarePlus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function ChatbotForm({ onCreated }: { onCreated: () => void }) {
  const [name, setName] = useState("")
  const [businessId, setBusinessId] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const onCreate = async () => {
    if (!name.trim() || !businessId.trim()) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Пожалуйста, укажите название чат-бота и ID бизнеса"
      })
      return
    }

    setIsLoading(true)
    try {
      const token = localStorage.getItem("token")
      const res = await fetch("/api/chatbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ 
          name: name.trim(), 
          businessId: businessId.trim() 
        })
      })
      const data = await res.json()
      
      if (data.error) {
        toast({
          variant: "destructive",
          title: "Ошибка",
          description: data.error
        })
      } else {
        toast({
          title: "Успешно",
          description: "Чат-бот успешно создан!"
        })
        setName("")
        setBusinessId("")
        onCreated()
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Произошла ошибка при создании чат-бота"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onCreate()
    }
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg">Добавить чат-бот</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          placeholder="Название чат-бота"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <Input
          placeholder="ID бизнеса"
          value={businessId}
          onChange={(e) => setBusinessId(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <Button 
          onClick={onCreate} 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <span className="inline-flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Создание...
            </span>
          ) : (
            <>
              <MessageSquarePlus className="mr-2 h-4 w-4" />
              Создать чат-бот
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}