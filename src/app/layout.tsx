// src/app/layout.tsx
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"
import { ReactNode } from "react"
import { LocaleProvider } from "@/context/LocaleContext"

export const metadata = {
  title: "Geopard Admin Panel",
  description: "Управление чат-ботами и бизнесами"
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru">
      <body className="text-gray-800">
        <LocaleProvider>
          {children}
          </LocaleProvider>
        <Toaster />
      </body>
    </html>
  )
}
