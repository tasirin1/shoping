#!/bin/sh
# Shoping - Production Startup Script
# Syncs database schema, seeds default data, then starts the Next.js server.

set -e

echo "========================================"
echo "  Shoping — Production Startup"
echo "========================================"
echo ""

# --------------------------------------------------
# 1. Database schema sync
# --------------------------------------------------
if [ -n "$DATABASE_URL" ]; then
  echo "⏳ Syncing database schema..."
  npx prisma db push --accept-data-loss 2>&1
  echo "✅ Database schema synced"
  echo ""

  # --------------------------------------------------
  # 2. Seed default data (admin + demo users, games, etc.)
  # --------------------------------------------------
  echo "⏳ Seeding default data..."
  npx tsx prisma/seed.ts 2>&1
  echo "✅ Seed complete"
  echo ""
else
  echo "⚠️  DATABASE_URL not set — skipping schema sync and seed."
  echo "   Server will start, but database operations may fail."
  echo ""
fi

# --------------------------------------------------
# 3. Start Next.js server
# --------------------------------------------------
echo "🚀 Starting server..."
exec node server.js
