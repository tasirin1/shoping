import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { writeFile, mkdir } from "fs/promises"
import path from "path"
import crypto from "crypto"
import { rateLimitKey, rateLimitResponse } from "@/lib/rate-limiter"
import { createAuditLog } from "@/lib/audit"

export const dynamic = "force-dynamic"

const ALLOWED_EXTS = new Set([".png", ".jpg", ".jpeg", ".svg", ".webp", ".gif", ".ico"])
const ALLOWED_MIMES = [
  "image/png", "image/jpeg", "image/svg+xml",
  "image/webp", "image/gif", "image/x-icon",
  "image/vnd.microsoft.icon",
]
const MAX_SIZE = 5 * 1024 * 1024 // 5MB
const MAX_SIZE_MB = 5

// Blocked file patterns
const BLOCKED_PATTERNS = /[<>"']|\.html?$|\.php$|\.js$|\.exe$|\.sh$|\.bat$|\.cmd$|\.ps1$/i

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 })
    }

    // Rate limit check
    const ip = request.headers.get("x-forwarded-for") || "unknown"
    const rl = rateLimitResponse(rateLimitKey(`upload:${user.id}`, "upload"), "moderate")
    if (!rl.allowed) {
      return NextResponse.json(
        { success: false, error: "Terlalu banyak upload. Coba lagi nanti." },
        { status: 429, headers: rl.headers }
      )
    }

    const formData = await request.formData()
    const file = formData.get("file") as File | null
    const folderInput = (formData.get("folder") as string) || "general"

    if (!file) {
      return NextResponse.json({ success: false, error: "File tidak ditemukan" }, { status: 400, headers: rl.headers })
    }

    // Validate file size
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { success: false, error: `Ukuran file maksimal ${MAX_SIZE_MB}MB` },
        { status: 400, headers: rl.headers }
      )
    }
    if (file.size === 0) {
      return NextResponse.json({ success: false, error: "File kosong" }, { status: 400, headers: rl.headers })
    }

    // Validate MIME type
    if (file.type && !ALLOWED_MIMES.includes(file.type) && !file.type.startsWith("image/")) {
      return NextResponse.json(
        { success: false, error: "Tipe file tidak didukung. Gunakan: PNG, JPG, SVG, WEBP, GIF, ICO" },
        { status: 400, headers: rl.headers }
      )
    }

    // Validate extension
    const originalName = file.name.toLowerCase()
    const ext = path.extname(originalName).toLowerCase()
    if (!ALLOWED_EXTS.has(ext)) {
      return NextResponse.json(
        { success: false, error: "Format file tidak didukung. Gunakan: PNG, JPG, SVG, WEBP, GIF, ICO" },
        { status: 400, headers: rl.headers }
      )
    }

    // Block dangerous patterns in filename
    if (BLOCKED_PATTERNS.test(file.name)) {
      return NextResponse.json({ success: false, error: "Nama file tidak valid" }, { status: 400, headers: rl.headers })
    }

    // Validate folder name (only allow alphanumeric and common folder names)
    const allowedFolders = ["logo", "favicon", "banner", "hero", "icon", "general", "games", "avatars", "uploads"]
    const folder = allowedFolders.includes(folderInput) ? folderInput : "general"

    // Generate UUID filename to prevent path traversal and name collisions
    const uuid = crypto.randomUUID()
    const safeFilename = `${uuid}${ext}`
    const uploadDir = path.join(process.cwd(), "public", "uploads", folder)
    await mkdir(uploadDir, { recursive: true })
    const filePath = path.join(uploadDir, safeFilename)

    // Write file
    const bytes = await file.arrayBuffer()
    await writeFile(filePath, Buffer.from(bytes))

    const url = `/uploads/${folder}/${safeFilename}`

    // Log upload
    await createAuditLog(
      "UPLOAD",
      "file",
      null,
      `Mengunggah file: ${safeFilename} (${(file.size / 1024).toFixed(1)}KB, folder: ${folder})`,
      ip
    )

    return NextResponse.json(
      { success: true, data: { url, filename: safeFilename, originalName: file.name, size: file.size } },
      { headers: rl.headers }
    )
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ success: false, error: "Gagal mengunggah file" }, { status: 500 })
  }
}
