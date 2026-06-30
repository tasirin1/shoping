import { db } from "./database"
import { getCurrentUser } from "./auth"

export async function createAuditLog(
  action: string,
  entity: string,
  entityId: string | null = null,
  details: string | null = null
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
      ip: null,
    })
  } catch {
    // Silently fail - audit logs should not break the main flow
  }
}
