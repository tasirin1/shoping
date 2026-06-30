// ============================================================
// Theme Service — Client-safe
// ============================================================
// This file does NOT import database.ts to avoid bundling
// Node.js modules (fs, path, crypto) on the client side.
// Server-only operations are handled directly in API routes.

import type { ThemeConfig, ThemePreset, ThemePresetName } from "@/types"

export const DEFAULT_THEME: ThemeConfig = {
  logo: "",
  logoDark: "",
  favicon: "",
  siteName: "Shoping",
  tagline: "Top up game cepat & aman",
  primaryColor: "#2563eb",
  secondaryColor: "#6366f1",
  accentColor: "#f59e0b",
  buttonColor: "#2563eb",
  navbarColor: "#ffffff",
  footerColor: "#1e293b",
  backgroundColor: "#f8fafc",
  cardColor: "#ffffff",
  textColor: "#111827",
  linkColor: "#2563eb",
  successColor: "#22c55e",
  warningColor: "#eab308",
  errorColor: "#ef4444",
  borderRadius: "1rem",
  shadow: "0 1px 3px rgba(0,0,0,0.08)",
  fontFamily: "Inter, system-ui, sans-serif",
  headingFont: "Inter, system-ui, sans-serif",
  heroImage: "",
  bannerHome: "",
  websiteIcon: "",
  footerText: "Shoping. All rights reserved.",
  copyright: `© ${new Date().getFullYear()} Shoping. All rights reserved.`,
  socialFacebook: "",
  socialTwitter: "",
  socialInstagram: "",
  socialYoutube: "",
  preset: "default",
}

export const THEME_PRESETS: ThemePreset[] = [
  { name: "Default", slug: "default", label: "Biru standar", colors: {} },
  {
    name: "Blue", slug: "blue", label: "Biru tua elegan",
    colors: { primaryColor: "#1d4ed8", secondaryColor: "#3b82f6", accentColor: "#0ea5e9", buttonColor: "#1d4ed8", linkColor: "#1d4ed8" },
  },
  {
    name: "Dark", slug: "dark", label: "Gelap modern",
    colors: { primaryColor: "#6366f1", secondaryColor: "#8b5cf6", accentColor: "#f59e0b", buttonColor: "#6366f1", navbarColor: "#0f172a", footerColor: "#020617", backgroundColor: "#0f172a", cardColor: "#1e293b", textColor: "#f1f5f9", linkColor: "#818cf8", borderRadius: "0.75rem" },
  },
  {
    name: "Emerald", slug: "emerald", label: "Hijau natural",
    colors: { primaryColor: "#059669", secondaryColor: "#10b981", accentColor: "#f59e0b", buttonColor: "#059669", linkColor: "#059669" },
  },
  {
    name: "Purple", slug: "purple", label: "Ungu kreatif",
    colors: { primaryColor: "#7c3aed", secondaryColor: "#a855f7", accentColor: "#f472b6", buttonColor: "#7c3aed", linkColor: "#7c3aed" },
  },
  {
    name: "Orange", slug: "orange", label: "Oranye hangat",
    colors: { primaryColor: "#ea580c", secondaryColor: "#f97316", accentColor: "#eab308", buttonColor: "#ea580c", linkColor: "#ea580c" },
  },
]

export function getPreset(slug: ThemePresetName): ThemePreset | undefined {
  return THEME_PRESETS.find((p) => p.slug === slug)
}

export function applyPreset(base: ThemeConfig, preset: ThemePreset): ThemeConfig {
  return { ...base, ...preset.colors, preset: preset.slug }
}

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
    "--color-button": config.buttonColor,
    "--color-navbar": config.navbarColor,
    "--color-footer": config.footerColor,
    "--color-bg": config.backgroundColor,
    "--color-card": config.cardColor,
    "--color-text": config.textColor,
    "--color-link": config.linkColor,
    "--color-success": config.successColor,
    "--color-warning": config.warningColor,
    "--color-error": config.errorColor,
    "--border-radius": config.borderRadius,
    "--shadow-custom": config.shadow,
    "--font-family": config.fontFamily,
    "--font-heading": config.headingFont,
  }
}

function hexToRgb(hex: string, alpha: number): string {
  const clean = hex.replace("#", "")
  if (clean.length !== 6) return `rgba(37, 99, 235, ${alpha})`
  const r = parseInt(clean.substring(0, 2), 16)
  const g = parseInt(clean.substring(2, 4), 16)
  const b = parseInt(clean.substring(4, 6), 16)
  if (isNaN(r) || isNaN(g) || isNaN(b)) return `rgba(37, 99, 235, ${alpha})`
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}
