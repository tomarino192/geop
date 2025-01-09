"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Building2,
  MessageSquare,
  Boxes,
  ScrollText,
  Users
} from "lucide-react"
import { Button } from "@/components/ui/button"

const navItems = [
  { 
    href: "/admin/dashboard", 
    label: "Dashboard",
    icon: LayoutDashboard
  },
  { 
    href: "/admin/businesses", 
    label: "Бизнесы",
    icon: Building2
  },
  { 
    href: "/admin/chatbots",  
    label: "Чат-боты",
    icon: MessageSquare
  },
  { 
    href: "/admin/modules",   
    label: "Модули",
    icon: Boxes
  },
  { 
    href: "/admin/logs",      
    label: "Логи",
    icon: ScrollText
  },
  { 
    href: "/admin/users",     
    label: "Пользователи",
    icon: Users
  }
]

export default function AdminNav() {
  const pathname = usePathname()

  return (
    <nav className="flex flex-col p-4 space-y-2">
      <h2 className="text-xl font-bold mb-4 px-2 text-white">Geopard Admin</h2>
      {navItems.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.href
        return (
          <Button
            key={item.href}
            variant="ghost"
            asChild
            className={cn(
              "w-full justify-start gap-2 text-gray-300 hover:text-white hover:bg-gray-700/50",
              isActive && "bg-gray-700/70 text-white hover:bg-gray-700/70"
            )}
          >
            <Link href={item.href} className="flex items-center gap-2">
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          </Button>
        )
      })}
    </nav>
  )
}