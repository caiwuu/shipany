import { and, asc, desc, eq, gte } from "drizzle-orm";

import { credits } from "@/drizzle/schema";
import { getDb } from "@/drizzle/db";
import { getIsoTimestr } from "@/lib/time";

export async function insertCredit(credit: typeof credits.$inferInsert) {
  const db = await getDb();
  await db.insert(credits).values(credit);

  return credit;
}

export async function findCreditByTransNo(
  trans_no: string
): Promise<typeof credits.$inferSelect | undefined> {
  const db = await getDb();
  const data = await db
    .select()
    .from(credits)
    .where(eq(credits.trans_no, trans_no))
    .limit(1);

  return data ? data[0] : undefined;
}

export async function getUserValidCredits(
  user_uuid: string
): Promise<(typeof credits.$inferSelect)[]> {
  const db = await getDb();
  const data = await db
    .select()
    .from(credits)
    .where(
      and(
        eq(credits.user_uuid, user_uuid),
        gte(credits.expired_at, getIsoTimestr())
      )
    )
    .orderBy(asc(credits.expired_at));

  return data;
}

export async function getCreditsByUserUuid(
  user_uuid: string,
  page: number = 1,
  limit: number = 50
): Promise<(typeof credits.$inferSelect)[]> {
  const db = await getDb();
  const data = await db
    .select()
    .from(credits)
    .where(eq(credits.user_uuid, user_uuid))
    .orderBy(desc(credits.created_at))
    .limit(limit)
    .offset((page - 1) * limit);

  return data;
}
