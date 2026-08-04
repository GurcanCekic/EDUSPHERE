import { z } from "zod"

// Server-side environment configuration.
// This module is the only place that reads `process.env`.
const envSchema = z.object({
  APP_NAME: z.string().min(1),
})

const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
  const details = parsed.error.issues
    .map((issue) => `  ${issue.path.join(".")}: ${issue.message}`)
    .join("\n")

  throw new Error(
    `Invalid environment configuration:\n${details}\n\nSee .env.example for the required variables.`
  )
}

export const env = parsed.data
