"use client"

import { useState, useEffect } from "react"
import { Edit, Trash2 } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import ChatbotForm from "@/components/ChatbotForm"
import "@/locales/ru"
import "@/locales/kk"
import "@/locales/en"
import { useLocale } from "@/context/LocaleContext"

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

const paymentOptions = ["Банковские карты", "Наличные", "Kaspi", "Halyk", "Freedom", "Forte"]

export default function ChatbotsPage() {
  const { t } = useLocale()
  const { toast } = useToast()
  const [chatbots, setChatbots] = useState<any[]>([])
  const [businesses, setBusinesses] = useState<any[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [payload, setPayload] = useState<any>(null)const [customPaymentMethod, setCustomPaymentMethod] = useState("")
  const [deliveryName, setDeliveryName] = useState("")
  const [deliveryPrice, setDeliveryPrice] = useState("")
  const [deliveryTime, setDeliveryTime] = useState("")

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      // Декодируем JWT токен для получения payload
      const base64Url = token.split('.')[1]
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const jsonPayload = decodeURIComponent(window.atob(base64).split('').map((c) => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      }).join(''))
      setPayload(JSON.parse(jsonPayload))
    }
  }, [])

  const fetchBusinesses = async () => {
    try {
      const res = await fetch("/api/business", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      })
      const data = await res.json()
      if (data.error) {
        toast({
          variant: "destructive",
          title: "Ошибка",
          description: "Не удалось загрузить список бизнесов"
        })
      } else {
        setBusinesses(data)
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Произошла ошибка при загрузке бизнесов"
      })
    }
  }

  const fetchChatbots = async () => {
    try {
      const res = await fetch("/api/chatbot", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      })
      const data = await res.json()
      if (data.error) {
        toast({
          variant: "destructive",
          title: "Ошибка",
          description: "Не удалось загрузить список чат-ботов"
        })
      } else {
        setChatbots(data)
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Произошла ошибка при загрузке чат-ботов"
      })
    }
  }

  const fetchData = async () => {
    setIsLoading(true)
    await Promise.all([fetchBusinesses(), fetchChatbots()])
    setIsLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleEdit = (bot: any) => {
    setEditingId(bot.id)
    setEditName(bot.name)
  }

  const saveEdit = async (id: string) => {
    try {
      const botToUpdate = chatbots.find(b => b.id === id)
      if (!botToUpdate) return

      const res = await fetch("/api/chatbot", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          id,
          name: editName,
          mlEnabled: botToUpdate.mlEnabled,
          paymentMethods: botToUpdate.paymentMethods,
          deliveryOptions: botToUpdate.deliveryOptions
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
          description: "Чат-бот обновлен"
        })
        setEditingId(null)
        setEditName("")
        fetchChatbots()
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Произошла ошибка при обновлении чат-бота"
      })
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/chatbot?id=${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
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
          description: "Чат-бот удален"
        })
        fetchChatbots()
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Произошла ошибка при удалении чат-бота"
      })
    }
  }

  if (isLoading) {
    return <div>Загрузка...</div>
  }

  return (
    <div className="space-y-6">
      <ChatbotForm 
        onCreated={fetchChatbots}
        businesses={businesses}
      />

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Список чат-ботов</h2>
        
        {chatbots.map((bot) => (
          <Card key={bot.id}>
            <CardContent className="pt-6">
              {editingId === bot.id ? (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Label>Название</Label>
                      <Input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="max-w-sm"
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        id={`mlEnabled-${bot.id}`}
                        checked={bot.mlEnabled}
                        onCheckedChange={(checked) => {
                          setChatbots(chatbots.map(b => 
                            b.id === bot.id ? {...b, mlEnabled: checked} : b
                          ))
                        }}
                      />
                      <Label htmlFor={`mlEnabled-${bot.id}`}>Машинное обучение</Label>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-base">Способы оплаты</Label>
                      <div className="grid grid-cols-2 gap-4">
                        {paymentOptions.map((method) => (
                          <div key={method} className="flex items-center space-x-2">
                            <Checkbox
                              id={`${method}-${bot.id}`}
                              checked={bot.paymentMethods?.includes(method)}
                              onCheckedChange={(checked) => {
                                setChatbots(chatbots.map(b => 
                                  b.id === bot.id ? {
                                    ...b, 
                                    paymentMethods: checked 
                                      ? [...(b.paymentMethods || []), method]
                                      : (b.paymentMethods || []).filter(m => m !== method)
                                  } : b
                                ))
                              }}
                            />
                            <Label htmlFor={`${method}-${bot.id}`}>{method}</Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Label className="text-base">Способы доставки</Label>
                      {bot.deliveryOptions?.map((opt: any, idx: number) => (
                        <div key={idx} className="flex items-center space-x-2">
                          <Input
                            value={opt.name}
                            onChange={(e) => {
                              const newOptions = [...bot.deliveryOptions];
                              newOptions[idx] = {...opt, name: e.target.value};
                              setChatbots(chatbots.map(b => 
                                b.id === bot.id ? {...b, deliveryOptions: newOptions} : b
                              ));
                            }}
                            placeholder="Название"
                            className="flex-1"
                          />
                          <Input
                            value={opt.price}
                            onChange={(e) => {
                              const newOptions = [...bot.deliveryOptions];
                              newOptions[idx] = {...opt, price: e.target.value};
                              setChatbots(chatbots.map(b => 
                                b.id === bot.id ? {...b, deliveryOptions: newOptions} : b
                              ));
                            }}
                            placeholder="Цена"
                            className="flex-1"
                          />
                          <Input
                            value={opt.time}
                            onChange={(e) => {
                              const newOptions = [...bot.deliveryOptions];
                              newOptions[idx] = {...opt, time: e.target.value};
                              setChatbots(chatbots.map(b => 
                                b.id === bot.id ? {...b, deliveryOptions: newOptions} : b
                              ));
                            }}
                            placeholder="Время"
                            className="flex-1"
                          />
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => {
                              setChatbots(chatbots.map(b => 
                                b.id === bot.id ? {
                                  ...b, 
                                  deliveryOptions: b.deliveryOptions.filter((_: any, i: number) => i !== idx)
                                } : b
                              ));
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 mt-4">
                    <Button variant="default" onClick={() => saveEdit(bot.id)}>
                      Сохранить
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setEditingId(null)
                        setEditName("")
                        fetchChatbots() // Сбрасываем изменения
                      }}
                    >
                      Отмена
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h3 className="font-semibold">{bot.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Владелец: {bot.business?.ownerId === payload?.userId ? t("chatbotForm.you") : bot.business?.owner?.name}
                      </p>
                      <p className="text-sm text-muted-foreground">ID: {bot.id}</p>
                      <p className="text-sm">Машинное обучение: {bot.mlEnabled ? "Включено" : "Выключено"}</p>
                    </div>
                    
                    {bot.paymentMethods?.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-medium">Способы оплаты:</h4>
                        <div className="flex flex-wrap gap-2">
                          {bot.paymentMethods.map((method: string) => (
                            <span key={method} className="px-2 py-1 bg-secondary rounded-md text-sm">
                              {method}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {bot.deliveryOptions?.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-medium">Способы доставки:</h4>
                        <div className="space-y-1">
                          {bot.deliveryOptions.map((opt: any, idx: number) => (
                            <div key={idx} className="text-sm flex justify-between">
                              <span>{opt.name}</span>
                              <span className="text-muted-foreground">
                                {opt.price} • {opt.time}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
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
    </div>
  )
}