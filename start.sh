#!/bin/sh
# Shoping - Production Startup Script
# Syncs database schema and starts the Next.js server

set -e

echo "⏳ Syncing database schema..."
npx prisma db push --accept-data-loss 2>&1 || {
  echo "❌ Failed to sync database schema. Check DATABASE_URL."
  echo "   Ensure PostgreSQL is accessible and the connection string is correct."
  exit 1
}

if [ "$RUN_SEED" = "true" ]; then
  echo "🌱 Running database seed..."
  npx tsx prisma/seed.ts 2>&1 || echo "⚠️ Seed encountered errors (may be OK if data already exists)"
fi

echo "🚀 Starting server..."
exec node server.js
