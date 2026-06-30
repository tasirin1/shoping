import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function GET() {
  try {
    const dbDir = path.join(process.cwd(), "database")
    const dbExists = fs.existsSync(dbDir)
    const files = dbExists ? fs.readdirSync(dbDir).filter(f => f.endsWith(".json")) : []
    
    return NextResponse.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      database: {
        type: "json",
        path: dbDir,
        collections: files.length,
        files: files.filter(f => f !== "backups"),
      },
    })
  } catch (error) {
    console.error("Health check failed:", error)
    return NextResponse.json(
      {
        status: "error",
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 503 }
    )
  }
}
