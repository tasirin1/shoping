import { db } from "./database"
import { getCurrentUser } from "./auth"

function getIpFromRequest(): string {
  // In middleware/API routes the IP comes from headers
  // This function is a placeholder; IP should be passed explicitly
  return "0.0.0.0"
}

export async function createAuditLog(
  action: string,
  entity: string,
  entityId: string | null = null,
  details: string | null = null,
  ip?: string
): Promise<void> {
  try {
    const user = await getCurrentUser()
    if (!user) return

    await db.create("logs", {
      userId: user.id,
      action,
      entity,
      entityId,
      details,
      ip: ip || getIpFromRequest(),
    })
  } catch {
    // Silently fail - audit logs should not break the main flow
  }
}

export async function createAuditLogWithUser(
  userId: string,
  action: string,
  entity: string,
  entityId: string | null = null,
  details: string | null = null,
  ip?: string
): Promise<void> {
  try {
    await db.create("logs", {
      userId,
      action,
      entity,
      entityId,
      details,
      ip: ip || getIpFromRequest(),
    })
  } catch {
    // Silently fail
  }
}
