import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { writeFile, mkdir } from "fs/promises"
import path from "path"

const ALLOWED_EXTS = [".png", ".jpg", ".jpeg", ".svg", ".webp", ".gif", ".ico"]
const MAX_SIZE = 5 * 1024 * 1024

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File | null
    const folder = (formData.get("folder") as string) || "general"

    if (!file) {
      return NextResponse.json({ success: false, error: "File tidak ditemukan" }, { status: 400 })
    }

    const ext = path.extname(file.name).toLowerCase()
    if (!ALLOWED_EXTS.includes(ext)) {
      return NextResponse.json({ success: false, error: "Format file tidak didukung. Gunakan: png, jpg, svg, webp, ico" }, { status: 400 })
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ success: false, error: "Ukuran file maksimal 5MB" }, { status: 400 })
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads", folder)
    await mkdir(uploadDir, { recursive: true })

    const timestamp = Date.now()
    const safeName = `${timestamp}_${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`
    const filePath = path.join(uploadDir, safeName)

    const bytes = await file.arrayBuffer()
    await writeFile(filePath, Buffer.from(bytes))

    const url = `/uploads/${folder}/${safeName}`

    return NextResponse.json({ success: true, data: { url, filename: safeName } })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ success: false, error: "Gagal mengunggah file" }, { status: 500 })
  }
}
