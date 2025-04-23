import { and, asc, desc, eq } from "drizzle-orm";

import { getDb } from "@/drizzle/db";
import { orders } from "@/drizzle/schema";

export enum OrderStatus {
  Created = "created",
  Paid = "paid",
  Deleted = "deleted",
}

export async function insertOrder(order: typeof orders.$inferInsert) {
  const db = await getDb();
  await db.insert(orders).values(order);

  return order;
}

export async function updateOrder(
  order_no: string,
  order: Partial<typeof orders.$inferInsert>
) {
  const db = await getDb();
  await db.update(orders).set(order).where(eq(orders.order_no, order_no));

  return order;
}

export async function findOrderByOrderNo(
  order_no: string
): Promise<typeof orders.$inferSelect | undefined> {
  const db = await getDb();
  const data = await db
    .select()
    .from(orders)
    .where(eq(orders.order_no, order_no))
    .limit(1);

  return data ? data[0] : undefined;
}

export async function getFirstPaidOrderByUserUuid(
  user_uuid: string
): Promise<typeof orders.$inferSelect | undefined> {
  const db = await getDb();
  const data = await db
    .select()
    .from(orders)
    .where(
      and(eq(orders.user_uuid, user_uuid), eq(orders.status, OrderStatus.Paid))
    )
    .orderBy(asc(orders.created_at))
    .limit(1);

  return data ? data[0] : undefined;
}

export async function getFirstPaidOrderByUserEmail(
  user_email: string
): Promise<typeof orders.$inferSelect | undefined> {
  const db = await getDb();
  const data = await db
    .select()
    .from(orders)
    .where(
      and(
        eq(orders.user_email, user_email),
        eq(orders.status, OrderStatus.Paid)
      )
    )
    .orderBy(asc(orders.created_at))
    .limit(1);

  return data ? data[0] : undefined;
}

export async function getOrdersByUserUuid(
  user_uuid: string,
  page: number = 1,
  limit: number = 50
): Promise<(typeof orders.$inferSelect)[]> {
  const db = await getDb();
  const data = await db
    .select()
    .from(orders)
    .where(
      and(eq(orders.user_uuid, user_uuid), eq(orders.status, OrderStatus.Paid))
    )
    .orderBy(desc(orders.created_at))
    .limit(limit)
    .offset((page - 1) * limit);

  return data;
}

export async function getOrdersByUserEmail(
  user_email: string,
  page: number = 1,
  limit: number = 50
): Promise<(typeof orders.$inferSelect)[]> {
  const db = await getDb();
  const data = await db
    .select()
    .from(orders)
    .where(
      and(
        eq(orders.user_email, user_email),
        eq(orders.status, OrderStatus.Paid)
      )
    )
    .orderBy(desc(orders.created_at))
    .limit(limit)
    .offset((page - 1) * limit);

  return data;
}

export async function getOrdersByPaidEmail(
  paid_email: string,
  page: number = 1,
  limit: number = 50
): Promise<(typeof orders.$inferSelect)[]> {
  const db = await getDb();
  const data = await db
    .select()
    .from(orders)
    .where(
      and(
        eq(orders.paid_email, paid_email),
        eq(orders.status, OrderStatus.Paid)
      )
    )
    .orderBy(desc(orders.created_at))
    .limit(limit)
    .offset((page - 1) * limit);

  return data;
}

export async function getPaiedOrders(
  page: number = 1,
  limit: number = 50
): Promise<(typeof orders.$inferSelect)[]> {
  const db = await getDb();
  const data = await db
    .select()
    .from(orders)
    .where(eq(orders.status, OrderStatus.Paid))
    .orderBy(desc(orders.created_at))
    .limit(limit)
    .offset((page - 1) * limit);

  return data;
}
