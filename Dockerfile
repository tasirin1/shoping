# Shoping - Dockerfile (Production)
FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Generate Prisma Client (doesn't need database connection)
RUN npx prisma generate

# Build Next.js standalone
RUN npm run build

# ============================================================
# Runner Stage
# ============================================================
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy Next.js standalone output (server.js + minimal node_modules)
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/static ./.next/static

# Copy full node_modules from builder.
# This ensures ALL runtime dependencies (including prisma CLI, @prisma/*,
# tsx, bcryptjs, and their transitive deps like @prisma/debug,
# @prisma/fetch-engine, @prisma/get-platform) are available.
# Next.js standalone's minimal node_modules is overwritten with the
# complete production set.
COPY --from=builder /app/node_modules ./node_modules

# Copy Prisma schema + seed files (needed for db push + seed)
COPY --from=builder /app/prisma ./prisma

# Copy startup script
COPY --from=builder /app/start.sh ./start.sh

# Create uploads directory
RUN mkdir -p /app/public/uploads && chown -R nextjs:nodejs /app/public /app/prisma

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["sh", "start.sh"]
