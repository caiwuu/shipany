import { posts } from "@/drizzle/schema";

export type Post = typeof posts.$inferInsert;
