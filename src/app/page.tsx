// src/app/page.tsx
// Просто переадресуем на страницу логина или пишем приветствие
import { redirect } from "next/navigation"

export default function Home() {
  // Редирект на логин, чтобы пользователь сразу попадал на форму
  redirect("/auth/login")
  return null
}
