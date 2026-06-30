// ============================================================
// Theme Service — Client-safe
// ============================================================
// Full theme engine with 20 built-in themes, dark mode as default.
// No database import — client-safe for ThemeInitializer.

import type { ThemeConfig, ThemeRecord, ThemePreset } from "@/types"
import crypto from "crypto"

// ============================================================
// Full default config (Dark mode as default)
// ============================================================
function makeId(): string {
  return crypto.randomUUID?.() || Math.random().toString(36).substring(2, 15)
}

export const DARK_DEFAULT: ThemeConfig = {
  logo: "", logoDark: "", favicon: "", siteName: "Shoping", tagline: "Top up game cepat & aman",
  primaryColor: "#6366f1", secondaryColor: "#8b5cf6", accentColor: "#f59e0b",
  surfaceColor: "#111827", navbarColor: "#0f172a", sidebarColor: "#0f172a",
  footerColor: "#020617", buttonColor: "#6366f1", inputColor: "#1e293b",
  borderColor: "#1e293b", cardColor: "#1e293b", backgroundColor: "#0a0a1a",
  textColor: "#f1f5f9", textSecondary: "#94a3b8", linkColor: "#818cf8",
  successColor: "#22c55e", warningColor: "#eab308", errorColor: "#ef4444",
  infoColor: "#3b82f6",
  borderRadius: "0.75rem", shadow: "0 4px 6px -1px rgba(0,0,0,0.3)",
  spacing: "1rem", fontFamily: "Inter, system-ui, sans-serif",
  headingFont: "Inter, system-ui, sans-serif", fontSize: "16px",
  heroImage: "", bannerHome: "", websiteIcon: "",
  footerText: "Shoping. All rights reserved.",
  copyright: `© ${new Date().getFullYear()} Shoping. All rights reserved.`,
  socialFacebook: "", socialTwitter: "", socialInstagram: "", socialYoutube: "",
}

// ============================================================
// 20 Built-in Themes
// ============================================================
const BUILTIN_THEMES: Omit<ThemeRecord, "id">[] = [
  { name: "Dark", icon: "🌑", isBuiltIn: true, isDefault: true, config: { ...DARK_DEFAULT } },
  {
    name: "Midnight", icon: "🌙", isBuiltIn: true, isDefault: false,
    config: { ...DARK_DEFAULT, primaryColor: "#1e3a5f", secondaryColor: "#2d5a8e", accentColor: "#eab308", buttonColor: "#1e3a5f", navbarColor: "#0a1628", sidebarColor: "#0a1628", footerColor: "#050e1a", cardColor: "#111d33", backgroundColor: "#080e1a", inputColor: "#111d33", borderColor: "#1a2d4a", linkColor: "#3b82f6", textColor: "#e2e8f0", textSecondary: "#8098b8" },
  },
  {
    name: "AMOLED Black", icon: "⚫", isBuiltIn: true, isDefault: false,
    config: { ...DARK_DEFAULT, primaryColor: "#7c3aed", secondaryColor: "#a855f7", accentColor: "#22d3ee", buttonColor: "#7c3aed", navbarColor: "#000000", sidebarColor: "#000000", footerColor: "#000000", cardColor: "#0a0a0a", backgroundColor: "#000000", inputColor: "#0a0a0a", borderColor: "#1a1a1a", linkColor: "#a855f7", textColor: "#ffffff", textSecondary: "#888888", borderRadius: "0.5rem" },
  },
  {
    name: "Ocean Blue", icon: "🔵", isBuiltIn: true, isDefault: false,
    config: { ...DARK_DEFAULT, primaryColor: "#0ea5e9", secondaryColor: "#06b6d4", accentColor: "#f59e0b", buttonColor: "#0ea5e9", navbarColor: "#082f49", sidebarColor: "#082f49", footerColor: "#020617", cardColor: "#0c4a6e", backgroundColor: "#0a1929", inputColor: "#0c4a6e", borderColor: "#1e6f9f", linkColor: "#38bdf8", textColor: "#f0f9ff", textSecondary: "#94b8d0" },
  },
  {
    name: "Purple Neon", icon: "🟣", isBuiltIn: true, isDefault: false,
    config: { ...DARK_DEFAULT, primaryColor: "#a855f7", secondaryColor: "#d946ef", accentColor: "#22d3ee", buttonColor: "#a855f7", navbarColor: "#1a0a2e", sidebarColor: "#1a0a2e", footerColor: "#0f0518", cardColor: "#2a1050", backgroundColor: "#120824", inputColor: "#2a1050", borderColor: "#4a1a7a", linkColor: "#c084fc", textColor: "#f5f3ff", textSecondary: "#b09cd0" },
  },
  {
    name: "Emerald", icon: "🟢", isBuiltIn: true, isDefault: false,
    config: { ...DARK_DEFAULT, primaryColor: "#059669", secondaryColor: "#10b981", accentColor: "#fbbf24", buttonColor: "#059669", navbarColor: "#022c22", sidebarColor: "#022c22", footerColor: "#01140f", cardColor: "#064e3b", backgroundColor: "#041f1a", inputColor: "#064e3b", borderColor: "#0a7a5a", linkColor: "#34d399", textColor: "#ecfdf5", textSecondary: "#90c0b0" },
  },
  {
    name: "Crimson", icon: "🔴", isBuiltIn: true, isDefault: false,
    config: { ...DARK_DEFAULT, primaryColor: "#dc2626", secondaryColor: "#ef4444", accentColor: "#fbbf24", buttonColor: "#dc2626", navbarColor: "#2a0a0a", sidebarColor: "#2a0a0a", footerColor: "#140505", cardColor: "#3a1515", backgroundColor: "#1f0a0a", inputColor: "#3a1515", borderColor: "#5a2525", linkColor: "#f87171", textColor: "#fef2f2", textSecondary: "#c09090" },
  },
  {
    name: "Sunset Orange", icon: "🟠", isBuiltIn: true, isDefault: false,
    config: { ...DARK_DEFAULT, primaryColor: "#ea580c", secondaryColor: "#f97316", accentColor: "#facc15", buttonColor: "#ea580c", navbarColor: "#2a1505", sidebarColor: "#2a1505", footerColor: "#140a02", cardColor: "#3a1f0a", backgroundColor: "#1f1005", inputColor: "#3a1f0a", borderColor: "#5a3015", linkColor: "#fb923c", textColor: "#fff7ed", textSecondary: "#c0a080" },
  },
  {
    name: "Sakura Pink", icon: "🌸", isBuiltIn: true, isDefault: false,
    config: { ...DARK_DEFAULT, primaryColor: "#d946ef", secondaryColor: "#ec4899", accentColor: "#fbbf24", buttonColor: "#d946ef", navbarColor: "#2a0a20", sidebarColor: "#2a0a20", footerColor: "#150510", cardColor: "#3a1530", backgroundColor: "#200a18", inputColor: "#3a1530", borderColor: "#5a254a", linkColor: "#f472b6", textColor: "#fdf2f8", textSecondary: "#c090b0" },
  },
  {
    name: "Gold", icon: "🟡", isBuiltIn: true, isDefault: false,
    config: { ...DARK_DEFAULT, primaryColor: "#d97706", secondaryColor: "#f59e0b", accentColor: "#10b981", buttonColor: "#d97706", navbarColor: "#2a1a00", sidebarColor: "#2a1a00", footerColor: "#140d00", cardColor: "#3a2505", backgroundColor: "#1f1400", inputColor: "#3a2505", borderColor: "#5a3a0a", linkColor: "#fbbf24", textColor: "#fffbeb", textSecondary: "#c0a050" },
  },
  {
    name: "Cyan Ice", icon: "🩵", isBuiltIn: true, isDefault: false,
    config: { ...DARK_DEFAULT, primaryColor: "#06b6d4", secondaryColor: "#22d3ee", accentColor: "#f472b6", buttonColor: "#06b6d4", navbarColor: "#083344", sidebarColor: "#083344", footerColor: "#041a22", cardColor: "#0a4a5a", backgroundColor: "#08222a", inputColor: "#0a4a5a", borderColor: "#1a6a7a", linkColor: "#67e8f9", textColor: "#ecfeff", textSecondary: "#90c0c8" },
  },
  {
    name: "Coffee", icon: "🟤", isBuiltIn: true, isDefault: false,
    config: { ...DARK_DEFAULT, primaryColor: "#92400e", secondaryColor: "#a16207", accentColor: "#f59e0b", buttonColor: "#92400e", navbarColor: "#1c1508", sidebarColor: "#1c1508", footerColor: "#0e0a04", cardColor: "#2a1f0a", backgroundColor: "#181208", inputColor: "#2a1f0a", borderColor: "#4a3415", linkColor: "#d97706", textColor: "#fefce8", textSecondary: "#b09860" },
  },
  {
    name: "Forest", icon: "🌿", isBuiltIn: true, isDefault: false,
    config: { ...DARK_DEFAULT, primaryColor: "#166534", secondaryColor: "#16a34a", accentColor: "#facc15", buttonColor: "#166534", navbarColor: "#0a1e12", sidebarColor: "#0a1e12", footerColor: "#050f08", cardColor: "#0f2a18", backgroundColor: "#081808", inputColor: "#0f2a18", borderColor: "#1a4a28", linkColor: "#22c55e", textColor: "#f0fdf4", textSecondary: "#80b090" },
  },
  {
    name: "Galaxy", icon: "🌌", isBuiltIn: true, isDefault: false,
    config: { ...DARK_DEFAULT, primaryColor: "#6b21a8", secondaryColor: "#a21caf", accentColor: "#22d3ee", buttonColor: "#6b21a8", navbarColor: "#0f0520", sidebarColor: "#0f0520", footerColor: "#080210", cardColor: "#1a0a35", backgroundColor: "#0c0418", inputColor: "#1a0a35", borderColor: "#2a1055", linkColor: "#a78bfa", textColor: "#f5f3ff", textSecondary: "#a090c8", borderRadius: "1rem" },
  },
  {
    name: "Aurora", icon: "🌈", isBuiltIn: true, isDefault: false,
    config: { ...DARK_DEFAULT, primaryColor: "#0891b2", secondaryColor: "#7c3aed", accentColor: "#10b981", buttonColor: "#0891b2", navbarColor: "#08202a", sidebarColor: "#08202a", footerColor: "#04101a", cardColor: "#0a2a3a", backgroundColor: "#06181f", inputColor: "#0a2a3a", borderColor: "#1a4a5a", linkColor: "#22d3ee", textColor: "#ecfeff", textSecondary: "#90b0c0" },
  },
  {
    name: "Light", icon: "🤍", isBuiltIn: true, isDefault: false,
    config: { ...DARK_DEFAULT, primaryColor: "#2563eb", secondaryColor: "#6366f1", accentColor: "#f59e0b", buttonColor: "#2563eb", navbarColor: "#ffffff", sidebarColor: "#ffffff", footerColor: "#1e293b", cardColor: "#ffffff", backgroundColor: "#f8fafc", inputColor: "#ffffff", borderColor: "#e2e8f0", linkColor: "#2563eb", textColor: "#111827", textSecondary: "#6b7280", surfaceColor: "#f1f5f9", shadow: "0 1px 3px rgba(0,0,0,0.08)" },
  },
  {
    name: "Frost", icon: "🧊", isBuiltIn: true, isDefault: false,
    config: { ...DARK_DEFAULT, primaryColor: "#0891b2", secondaryColor: "#06b6d4", accentColor: "#6366f1", buttonColor: "#0891b2", navbarColor: "#ecfeff", sidebarColor: "#ecfeff", footerColor: "#083344", cardColor: "#ffffff", backgroundColor: "#f0fdfe", inputColor: "#ffffff", borderColor: "#cffafe", linkColor: "#0891b2", textColor: "#164e63", textSecondary: "#5e8a94", surfaceColor: "#e6f9fa" },
  },
  {
    name: "Cyberpunk", icon: "💜", isBuiltIn: true, isDefault: false,
    config: { ...DARK_DEFAULT, primaryColor: "#e879f9", secondaryColor: "#22d3ee", accentColor: "#fbbf24", buttonColor: "#e879f9", navbarColor: "#0a0020", sidebarColor: "#0a0020", footerColor: "#050010", cardColor: "#1a0040", backgroundColor: "#080018", inputColor: "#1a0040", borderColor: "#3a006a", linkColor: "#e879f9", textColor: "#f5f0ff", textSecondary: "#b088d0", borderRadius: "0.5rem" },
  },
  {
    name: "Obsidian", icon: "🖤", isBuiltIn: true, isDefault: false,
    config: { ...DARK_DEFAULT, primaryColor: "#64748b", secondaryColor: "#475569", accentColor: "#f59e0b", buttonColor: "#64748b", navbarColor: "#020617", sidebarColor: "#020617", footerColor: "#000000", cardColor: "#0f172a", backgroundColor: "#030712", inputColor: "#0f172a", borderColor: "#1e293b", linkColor: "#94a3b8", textColor: "#f1f5f9", textSecondary: "#64748b", borderRadius: "0.5rem", shadow: "0 4px 6px rgba(0,0,0,0.5)" },
  },
  {
    name: "Deep Sea", icon: "🌊", isBuiltIn: true, isDefault: false,
    config: { ...DARK_DEFAULT, primaryColor: "#0e7490", secondaryColor: "#0891b2", accentColor: "#22d3ee", buttonColor: "#0e7490", navbarColor: "#041a24", sidebarColor: "#041a24", footerColor: "#020e14", cardColor: "#072a38", backgroundColor: "#04141c", inputColor: "#072a38", borderColor: "#0e4a5a", linkColor: "#22d3ee", textColor: "#ecfeff", textSecondary: "#80b8c8" },
  },
]

// ============================================================
// Build theme records with stable IDs
// ============================================================
export function buildBuiltinThemes(): ThemeRecord[] {
  return BUILTIN_THEMES.map((t) => ({
    ...t,
    id: `builtin_${t.name.toLowerCase().replace(/\s+/g, "_")}`,
    config: { ...t.config },
  }))
}

export const ALL_BUILTIN_THEMES = buildBuiltinThemes()

// ============================================================
// Theme engine helpers
// ============================================================
export function themeToCssVars(config: ThemeConfig): Record<string, string> {
  return {
    "--color-primary": config.primaryColor,
    "--color-primary-50": hexToRgb(config.primaryColor, 0.05),
    "--color-primary-100": hexToRgb(config.primaryColor, 0.1),
    "--color-primary-200": hexToRgb(config.primaryColor, 0.2),
    "--color-primary-300": hexToRgb(config.primaryColor, 0.3),
    "--color-primary-400": hexToRgb(config.primaryColor, 0.4),
    "--color-primary-500": config.primaryColor,
    "--color-primary-600": config.primaryColor,
    "--color-primary-700": config.primaryColor,
    "--color-primary-800": config.primaryColor,
    "--color-primary-900": config.primaryColor,
    "--color-secondary": config.secondaryColor,
    "--color-accent": config.accentColor,
    "--color-surface": config.surfaceColor,
    "--color-navbar": config.navbarColor,
    "--color-sidebar": config.sidebarColor,
    "--color-footer": config.footerColor,
    "--color-button": config.buttonColor,
    "--color-input": config.inputColor,
    "--color-border": config.borderColor,
    "--color-card": config.cardColor,
    "--color-bg": config.backgroundColor,
    "--color-text": config.textColor,
    "--color-text-secondary": config.textSecondary,
    "--color-link": config.linkColor,
    "--color-success": config.successColor,
    "--color-warning": config.warningColor,
    "--color-error": config.errorColor,
    "--color-info": config.infoColor,
    "--border-radius": config.borderRadius,
    "--shadow-custom": config.shadow,
    "--spacing": config.spacing,
    "--font-family": config.fontFamily,
    "--font-heading": config.headingFont,
    "--font-size": config.fontSize,
  }
}

export function hexToRgb(hex: string, alpha: number): string {
  const clean = hex.replace("#", "")
  if (clean.length !== 6) return `rgba(100, 100, 100, ${alpha})`
  const r = parseInt(clean.substring(0, 2), 16)
  const g = parseInt(clean.substring(2, 4), 16)
  const b = parseInt(clean.substring(4, 6), 16)
  if (isNaN(r) || isNaN(g) || isNaN(b)) return `rgba(100, 100, 100, ${alpha})`
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export function applyThemeVars(config: ThemeConfig) {
  if (typeof document === "undefined") return
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

  // Set font size on body
  document.body.style.fontSize = config.fontSize || "16px"
}

export function getThemeById(themes: ThemeRecord[], id: string): ThemeRecord | undefined {
  return themes.find((t) => t.id === id)
}

export function cloneTheme(theme: ThemeRecord, newName: string): ThemeRecord {
  return {
    ...theme,
    id: `custom_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
    name: newName,
    isBuiltIn: false,
    isDefault: false,
    config: JSON.parse(JSON.stringify(theme.config)),
  }
}

export function exportThemeJSON(theme: ThemeRecord): string {
  return JSON.stringify({ name: theme.name, icon: theme.icon, config: theme.config }, null, 2)
}

export function defaultThemeId(): string {
  return "builtin_dark"
}
