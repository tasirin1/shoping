"use client"

import { createContext, useContext, useEffect, useState, useCallback } from "react"
import type { ThemeConfig } from "@/types"
import { DARK_DEFAULT, applyThemeVars, defaultThemeId } from "@/lib/theme"

interface ThemeConfigContextType {
  config: ThemeConfig
  loading: boolean
  refresh: () => Promise<void>
  activeThemeId: string
  setActiveTheme: (id: string) => Promise<void>
}

const ThemeConfigContext = createContext<ThemeConfigContextType>({
  config: DARK_DEFAULT,
  loading: true,
  refresh: async () => {},
  activeThemeId: defaultThemeId(),
  setActiveTheme: async () => {},
})

export function useThemeConfig() {
  return useContext(ThemeConfigContext)
}

export function ThemeInitializer({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<ThemeConfig>(DARK_DEFAULT)
  const [loading, setLoading] = useState(true)
  const [activeThemeId, setActiveThemeIdState] = useState(defaultThemeId())

  const loadConfig = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/themes")
      if (res.ok) {
        const d = await res.json()
        if (d.success && d.data) {
          const { themes, activeId } = d.data
          const active = themes.find((t: any) => t.id === activeId)
          if (active && active.config) {
            setConfig(active.config)
            setActiveThemeIdState(activeId)
            applyThemeVars(active.config)
          }
        }
      }
    } catch {
      // Use default theme on error
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadConfig()
  }, [loadConfig])

  const setActiveTheme = useCallback(async (id: string) => {
    try {
      const res = await fetch("/api/admin/themes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "activate", themeId: id }),
      })
      const d = await res.json()
      if (d.success) {
        if (d.data) {
          setConfig(d.data)
          applyThemeVars(d.data)
        }
        setActiveThemeIdState(id)
      }
    } catch {
      // Silently fail
    }
  }, [])

  return (
    <ThemeConfigContext.Provider value={{ config, loading, refresh: loadConfig, activeThemeId, setActiveTheme }}>
      {children}
    </ThemeConfigContext.Provider>
  )
}
