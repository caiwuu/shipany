import { getIsoTimestr, getOneYearLaterTimestr } from "@/lib/time";
import { getUserValidCredits, insertCredit } from "@/models/credit";

import { Credit } from "@/types/credit";
import { UserCredits } from "@/types/user";
import { getFirstPaidOrderByUserUuid } from "@/models/order";
import { getSnowId } from "@/lib/hash";

export enum CreditsTransType {
  NewUser = "new_user", // initial credits for new user
  OrderPay = "order_pay", // user pay for credits
  SystemAdd = "system_add", // system add credits
  Ping = "ping", // cost for ping api
}

export enum CreditsAmount {
  NewUserGet = 10,
  PingCost = 1,
}

export async function getUserCredits(user_uuid: string): Promise<UserCredits> {
  let user_credits: UserCredits = {
    left_credits: 0,
  };

  try {
    const first_paid_order = await getFirstPaidOrderByUserUuid(user_uuid);
    if (first_paid_order) {
      user_credits.is_recharged = true;
    }

    const credits = await getUserValidCredits(user_uuid);
    if (credits) {
      credits.forEach((v: Credit) => {
        user_credits.left_credits += v.credits;
      });
    }

    if (user_credits.left_credits < 0) {
      user_credits.left_credits = 0;
    }

    if (user_credits.left_credits > 0) {
      user_credits.is_pro = true;
    }

    return user_credits;
  } catch (e) {
    console.log("get user credits failed: ", e);
    return user_credits;
  }
}

export async function decreaseCredits({
  user_uuid,
  trans_type,
  credits,
  order_no,
  expired_at,
}: {
  user_uuid: string;
  trans_type: CreditsTransType;
  credits: number;
  order_no?: string;
  expired_at?: string;
}) {
  try {
    const userCredits = await getUserCredits(user_uuid);
    if (userCredits.left_credits < credits) {
      throw new Error("credits not enough");
    }

    const new_credit: Credit = {
      trans_no: getSnowId(),
      created_at: getIsoTimestr(),
      user_uuid: user_uuid,
      trans_type: trans_type,
      credits: 0 - credits,
      order_no: order_no || "",
      expired_at: expired_at || getOneYearLaterTimestr(),
    };
    await insertCredit(new_credit);
  } catch (e) {
    console.log("decrease credits failed: ", e);
    throw e;
  }
}

export async function increaseCredits({
  user_uuid,
  trans_type,
  credits,
  expired_at,
  order_no,
}: {
  user_uuid: string;
  trans_type: string;
  credits: number;
  expired_at?: string;
  order_no?: string;
}) {
  try {
    const new_credit: Credit = {
      trans_no: getSnowId(),
      created_at: getIsoTimestr(),
      user_uuid: user_uuid,
      trans_type: trans_type,
      credits: credits,
      order_no: order_no || "",
      expired_at: expired_at || "",
    };
    await insertCredit(new_credit);
  } catch (e) {
    console.log("increase credits failed: ", e);
    throw e;
  }
}
