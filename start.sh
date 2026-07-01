#!/bin/sh
# Shoping - Production Startup Script
# Starts the Next.js server only — schema sync happens during build.

set -e

echo "🚀 Starting server..."
exec node server.js
