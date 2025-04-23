import { desc, eq } from "drizzle-orm";

import { getDb } from "@/drizzle/db";
import { users } from "@/drizzle/schema";

export async function insertUser(user: typeof users.$inferInsert) {
  const db = await getDb();
  await db.insert(users).values(user);

  return user;
}

export async function findUserByEmail(
  email: string
): Promise<typeof users.$inferSelect | undefined> {
  const db = await getDb();
  const data = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  return data ? data[0] : undefined;
}

export async function findUserByUuid(
  uuid: string
): Promise<typeof users.$inferSelect | undefined> {
  const db = await getDb();
  const data = await db
    .select()
    .from(users)
    .where(eq(users.uuid, uuid))
    .limit(1);

  return data ? data[0] : undefined;
}

export async function getUsers(
  page: number = 1,
  limit: number = 50
): Promise<(typeof users.$inferSelect)[]> {
  const db = await getDb();
  const data = await db
    .select()
    .from(users)
    .orderBy(desc(users.created_at))
    .limit(limit)
    .offset((page - 1) * limit);

  return data;
}
