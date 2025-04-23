import {
  integer,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

export const users = sqliteTable(
  "users",
  {
    id: integer().primaryKey({ autoIncrement: true }),
    uuid: text().unique().notNull(),
    email: text().notNull(),
    created_at: text(),
    nickname: text(),
    avatar_url: text(),
    locale: text(),
    signin_type: text(),
    signin_ip: text(),
    signin_provider: text(),
    signin_openid: text(),
  },
  (table) => [
    uniqueIndex("email_provider_unique_idx").on(
      table.email,
      table.signin_provider
    ),
  ]
);

export const orders = sqliteTable("orders", {
  id: integer().primaryKey({ autoIncrement: true }),
  order_no: text().unique().notNull(),
  created_at: text(),
  user_uuid: text().notNull(),
  user_email: text().notNull(),
  amount: integer().notNull(),
  interval: text(),
  expired_at: text(),
  status: text().notNull(),
  stripe_session_id: text(),
  credits: integer().notNull(),
  currency: text(),
  sub_id: text(),
  sub_interval_count: integer(),
  sub_cycle_anchor: integer(),
  sub_period_end: integer(),
  sub_period_start: integer(),
  sub_times: integer(),
  product_id: text(),
  product_name: text(),
  valid_months: integer(),
  order_detail: text(),
  paid_at: text(),
  paid_email: text(),
  paid_detail: text(),
});

export const apikeys = sqliteTable("apikeys", {
  id: integer().primaryKey({ autoIncrement: true }),
  api_key: text().unique().notNull(),
  title: text(),
  user_uuid: text().notNull(),
  created_at: text(),
  status: text(),
});

export const credits = sqliteTable("credits", {
  id: integer().primaryKey({ autoIncrement: true }),
  trans_no: text().unique().notNull(),
  created_at: text(),
  user_uuid: text().notNull(),
  trans_type: text().notNull(),
  credits: integer().notNull(),
  order_no: text(),
  expired_at: text(),
});

export const posts = sqliteTable("posts", {
  id: integer().primaryKey({ autoIncrement: true }),
  uuid: text().unique().notNull(),
  slug: text(),
  title: text(),
  description: text(),
  content: text(),
  created_at: text(),
  updated_at: text(),
  status: text(),
  cover_url: text(),
  author_name: text(),
  author_avatar_url: text(),
  locale: text(),
});
