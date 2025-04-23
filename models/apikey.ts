import { and, desc, eq } from "drizzle-orm";

import { apikeys } from "@/drizzle/schema";
import { getDb } from "@/drizzle/db";

export enum ApikeyStatus {
  Created = "created",
  Deleted = "deleted",
}

export async function insertApikey(apikey: typeof apikeys.$inferInsert) {
  const db = await getDb();
  await db.insert(apikeys).values(apikey);

  return apikey;
}

export async function getUserApikeys(
  user_uuid: string,
  page: number = 1,
  limit: number = 50
): Promise<(typeof apikeys.$inferSelect)[]> {
  const db = await getDb();
  const data = await db
    .select()
    .from(apikeys)
    .where(
      and(
        eq(apikeys.user_uuid, user_uuid),
        eq(apikeys.status, ApikeyStatus.Created)
      )
    )
    .orderBy(desc(apikeys.created_at))
    .limit(limit)
    .offset((page - 1) * limit);

  return data;
}

export async function getUserUuidByApiKey(
  apiKey: string
): Promise<string | undefined> {
  const db = await getDb();
  const data = await db
    .select()
    .from(apikeys)
    .where(
      and(eq(apikeys.api_key, apiKey), eq(apikeys.status, ApikeyStatus.Created))
    )
    .limit(1);

  return data ? data[0]?.user_uuid : undefined;
}
