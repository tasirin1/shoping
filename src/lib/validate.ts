// ============================================================
// Input Validation Library
// ============================================================

export interface ValidationRule {
  validate: (value: unknown) => boolean
  message: string
}

export interface ValidationField {
  key: string
  label: string
  type: "string" | "number" | "email" | "url" | "hexcolor" | "boolean"
  required?: boolean
  minLength?: number
  maxLength?: number
  min?: number
  max?: number
  pattern?: RegExp
  patternMessage?: string
  custom?: ValidationRule[]
  sanitize?: boolean
}

export interface ValidationResult {
  valid: boolean
  errors: Record<string, string>
  sanitized: Record<string, unknown>
}

// Sanitization
export function sanitizeString(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;")
    .replace(/\\/g, "&#x5C;")
}

export function sanitizeEmail(value: string): string {
  return value.trim().toLowerCase()
}

// Validators
export const validators = {
  isEmail: (v: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
  isUrl: (v: string): boolean => {
    try { new URL(v); return true } catch { return false }
  },
  isHexColor: (v: string): boolean => /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(v),
  isAlphanumeric: (v: string): boolean => /^[a-zA-Z0-9_]+$/.test(v),
  isUsername: (v: string): boolean => /^[a-zA-Z0-9_]{3,20}$/.test(v),
  isNumeric: (v: string): boolean => /^\d+$/.test(v),
  isSlug: (v: string): boolean => /^[a-z0-9-]+$/.test(v),
  isPhone: (v: string): boolean => /^\+?[\d\s-]{8,15}$/.test(v),
  isPrice: (v: number): boolean => !isNaN(v) && v >= 0 && v <= 100_000_000,
  noHtml: (v: string): boolean => !/[<>]/.test(v),
}

// Main validation function
export function validateFields(
  data: Record<string, unknown>,
  fields: ValidationField[]
): ValidationResult {
  const errors: Record<string, string> = {}
  const sanitized: Record<string, unknown> = {}

  for (const field of fields) {
    const value = data[field.key]
    const label = field.label

    // Check required
    if (field.required && (value === undefined || value === null || value === "")) {
      errors[field.key] = `${label} wajib diisi`
      continue
    }

    // Skip if optional and empty
    if (!field.required && (value === undefined || value === null || value === "")) {
      sanitized[field.key] = null
      continue
    }

    // Type check
    if (field.type === "string" || field.type === "email" || field.type === "url" || field.type === "hexcolor") {
      if (typeof value !== "string") {
        errors[field.key] = `${label} harus berupa teks`
        continue
      }

      let str = value as string

      // Length checks
      if (field.minLength !== undefined && str.length < field.minLength) {
        errors[field.key] = `${label} minimal ${field.minLength} karakter`
        continue
      }
      if (field.maxLength !== undefined && str.length > field.maxLength) {
        errors[field.key] = `${label} maksimal ${field.maxLength} karakter`
        continue
      }

      // Pattern check
      if (field.pattern && !field.pattern.test(str)) {
        errors[field.key] = field.patternMessage || `${label} tidak valid`
        continue
      }

      // No HTML check (default for strings)
      if (field.sanitize !== false && !validators.noHtml(str)) {
        errors[field.key] = `${label} tidak boleh mengandung HTML`
        continue
      }

      // Type-specific validation
      if (field.type === "email") {
        if (!validators.isEmail(str)) {
          errors[field.key] = `Format ${label} tidak valid`
          continue
        }
        str = sanitizeEmail(str)
      }

      if (field.type === "url" && str) {
        if (!validators.isUrl(str)) {
          errors[field.key] = `Format URL ${label} tidak valid`
          continue
        }
      }

      if (field.type === "hexcolor" && str) {
        if (!validators.isHexColor(str)) {
          errors[field.key] = `Format warna ${label} tidak valid (contoh: #2563EB)`
          continue
        }
      }

      // Sanitize
      sanitized[field.key] = field.sanitize !== false ? sanitizeString(str) : str
    }

    if (field.type === "number") {
      const num = Number(value)
      if (isNaN(num)) {
        errors[field.key] = `${label} harus berupa angka`
        continue
      }
      if (field.min !== undefined && num < field.min) {
        errors[field.key] = `${label} minimal ${field.min}`
        continue
      }
      if (field.max !== undefined && num > field.max) {
        errors[field.key] = `${label} maksimal ${field.max}`
        continue
      }
      sanitized[field.key] = num
    }

    if (field.type === "boolean") {
      sanitized[field.key] = Boolean(value)
    }

    // Custom validators
    if (field.custom && !errors[field.key]) {
      for (const rule of field.custom) {
        if (!rule.validate(value)) {
          errors[field.key] = rule.message
          break
        }
      }
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
    sanitized,
  }
}
