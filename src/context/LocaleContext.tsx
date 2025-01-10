// src/context/LocaleContext.tsx
"use client"

import { createContext, useContext, useState } from "react"
import kk from "@/locales/kk"
import en from "@/locales/en"
import ru from "@/locales/ru"

type Locale = "kk" | "en" | "ru"

const allLocales = { kk, en, ru }

interface LocaleContextProps {
  locale: Locale
  setLocale: (loc: Locale) => void
  t: (path: string) => string
}

const LocaleContext = createContext<LocaleContextProps>({
  locale: "ru",
  setLocale: () => {},
  t: () => ""
})

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>("ru") // по умолчанию "ru"

  function t(path: string) {
    // path может быть типа "common.create" или "chatbotForm.title"
    const [section, key] = path.split(".")
    // берем объект локализации
    const dict = allLocales[locale] as any
    if (!dict[section] || !dict[section][key]) {
      return path // fallback
    }
    return dict[section][key]
  }

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale() {
  return useContext(LocaleContext)
}
