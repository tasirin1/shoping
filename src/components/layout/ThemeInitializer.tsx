"use client"

import { createContext, useContext, useEffect, useState } from "react"
import type { ThemeConfig } from "@/types"
import { DEFAULT_THEME, themeToCssVars } from "@/lib/theme"

interface ThemeConfigContextType {
  config: ThemeConfig
  loading: boolean
  refresh: () => Promise<void>
}

const ThemeConfigContext = createContext<ThemeConfigContextType>({
  config: DEFAULT_THEME,
  loading: true,
  refresh: async () => {},
})

export function useThemeConfig() {
  return useContext(ThemeConfigContext)
}

export function ThemeInitializer({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<ThemeConfig>(DEFAULT_THEME)
  const [loading, setLoading] = useState(true)

  const loadConfig = async () => {
    try {
      const res = await fetch("/api/admin/theme")
      if (res.ok) {
        const d = await res.json()
        if (d.success && d.data) {
          setConfig(d.data)
          applyTheme(d.data)
        }
      }
    } catch {
      // Use default theme on error
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadConfig()
  }, [])

  return (
    <ThemeConfigContext.Provider value={{ config, loading, refresh: loadConfig }}>
      {children}
    </ThemeConfigContext.Provider>
  )
}

function applyTheme(config: ThemeConfig) {
  const root = document.documentElement
  const vars = themeToCssVars(config)

  for (const [key, value] of Object.entries(vars)) {
    root.style.setProperty(key, value)
  }

  // Set favicon
  if (config.favicon) {
    let link = document.querySelector<HTMLLinkElement>('link[rel*="icon"]')
    if (!link) {
      link = document.createElement("link")
      link.rel = "icon"
      document.head.appendChild(link)
    }
    link.href = config.favicon
  }

  // Set site name in document title (fallback)
  if (config.siteName) {
    const metaTitle = document.querySelector('meta[name="theme-title"]')
    if (metaTitle) metaTitle.setAttribute("content", config.siteName)
  }
}

export function applyThemeConfig(config: ThemeConfig) {
  applyTheme(config)
}
