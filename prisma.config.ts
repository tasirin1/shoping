// Prisma 7 Configuration
// https://pris.ly/d/config-datasource

import { defineConfig } from "@prisma/config"

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL || undefined,
  },
  schema: "./prisma/schema.prisma",
})
