import { User } from "@/types/user";

export interface Affiliate {
  user_uuid: string;
  created_at: string;
  status: string;
  invited_by: string;
  paid_order_no: string;
  paid_amount: number;
  reward_percent: number;
  reward_amount: number;
  user?: User;
  invited_by_user?: User;
}
