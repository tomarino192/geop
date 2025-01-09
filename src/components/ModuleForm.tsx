import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Puzzle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function ModuleForm({ onCreated }: { onCreated: () => void }) {
  const [name, setName] = useState("")
  const [config, setConfig] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const validateJSON = (text: string): { valid: boolean; parsed: any } => {
    if (!text.trim()) return { valid: true, parsed: {} }
    try {
      const parsed = JSON.parse(text)
      return { valid: true, parsed }
    } catch (e) {
      return { valid: false, parsed: null }
    }
  }

  const onCreate = async () => {
    if (!name.trim()) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Пожалуйста, введите название модуля"
      })
      return
    }

    const { valid, parsed: parsedConfig } = validateJSON(config)
    if (!valid) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Некорректный JSON в поле конфигурации"
      })
      return
    }

    setIsLoading(true)
    try {
      const token = localStorage.getItem("token")
      const res = await fetch("/api/module", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ 
          name: name.trim(), 
          config: parsedConfig 
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
          description: "Модуль успешно создан!"
        })
        setName("")
        setConfig("")
        onCreated()
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Произошла ошибка при создании модуля"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      onCreate()
    }
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg">Добавить новый модуль</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          placeholder="Название модуля"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <Textarea
          placeholder={'Конфигурация в формате JSON\nНапример: {"key": "value"}'}
          value={config}
          onChange={(e) => setConfig(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={4}
          className="font-mono resize-y min-h-[100px]"
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
              <Puzzle className="mr-2 h-4 w-4" />
              Создать модуль
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}