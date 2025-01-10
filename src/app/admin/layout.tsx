"use client"

import AdminNav from "@/components/AdminNav"
import { ReactNode, useState, useEffect, useRef } from "react"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(true)
  const asideRef = useRef<HTMLElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (window.innerWidth < 1024) {
      setIsMenuOpen(false)
    }
  }, [])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // Проверяем, что клик был не по кнопке и не по меню
      if (
        isMenuOpen && 
        asideRef.current && 
        !asideRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node) &&
        window.innerWidth < 1024
      ) {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isMenuOpen])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <div className="min-h-screen flex relative bg-gray-100">
      {/* Оверлей */}
      <div 
        className={cn(
          "fixed inset-0 bg-black/50 lg:hidden z-30",
          "transition-opacity duration-200",
          isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsMenuOpen(false)}
      />

      {/* Кнопка меню */}
      <Button
        ref={buttonRef}
        variant="secondary"
        size="icon"
        className={cn(
          "fixed lg:hidden z-50",
          "top-4 transition-all duration-300",
          isMenuOpen ? "left-[248px]" : "left-4",
          "bg-white shadow-md hover:bg-gray-100",
          "h-10 w-10"
        )}
        onClick={toggleMenu} // Используем единую функцию для переключения
      >
        {isMenuOpen ? (
          <X className="h-5 w-5 text-gray-700" />
        ) : (
          <Menu className="h-5 w-5 text-gray-700" />
        )}
      </Button>

      {/* Боковое меню */}
      <aside 
        ref={asideRef}
        className={cn(
          "fixed lg:sticky top-0 left-0 h-screen",
          "bg-gray-800 text-white",
          "transition-transform duration-300 ease-in-out lg:transition-none",
          "border-r border-gray-700",
          "shadow-lg z-40",
          "w-64",
          "transform lg:transform-none",
          isMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <AdminNav isCollapsed={false} />
      </aside>

      {/* Основной контент */}
      <main className={cn(
        "flex-1 min-w-0",
        "transition-all duration-300 ease-in-out",
        "p-4 lg:p-6",
        "pt-20 lg:pt-6",
        "relative"
      )}>
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}