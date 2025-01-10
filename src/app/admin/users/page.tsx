"use client"

import { useState, useEffect } from "react"
import { Edit, Trash2, Mail, User, Building2, Globe, ArrowUpDown, Shield } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Switch } from "@/components/ui/switch"
import {
 Select,
 SelectContent,
 SelectItem,
 SelectTrigger,
 SelectValue,
} from "@/components/ui/select"
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
import { Alert, AlertDescription } from "@/components/ui/alert"

type SortField = "id" | "email" | "role"
type SortOrder = "asc" | "desc"

export default function UsersPage() {
 const { toast } = useToast()
 const [users, setUsers] = useState<any[]>([])
 const [filteredUsers, setFilteredUsers] = useState<any[]>([])
 const [error, setError] = useState<string | null>(null)
 const [editingId, setEditingId] = useState<string | null>(null)
 const [editRole, setEditRole] = useState("")
 const [editLocked, setEditLocked] = useState(false)
 const [editLang, setEditLang] = useState("")
 const [searchEmail, setSearchEmail] = useState("")
 const [sortField, setSortField] = useState<SortField>("id")
 const [sortOrder, setSortOrder] = useState<SortOrder>("asc")

 const fetchData = async () => {
   const res = await fetch("/api/user", {
     headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
   })
   const data = await res.json()

   if (data.error) {
     setError(data.error)
     setUsers([])
   } else if (Array.isArray(data)) {
     setError(null)
     setUsers(data)
     setFilteredUsers(data)
   } else {
     setError("Неизвестный ответ от сервера")
     setUsers([])
   }
 }

 useEffect(() => {
   fetchData()
 }, [])

 useEffect(() => {
   let result = [...users]
   
   if (searchEmail) {
     result = result.filter(user => 
       user.email.toLowerCase().includes(searchEmail.toLowerCase())
     )
   }
   
   result.sort((a, b) => {
     if (sortOrder === "asc") {
       return a[sortField] > b[sortField] ? 1 : -1
     } else {
       return a[sortField] < b[sortField] ? 1 : -1
     }
   })

   setFilteredUsers(result)
 }, [users, searchEmail, sortField, sortOrder])

 const toggleSort = (field: SortField) => {
   if (sortField === field) {
     setSortOrder(prev => prev === "asc" ? "desc" : "asc")
   } else {
     setSortField(field)
     setSortOrder("asc")
   }
 }

 const handleEdit = (user: any) => {
   setEditingId(user.id)
   setEditRole(user.role)
   setEditLocked(user.accountLocked)
   setEditLang(user.lang || '')
 }

 const saveEdit = async (id: string) => {
   const res = await fetch("/api/user", {
     method: "PATCH",
     headers: {
       "Content-Type": "application/json",
       Authorization: `Bearer ${localStorage.getItem("token")}`
     },
     body: JSON.stringify({ 
       id,
       role: editRole,
       accountLocked: editLocked,
       lang: editLang 
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
       title: "Успех",
       description: "Данные пользователя обновлены"
     })
   }
   setEditingId(null)
   setEditRole("")
   setEditLocked(false)
   setEditLang("")
   fetchData()
 }

 const handleDelete = async (id: string) => {
   const res = await fetch(`/api/user?id=${id}`, {
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
       title: "Успех",
       description: data.message || "Пользователь удалён"
     })
     fetchData()
   }
 }

 if (error) {
   return (
     <div className="space-y-4">
       <h2 className="text-2xl font-bold">Пользователи</h2>
       <Alert variant="destructive">
         <AlertDescription>{error}</AlertDescription>
       </Alert>
     </div>
   )
 }

 return (
   <div className="space-y-4">
     <h2 className="text-2xl font-bold">Пользователи</h2>
     
     <div className="flex flex-col sm:flex-row gap-4 mb-4">
       <div className="relative flex-1">
         <Mail className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
         <Input
           placeholder="Поиск по email..."
           value={searchEmail}
           onChange={(e) => setSearchEmail(e.target.value)}
           className="pl-8"
         />
       </div>
       <div className="flex gap-2">
         {(["id", "email", "role"] as SortField[]).map((field) => (
           <Button
             key={field}
             variant="outline"
             size="sm"
             onClick={() => toggleSort(field)}
             className="flex items-center gap-1"
           >
             {field}
             {sortField === field && (
               <ArrowUpDown className="h-4 w-4" />
             )}
           </Button>
         ))}
       </div>
     </div>

     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
       {filteredUsers.map((user) => (
         <Card key={user.id}>
           <CardContent className="pt-6">
             {editingId === user.id ? (
               <div className="space-y-4">
                 <div className="space-y-2">
                   <Label className="flex items-center gap-2">
                     <Mail className="h-4 w-4" />
                     Email: {user.email}
                   </Label>
                 </div>
                 <div className="space-y-2">
                   <Label htmlFor="role" className="flex items-center gap-2">
                     <Shield className="h-4 w-4" />
                     Роль:
                   </Label>
                   <Select value={editRole} onValueChange={setEditRole}>
                     <SelectTrigger>
                       <SelectValue placeholder="Выберите роль" />
                     </SelectTrigger>
                     <SelectContent>
                       <SelectItem value="USER">User</SelectItem>
                       <SelectItem value="ADMIN">Admin</SelectItem>
                     </SelectContent>
                   </Select>
                 </div>
                 <div className="flex items-center space-x-2">
                   <Switch
                     id="locked"
                     checked={editLocked}
                     onCheckedChange={setEditLocked}
                   />
                   <Label htmlFor="locked">Аккаунт заблокирован</Label>
                 </div>
                 <div className="space-y-2">
                   <Label htmlFor="lang" className="flex items-center gap-2">
                     <Globe className="h-4 w-4" />
                     Язык:
                   </Label>
                   <Select value={editLang} onValueChange={setEditLang}>
                     <SelectTrigger>
                       <SelectValue placeholder="Выберите язык" />
                     </SelectTrigger>
                     <SelectContent>
                       <SelectItem value="ru">Русский</SelectItem>
                       <SelectItem value="kk">Казахский</SelectItem>
                       <SelectItem value="en">English</SelectItem>
                     </SelectContent>
                   </Select>
                 </div>
                 <div className="flex space-x-2">
                   <Button onClick={() => saveEdit(user.id)}>
                     Сохранить
                   </Button>
                   <Button
                     variant="outline"
                     onClick={() => {
                       setEditingId(null)
                       setEditRole("")
                       setEditLocked(false)
                       setEditLang("")
                     }}
                   >
                     Отмена
                   </Button>
                 </div>
               </div>
             ) : (
               <>
                 <div className="space-y-2">
                   <p className="flex items-center gap-2">
                     <Mail className="h-4 w-4" />
                     <span className="font-medium">Email:</span> {user.email}
                   </p>
                   <p className="flex items-center gap-2">
                     <Shield className="h-4 w-4" />
                     <span className="font-medium">Роль:</span> {user.role}
                   </p>
                   <p className="flex items-center gap-2">
                     <Globe className="h-4 w-4" />
                     <span className="font-medium">Язык:</span> {user.lang || 'Не указан'}
                   </p>
                   <p className="flex items-center gap-2">
                     <User className="h-4 w-4" />
                     <span className="font-medium">Статус:</span>{" "}
                     {user.accountLocked ? "Заблокирован" : "Активен"}
                   </p>
                   
                   {user.businesses && user.businesses.length > 0 && (
                     <div className="mt-4">
                       <p className="font-medium flex items-center gap-2 mb-2">
                         <Building2 className="h-4 w-4" />
                         Бизнесы:
                       </p>
                       <div className="pl-6 space-y-1">
                         {user.businesses.map((business: any) => (
                           <p key={business.id} className="text-sm">
                             • {business.name}
                           </p>
                         ))}
                       </div>
                     </div>
                   )}
                 </div>
                 <div className="flex items-center space-x-2 mt-4">
                   <Button 
                     variant="ghost" 
                     size="icon"
                     onClick={() => handleEdit(user)}
                     title="Редактировать"
                   >
                     <Edit className="h-4 w-4" />
                   </Button>
                   
                   <AlertDialog>
                     <AlertDialogTrigger asChild>
                       <Button 
                         variant="ghost" 
                         size="icon"
                         className="text-destructive hover:text-destructive"
                       >
                         <Trash2 className="h-4 w-4" />
                       </Button>
                     </AlertDialogTrigger>
                     <AlertDialogContent>
                       <AlertDialogHeader>
                         <AlertDialogTitle>Подтверждение удаления</AlertDialogTitle>
                         <AlertDialogDescription>
                           Вы уверены, что хотите удалить этого пользователя? Это действие необратимо.
                         </AlertDialogDescription>
                       </AlertDialogHeader>
                       <AlertDialogFooter>
                         <AlertDialogCancel>Отмена</AlertDialogCancel>
                         <AlertDialogAction 
                           onClick={() => handleDelete(user.id)}
                         >
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