# Shoping - Dockerfile (Production)
FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Generate Prisma Client (doesn't need database connection)
RUN npx prisma generate

# Sync schema if DATABASE_URL is available during build (e.g. Koyeb build env)
RUN npx prisma db push --accept-data-loss || echo "⚠️ Schema sync skipped (DATABASE_URL not available during build)"

# Build Next.js standalone
RUN npm run build

FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy Next.js standalone output
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Copy Prisma Client files needed at runtime (NOT Prisma CLI)
# .prisma/client: generated client code
# @prisma/client: client library
# @prisma/engines: native query engine binary (.so.node) for DB communication
COPY --from=builder /app/node_modules/.prisma/client ./node_modules/.prisma/client
COPY --from=builder /app/node_modules/@prisma/client ./node_modules/@prisma/client
COPY --from=builder /app/node_modules/@prisma/engines/libquery_engine-*.node ./node_modules/@prisma/engines/

# Copy startup script
COPY --from=builder /app/start.sh ./start.sh

# Create uploads directory
RUN mkdir -p /app/public/uploads && chown -R nextjs:nodejs /app/public

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["sh", "start.sh"]
