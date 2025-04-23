import { apikeys } from "@/drizzle/schema";

export type Apikey = typeof apikeys.$inferInsert;
