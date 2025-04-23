import { and, desc, eq } from "drizzle-orm";

import { getDb } from "@/drizzle/db";
import { posts } from "@/drizzle/schema";

export enum PostStatus {
  Created = "created",
  Deleted = "deleted",
  Online = "online",
  Offline = "offline",
}

export async function insertPost(post: typeof posts.$inferInsert) {
  const db = await getDb();
  await db.insert(posts).values(post);

  return post;
}

export async function updatePost(
  uuid: string,
  post: Partial<typeof posts.$inferInsert>
) {
  const db = await getDb();
  await db.update(posts).set(post).where(eq(posts.uuid, uuid));

  return post;
}

export async function findPostByUuid(
  uuid: string
): Promise<typeof posts.$inferSelect | undefined> {
  const db = await getDb();
  const data = await db
    .select()
    .from(posts)
    .where(eq(posts.uuid, uuid))
    .limit(1);

  return data ? data[0] : undefined;
}

export async function findPostBySlug(
  slug: string,
  locale: string
): Promise<typeof posts.$inferSelect | undefined> {
  const db = await getDb();
  const data = await db
    .select()
    .from(posts)
    .where(and(eq(posts.slug, slug), eq(posts.locale, locale)))
    .limit(1);

  return data ? data[0] : undefined;
}

export async function getAllPosts(
  page: number = 1,
  limit: number = 50
): Promise<(typeof posts.$inferSelect)[]> {
  const db = await getDb();
  const data = await db
    .select()
    .from(posts)
    .orderBy(desc(posts.created_at))
    .limit(limit)
    .offset((page - 1) * limit);

  return data;
}

export async function getPostsByLocale(
  locale: string,
  page: number = 1,
  limit: number = 50
): Promise<(typeof posts.$inferSelect)[]> {
  const db = await getDb();
  const data = await db
    .select()
    .from(posts)
    .where(and(eq(posts.locale, locale), eq(posts.status, PostStatus.Online)))
    .orderBy(desc(posts.created_at))
    .limit(limit)
    .offset((page - 1) * limit);

  return data;
}
