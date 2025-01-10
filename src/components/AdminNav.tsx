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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"

interface AdminNavProps {
  isCollapsed?: boolean
}

const navItems = [
  { 
    href: "/admin/dashboard", 
    label: "Dashboard",
    description: "Общая статистика и метрики",
    icon: LayoutDashboard
  },
  { 
    href: "/admin/businesses", 
    label: "Бизнесы",
    description: "Управление бизнесами",
    icon: Building2
  },
  { 
    href: "/admin/chatbots",  
    label: "Чат-боты",
    description: "Настройка чат-ботов",
    icon: MessageSquare
  },
  { 
    href: "/admin/modules",   
    label: "Модули",
    description: "Управление модулями",
    icon: Boxes
  },
  { 
    href: "/admin/logs",      
    label: "Логи",
    description: "Журнал событий",
    icon: ScrollText
  },
  { 
    href: "/admin/users",     
    label: "Пользователи",
    description: "Управление пользователями",
    icon: Users
  }
]

export default function AdminNav({ isCollapsed = false }: AdminNavProps) {
  const pathname = usePathname()

  return (
    <TooltipProvider delayDuration={0}>
      <nav className="h-full flex flex-col p-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white px-2">
            Geopard Admin
          </h2>
        </div>

        <div className="flex-1 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <Tooltip key={item.href}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  asChild
                  className={cn(
                    "w-full justify-start gap-2",
                    "text-gray-300 hover:text-white",
                    "transition-all duration-200",
                    "hover:bg-gray-700/50",
                    pathname === item.href && "bg-gray-700/70 text-white"
                  )}
                >
                  <Link href={item.href} className="flex items-center gap-2">
                    <item.icon className="h-4 w-4 shrink-0" />
                    <div className="flex flex-col items-start truncate">
                      <span className="truncate">{item.label}</span>
                      <span className="text-xs text-gray-400 truncate">
                        {item.description}
                      </span>
                    </div>
                  </Link>
                </Button>
              </TooltipTrigger>
            </Tooltip>
          ))}
        </div>
      </nav>
    </TooltipProvider>
  )
}