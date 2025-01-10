// src/components/BusinessForm.tsx
"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { useLocale } from "@/context/LocaleContext"
import { Separator } from "@/components/ui/separator"

export default function BusinessForm({ onCreated }: { onCreated: () => void }) {
  const { t } = useLocale()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    promoLink: "",
    phone: "",
    geo: "",
    style: "",
    targetAction: "",
    workingDays: [] as string[],
    startTime: "09:00",
    endTime: "18:00",
    workSaturday: false,
    startTimeSat: "10:00",
    endTimeSat: "16:00",
    workSunday: false,
    startTimeSun: "10:00",
    endTimeSun: "16:00",
    catalogType: "google",
    catalogLink: "",
    catalogApiKey: "",
    faqLink: ""
  })
  const workingDaysLabels = t("chatbotForm.workingDays") as unknown as string[]

  const toggleWorkingDay = (day: string) => {
    setFormData((prev) => ({
      ...prev,
      workingDays: prev.workingDays.includes(day)
        ? prev.workingDays.filter((d) => d !== day)
        : [...prev.workingDays, day]
    }))
  }

  const handleChange =
    (field: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value
      }))
    }

  const onCreate = async () => {
    if (!formData.name.trim()) {
      toast({
        variant: "destructive",
        title: t("common.error"),
        description: "Пожалуйста, введите название бизнеса"
      })
      return
    }
    setIsLoading(true)
    try {
      const token = localStorage.getItem("token")
      const res = await fetch("/api/business", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          name: formData.name.trim()
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
          description: "Бизнес успешно создан!"
        })
        setFormData({
          name: "",
          type: "",
          promoLink: "",
          phone: "",
          geo: "",
          style: "",
          targetAction: "",
          workingDays: [],
          startTime: "09:00",
          endTime: "18:00",
          workSaturday: false,
          startTimeSat: "10:00",
          endTimeSat: "16:00",
          workSunday: false,
          startTimeSun: "10:00",
          endTimeSun: "16:00",
          catalogType: "google",
          catalogLink: "",
          catalogApiKey: "",
          faqLink: ""
        })
        onCreated()
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: t("common.error"),
        description: "Произошла ошибка при создании бизнеса"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="mb-6 border bg-card">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold">Добавить новый бизнес</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-0">
        <div>
          <Label htmlFor="name">Название бизнеса</Label>
          <Input
            id="name"
            placeholder="Название бизнеса"
            value={formData.name}
            onChange={handleChange("name")}
          />
        </div>
        <div>
          <Label htmlFor="type">Тип бизнеса</Label>
          <Input
            id="type"
            placeholder="Например: цветочный магазин"
            value={formData.type}
            onChange={handleChange("type")}
          />
        </div>
        <div>
          <Label htmlFor="promoLink">Ссылка на Google таблицу (промо)</Label>
          <Input
            id="promoLink"
            placeholder="https://docs.google.com/spreadsheets/..."
            value={formData.promoLink}
            onChange={handleChange("promoLink")}
          />
        </div>
        <div>
          <Label htmlFor="phone">Телефон для связи</Label>
          <Input
            id="phone"
            placeholder="+7 (___) ___-__-__"
            value={formData.phone}
            onChange={handleChange("phone")}
          />
        </div>
        <div>
          <Label htmlFor="geo">Адрес</Label>
          <Input
            id="geo"
            placeholder="Например: Актобе, ул.Сырым Датова 38"
            value={formData.geo}
            onChange={handleChange("geo")}
          />
        </div>
        <div>
          <Label htmlFor="style">Стиль общения</Label>
          <Input
            id="style"
            placeholder="Прямой и четкий, Дружелюбный..."
            value={formData.style}
            onChange={handleChange("style")}
          />
        </div>
        <div>
          <Label htmlFor="targetAction">Целевое действие</Label>
          <select
            id="targetAction"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={formData.targetAction}
            onChange={handleChange("targetAction")}
          >
            <option value="">Не выбрано</option>
            <option value="purchase">Покупка</option>
            <option value="booking">Бронирование</option>
            <option value="leadgen">Лидогенерация</option>
            <option value="support">Поддержка</option>
          </select>
        </div>
        <Separator />
        <div className="space-y-4">
          <Label className="text-base">Часы работы (бизнес)</Label>
          <div className="grid grid-cols-5 gap-4">
            {workingDaysLabels?.map((day) => (
              <div key={day} className="flex items-center space-x-2">
                <Checkbox
                  id={day}
                  checked={formData.workingDays.includes(day)}
                  onCheckedChange={() => toggleWorkingDay(day)}
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
                value={formData.startTime}
                onChange={handleChange("startTime")}
              />
            </div>
            <div className="space-y-2">
              <Label>Конец (будни)</Label>
              <Input
                type="time"
                value={formData.endTime}
                onChange={handleChange("endTime")}
              />
            </div>
          </div>
          <div className="flex items-center space-x-2 mt-4">
            <Switch
              id="workSaturday"
              checked={formData.workSaturday}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({ ...prev, workSaturday: checked }))
              }
            />
            <Label htmlFor="workSaturday">Суббота</Label>
          </div>
          {formData.workSaturday && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Начало (Сб)</Label>
                <Input
                  type="time"
                  value={formData.startTimeSat}
                  onChange={handleChange("startTimeSat")}
                />
              </div>
              <div className="space-y-2">
                <Label>Конец (Сб)</Label>
                <Input
                  type="time"
                  value={formData.endTimeSat}
                  onChange={handleChange("endTimeSat")}
                />
              </div>
            </div>
          )}
          <div className="flex items-center space-x-2 mt-4">
            <Switch
              id="workSunday"
              checked={formData.workSunday}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({ ...prev, workSunday: checked }))
              }
            />
            <Label htmlFor="workSunday">Воскресенье</Label>
          </div>
          {formData.workSunday && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Начало (Вс)</Label>
                <Input
                  type="time"
                  value={formData.startTimeSun}
                  onChange={handleChange("startTimeSun")}
                />
              </div>
              <div className="space-y-2">
                <Label>Конец (Вс)</Label>
                <Input
                  type="time"
                  value={formData.endTimeSun}
                  onChange={handleChange("endTimeSun")}
                />
              </div>
            </div>
          )}
        </div>
        <Separator />
<div className="space-y-4">
  <Label className="text-base">{t("chatbotForm.catalogTitle")}</Label>
  <Select value={formData.catalogType} 
         onValueChange={(value) => setFormData(prev => ({...prev, catalogType: value}))}>
    <SelectTrigger>
      <SelectValue placeholder="Выберите тип каталога" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="google">{t("chatbotForm.googleCatalog")}</SelectItem>
      <SelectItem value="posiflora">{t("chatbotForm.posifloraCatalog")}</SelectItem>
    </SelectContent>
  </Select>
  {formData.catalogType === "google" && (
    <div className="space-y-2">
      <Label>Ссылка на Google таблицу</Label>
      <Input
        placeholder="https://docs.google.com/spreadsheets/..."
        value={formData.catalogLink}
        onChange={handleChange("catalogLink")}
      />
    </div>
  )}
  {formData.catalogType === "posiflora" && (
    <div className="space-y-2">
      <Label>API ключ Posiflora</Label>
      <Input
        placeholder="APIKEY_XXXXXX"
        value={formData.catalogApiKey}
        onChange={handleChange("catalogApiKey")}
      />
    </div>
  )}
</div>
<Separator />
<div className="space-y-2">
  <Label className="text-base">{t("chatbotForm.faqLabel")}</Label>
  <Input
    placeholder="Ссылка на Google таблицу..."
    value={formData.faqLink}
    onChange={handleChange("faqLink")}
  />
</div>
        <Button onClick={onCreate} disabled={isLoading} className="w-full">
          {isLoading ? "Создание..." : "Создать бизнес"}
        </Button>
      </CardContent>
    </Card>
  )
}
