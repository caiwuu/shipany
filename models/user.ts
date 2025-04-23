import { User } from "@/types/user";
import { getIsoTimestr } from "@/lib/time";
import { getSupabaseClient } from "./db";

export async function insertUser(user: User) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase.from("users").insert(user);

  if (error) {
    throw error;
  }

  return data;
}

export async function findUserByEmail(
  email: string
): Promise<User | undefined> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .limit(1)
    .single();

  if (error) {
    return undefined;
  }

  return data;
}

export async function findUserByUuid(uuid: string): Promise<User | undefined> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("uuid", uuid)
    .single();

  if (error) {
    return undefined;
  }

  return data;
}

export async function getUsers(
  page: number = 1,
  limit: number = 50
): Promise<User[] | undefined> {
  if (page < 1) page = 1;
  if (limit <= 0) limit = 50;

  const offset = (page - 1) * limit;
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    return undefined;
  }

  return data;
}

export async function updateUserInviteCode(
  user_uuid: string,
  invite_code: string
) {
  const supabase = getSupabaseClient();
  const updated_at = getIsoTimestr();
  const { data, error } = await supabase
    .from("users")
    .update({ invite_code, updated_at })
    .eq("uuid", user_uuid);

  if (error) {
    throw error;
  }

  return data;
}

export async function updateUserInvitedBy(
  user_uuid: string,
  invited_by: string
) {
  const supabase = getSupabaseClient();
  const updated_at = getIsoTimestr();
  const { data, error } = await supabase
    .from("users")
    .update({ invited_by, updated_at })
    .eq("uuid", user_uuid);

  if (error) {
    throw error;
  }

  return data;
}

export async function getUsersByUuids(user_uuids: string[]): Promise<User[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .in("uuid", user_uuids);
  if (error) {
    return [];
  }

  return data as User[];
}

export async function findUserByInviteCode(invite_code: string) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("invite_code", invite_code)
    .single();

  if (error) {
    return undefined;
  }

  return data;
}

export async function getUserUuidsByEmail(email: string) {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("users")
    .select("uuid")
    .eq("email", email);
  if (error) {
    return [];
  }

  return data.map((user) => user.uuid);
}
