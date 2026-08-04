// Local example confirming the Zod setup works.
// Run with: node lib/validation.example.mts
// Nothing in the application imports this file.
import { sampleSchema } from "./validation.ts"

const valid = sampleSchema.safeParse({ id: "sample", count: 1 })
const invalid = sampleSchema.safeParse({ id: "", count: -1 })

console.log("valid sample:", valid.success)
console.log("invalid sample:", invalid.success)
