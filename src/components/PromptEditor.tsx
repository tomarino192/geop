import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Bot, Building2, FileEdit, ListTodo, Package2, Phone } from "lucide-react"
import { universalPrompt } from "@/prompts/universalPrompt"

export default function PromptEditor() {
  const [businessName, setBusinessName] = useState("")
  const [chatbotName, setChatbotName] = useState("")
  const [chatbotTask, setChatbotTask] = useState("")
  const [services, setServices] = useState("")
  const [modules, setModules] = useState("")
  const [contacts, setContacts] = useState("")
  const [language, setLanguage] = useState("Русском")

  const preview = universalPrompt
    .replace("[BUSINESS_NAME]", businessName)
    .replace("[CHATBOT_NAME]", chatbotName)
    .replace("[CHATBOT_TASK]", chatbotTask)
    .replace("[BUSINESS_SERVICES]", services)
    .replace("[CHATBOT_MODULES]", modules)
    .replace("[BUSINESS_CONTACTS]", contacts)
    .replace("[LANGUAGE]", language)

  const InputField = ({ 
    label, 
    value, 
    onChange, 
    placeholder,
    icon: Icon
  }) => (
    <div className="space-y-2">
      <Label className="flex items-center gap-2">
        <Icon className="h-4 w-4" />
        {label}
      </Label>
      <Input
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  )

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileEdit className="h-5 w-5" />
            Редактор промпта
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <InputField
            label="Название бизнеса"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            placeholder="Например: ООО 'Компания'"
            icon={Building2}
          />
          
          <InputField
            label="Имя чат-бота"
            value={chatbotName}
            onChange={(e) => setChatbotName(e.target.value)}
            placeholder="Например: Ассистент Алиса"
            icon={Bot}
          />
          
          <InputField
            label="Задача чат-бота"
            value={chatbotTask}
            onChange={(e) => setChatbotTask(e.target.value)}
            placeholder="Например: Консультация клиентов по услугам"
            icon={ListTodo}
          />
          
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Package2 className="h-4 w-4" />
              Список товаров/услуг
            </Label>
            <Textarea
              placeholder="Введите список товаров или услуг, каждый с новой строки"
              value={services}
              onChange={(e) => setServices(e.target.value)}
              className="min-h-[100px] resize-y"
            />
          </div>
          
          <InputField
            label="Подключенные модули"
            value={modules}
            onChange={(e) => setModules(e.target.value)}
            placeholder="Например: FAQ, Запись на прием"
            icon={Package2}
          />
          
          <InputField
            label="Контакты"
            value={contacts}
            onChange={(e) => setContacts(e.target.value)}
            placeholder="Например: +7 (XXX) XXX-XX-XX, email@example.com"
            icon={Phone}
          />
          
          <div className="space-y-2">
            <Label>Язык общения</Label>
            <Select
              value={language}
              onValueChange={setLanguage}
            >
              <SelectTrigger>
                <SelectValue/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Русском">Русский</SelectItem>
                <SelectItem value="Казахском">Казахский</SelectItem>
                <SelectItem value="Английском">Английский</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Предпросмотр промпта</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="whitespace-pre-wrap bg-gray-50 p-4 rounded-lg text-sm font-mono">
            {preview}
          </pre>
        </CardContent>
      </Card>
    </div>
  )
}