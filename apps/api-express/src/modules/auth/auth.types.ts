import type { verifySession } from "@auto-lincoln/auth";

export type Session = Awaited<ReturnType<typeof verifySession>>
