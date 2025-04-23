import { credits } from "@/drizzle/schema";

export type Credit = typeof credits.$inferInsert;
