import { Affiliate } from "@/types/affiliate";
import { User } from "@/types/user";
import { getSupabaseClient } from "@/models/db";
import { getUsersByUuids } from "./user";

export async function insertAffiliate(affiliate: Affiliate) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.from("affiliates").insert({
    user_uuid: affiliate.user_uuid,
    invited_by: affiliate.invited_by,
    created_at: affiliate.created_at,
    status: affiliate.status,
    paid_order_no: affiliate.paid_order_no,
    paid_amount: affiliate.paid_amount,
    reward_percent: affiliate.reward_percent,
    reward_amount: affiliate.reward_amount,
  });

  if (error) {
    throw error;
  }

  return data;
}

export async function getUserAffiliates(
  user_uuid: string,
  page: number = 1,
  limit: number = 50
): Promise<Affiliate[] | undefined> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("affiliates")
    .select("*")
    .eq("invited_by", user_uuid)
    .order("created_at", { ascending: false })
    .range((page - 1) * limit, page * limit);

  if (error) {
    console.error("Error fetching user invites:", error);
    return [];
  }

  if (!data || data.length === 0) {
    return undefined;
  }

  const user_uuids = Array.from(new Set(data.map((item) => item.user_uuid)));

  const users = await getUsersByUuids(user_uuids);
  const affiliates = data.map((item) => {
    const user = users.find((user) => user.uuid === item.user_uuid);
    return { ...item, user };
  });

  return affiliates;
}

export async function getAffiliateSummary(user_uuid: string) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("affiliates")
    .select("*")
    .eq("invited_by", user_uuid);

  const summary = {
    total_invited: 0,
    total_paid: 0,
    total_reward: 0,
  };

  if (error) {
    return summary;
  }

  const invited_users = new Set();
  const paid_users = new Set();

  data.forEach((item) => {
    invited_users.add(item.user_uuid);
    if (item.paid_amount > 0) {
      paid_users.add(item.user_uuid);

      summary.total_reward += item.reward_amount;
    }
  });

  summary.total_invited = invited_users.size;
  summary.total_paid = paid_users.size;

  return summary;
}

export async function findAffiliateByOrderNo(order_no: string) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("affiliates")
    .select("*")
    .eq("paid_order_no", order_no)
    .single();

  if (error) {
    return undefined;
  }

  return data;
}

export async function getAllAffiliates(
  page: number = 1,
  limit: number = 50
): Promise<Affiliate[]> {
  if (page < 1) page = 1;
  if (limit <= 0) limit = 50;

  const offset = (page - 1) * limit;

  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("affiliates")
    .select("*")
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    return [];
  }

  if (!data || data.length === 0) {
    return [];
  }

  const user_uuids = Array.from(new Set(data.map((item) => item.user_uuid)));
  const invited_by_uuids = Array.from(
    new Set(data.map((item) => item.invited_by))
  );

  const users = await getUsersByUuids(user_uuids);
  const invited_by_users = await getUsersByUuids(invited_by_uuids);

  const affiliates = data.map((item) => {
    const user = users.find((user) => user.uuid === item.user_uuid);
    const invited_by = invited_by_users.find(
      (user) => user.uuid === item.invited_by
    );
    return { ...item, user, invited_by_user: invited_by };
  });

  return affiliates;
}
