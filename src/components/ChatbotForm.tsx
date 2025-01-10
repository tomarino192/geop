// src/components/ChatbotForm.tsx
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { MessageSquarePlus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Separator } from "@/components/ui/separator"
import { useLocale } from "@/context/LocaleContext"

export default function ChatbotForm({
  onCreated,
  businesses
}: {
  onCreated: () => void
  businesses: any[]
}) {
  const { t } = useLocale()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const [name, setName] = useState("")
  const [businessId, setBusinessId] = useState("")
  const [templateKey, setTemplateKey] = useState("T1")
  const [mlEnabled, setMlEnabled] = useState(false)
  const [botWorkingDays, setBotWorkingDays] = useState<string[]>([])
  const [botStartTime, setBotStartTime] = useState("09:00")
  const [botEndTime, setBotEndTime] = useState("18:00")
  const [botWorkSaturday, setBotWorkSaturday] = useState(false)
  const [botStartTimeSat, setBotStartTimeSat] = useState("10:00")
  const [botEndTimeSat, setBotEndTimeSat] = useState("16:00")
  const [botWorkSunday, setBotWorkSunday] = useState(false)
  const [botStartTimeSun, setBotStartTimeSun] = useState("10:00")
  const [botEndTimeSun, setBotEndTimeSun] = useState("16:00")
  const paymentOptions = ["Банковские карты", "Наличные", "Kaspi", "Halyk", "Freedom", "Forte"]
  const [paymentMethods, setPaymentMethods] = useState<string[]>([])
  const [deliveryOptions, setDeliveryOptions] = useState<{ name: string; price: string; time: string }[]>([])
  const [deliveryName, setDeliveryName] = useState("")
  const [deliveryPrice, setDeliveryPrice] = useState("")
  const [deliveryTime, setDeliveryTime] = useState("")
  const [selectedBusiness, setSelectedBusiness] = useState<any | null>(null)
  const workingDaysLabels = t("chatbotForm.workingDays") as unknown as string[]

  useEffect(() => {
    if (!businessId) {
      setSelectedBusiness(null)
      return
    }
    const token = localStorage.getItem("token")
    fetch(`/api/business/${businessId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) {
          setSelectedBusiness(data)
        } else {
          setSelectedBusiness(null)
        }
      })
      .catch(() => setSelectedBusiness(null))
  }, [businessId])

  const toggleBotDay = (day: string) => {
    setBotWorkingDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    )
  }

  const addDelivery = () => {
    if (!deliveryName.trim()) {
      toast({
        variant: "destructive",
        title: t("common.error"),
        description: "Укажите название способа доставки"
      })
      return
    }
    setDeliveryOptions((prev) => [
      ...prev,
      {
        name: deliveryName.trim(),
        price: deliveryPrice.trim(),
        time: deliveryTime.trim()
      }
    ])
    setDeliveryName("")
    setDeliveryPrice("")
    setDeliveryTime("")
  }

  const onCreate = async () => {
    if (!name.trim() || !businessId.trim()) {
      toast({
        variant: "destructive",
        title: t("common.error"),
        description: "Пожалуйста, укажите название чат-бота и бизнес"
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
          businessId: businessId.trim(),
          templateKey,
          mlEnabled,
          botWorkingDays,
          botStartTime,
          botEndTime,
          botWorkSaturday,
          botStartTimeSat,
          botEndTimeSat,
          botWorkSunday,
          botStartTimeSun,
          botEndTimeSun,
          paymentMethods,
          deliveryOptions
        })
      })
      const data = await res.json()
      if (data.error) {
        toast({
          variant: "destructive",
          title: t("common.error"),
          description: data.error
        })
      } else {
        toast({
          title: t("common.success"),
          description: "Чат-бот успешно создан!"
        })
        onCreated()
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: t("common.error"),
        description: "Произошла ошибка при создании чат-бота"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg">{t("chatbotForm.title")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>{t("chatbotForm.nameLabel")}</Label>
            <Input
              placeholder="Мой бот"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>{t("chatbotForm.businessLabel")}</Label>
            <Select value={businessId} onValueChange={setBusinessId}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите бизнес" />
              </SelectTrigger>
              <SelectContent>
                {businesses.map((biz: any) => (
                  <SelectItem key={biz.id} value={biz.id}>
                    {biz.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedBusiness && (
              <div className="mt-2 p-2 border rounded bg-gray-50 text-sm">
                <p className="font-medium mb-1">Часы работы выбранного бизнеса:</p>
                <p>Будни: {selectedBusiness.workingDays?.join(", ") || "—"} ({selectedBusiness.startTime}—{selectedBusiness.endTime})</p>
                {selectedBusiness.workSaturday && (
                  <p>
                    Суббота: {selectedBusiness.startTimeSat}—{selectedBusiness.endTimeSat}
                  </p>
                )}
                {selectedBusiness.workSunday && (
                  <p>
                    Воскресенье: {selectedBusiness.startTimeSun}—{selectedBusiness.endTimeSun}
                  </p>
                )}
              </div>
            )}
          </div>
          <div className="space-y-2">
            <Label>{t("chatbotForm.templateLabel")}</Label>
            <Select value={templateKey} onValueChange={setTemplateKey}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите шаблон" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5].map((num) => (
                  <SelectItem key={num} value={`T${num}`}>
                    Шаблон {num}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <Separator />
        <div className="flex items-center space-x-2">
          <Switch id="mlEnabled" checked={mlEnabled} onCheckedChange={setMlEnabled} />
          <Label htmlFor="mlEnabled">Включить машинное обучение</Label>
        </div>
        <Separator />
        <div className="space-y-4">
          <Label className="text-base">Часы работы чат-бота</Label>
          <div className="grid grid-cols-5 gap-4">
            {workingDaysLabels?.map((day) => (
              <div key={day} className="flex items-center space-x-2">
                <Checkbox
                  id={day}
                  checked={botWorkingDays.includes(day)}
                  onCheckedChange={() => toggleBotDay(day)}
                />
                <Label htmlFor={day}>{day}</Label>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Начало (будни)</Label>
              <Input
                type="time"
                value={botStartTime}
                onChange={(e) => setBotStartTime(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Конец (будни)</Label>
              <Input
                type="time"
                value={botEndTime}
                onChange={(e) => setBotEndTime(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center space-x-2 mt-4">
            <Switch
              id="botWorkSaturday"
              checked={botWorkSaturday}
              onCheckedChange={setBotWorkSaturday}
            />
            <Label htmlFor="botWorkSaturday">Суббота</Label>
          </div>
          {botWorkSaturday && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Начало (Сб)</Label>
                <Input
                  type="time"
                  value={botStartTimeSat}
                  onChange={(e) => setBotStartTimeSat(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Конец (Сб)</Label>
                <Input
                  type="time"
                  value={botEndTimeSat}
                  onChange={(e) => setBotEndTimeSat(e.target.value)}
                />
              </div>
            </div>
          )}
          <div className="flex items-center space-x-2 mt-4">
            <Switch
              id="botWorkSunday"
              checked={botWorkSunday}
              onCheckedChange={setBotWorkSunday}
            />
            <Label htmlFor="botWorkSunday">Воскресенье</Label>
          </div>
          {botWorkSunday && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Начало (Вс)</Label>
                <Input
                  type="time"
                  value={botStartTimeSun}
                  onChange={(e) => setBotStartTimeSun(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Конец (Вс)</Label>
                <Input
                  type="time"
                  value={botEndTimeSun}
                  onChange={(e) => setBotEndTimeSun(e.target.value)}
                />
              </div>
            </div>
          )}
        </div>
        <Separator />
        <div className="space-y-4">
          <Label className="text-base">{t("chatbotForm.paymentTitle")}</Label>
          <div className="grid grid-cols-2 gap-4">
            {paymentOptions.map((method) => (
              <div key={method} className="flex items-center space-x-2">
                <Checkbox
                  id={method}
                  checked={paymentMethods.includes(method)}
                  onCheckedChange={(checked) => {
                    setPaymentMethods((prev) =>
                      checked ? [...prev, method] : prev.filter((m) => m !== method)
                    )
                  }}
                />
                <Label htmlFor={method}>{method}</Label>
              </div>
            ))}
          </div>
        </div>
        <Separator />
        <div className="space-y-4">
          <Label className="text-base">{t("chatbotForm.deliveryTitle")}</Label>
          <div className="grid grid-cols-3 gap-4">
            <Input
              placeholder="Название"
              value={deliveryName}
              onChange={(e) => setDeliveryName(e.target.value)}
            />
            <Input
              placeholder="Цена"
              value={deliveryPrice}
              onChange={(e) => setDeliveryPrice(e.target.value)}
            />
            <Input
              placeholder="Срок доставки"
              value={deliveryTime}
              onChange={(e) => setDeliveryTime(e.target.value)}
            />
          </div>
          <Button onClick={addDelivery} variant="secondary" className="w-full">
            {t("chatbotForm.addDelivery")}
          </Button>
          {deliveryOptions.length > 0 && (
            <div className="border rounded-lg p-4 space-y-2">
              {deliveryOptions.map((opt, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <span>{opt.name}</span>
                  <span className="text-muted-foreground">
                    {opt.price} • {opt.time}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
        <Button onClick={onCreate} disabled={isLoading} className="w-full">
          {isLoading ? (
            <span className="inline-flex items-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              {t("common.loading")}
            </span>
          ) : (
            <>
              <MessageSquarePlus className="mr-2 h-4 w-4" />
              {t("chatbotForm.createBot")}
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
