import { z } from "zod"

// Minimal schema used to confirm the Zod setup.
// It is not tied to any business functionality.
export const sampleSchema = z.object({
  id: z.string().min(1),
  count: z.number().int().nonnegative(),
})

export type Sample = z.infer<typeof sampleSchema>
