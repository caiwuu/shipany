import { orders } from "@/drizzle/schema";

export type Order = typeof orders.$inferInsert;
