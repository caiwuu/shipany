import {
  findCreditByOrderNo,
  getUserValidCredits,
  insertCredit,
} from "@/models/credit";

import { Credit } from "@/types/credit";
import { Order } from "@/types/order";
import { UserCredits } from "@/types/user";
import { findUserByUuid } from "@/models/user";
import { getFirstPaidOrderByUserUuid } from "@/models/order";
import { getIsoTimestr } from "@/lib/time";
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
}: {
  user_uuid: string;
  trans_type: CreditsTransType;
  credits: number;
}) {
  try {
    let order_no = "";
    let expired_at = "";
    let left_credits = 0;

    const userCredits = await getUserValidCredits(user_uuid);
    if (userCredits) {
      for (let i = 0, l = userCredits.length; i < l; i++) {
        const credit = userCredits[i];
        left_credits += credit.credits;

        // credit enough for cost
        if (left_credits >= credits) {
          order_no = credit.order_no;
          expired_at = credit.expired_at || "";
          break;
        }

        // look for next credit
      }
    }

    const new_credit: Credit = {
      trans_no: getSnowId(),
      created_at: getIsoTimestr(),
      user_uuid: user_uuid,
      trans_type: trans_type,
      credits: 0 - credits,
      order_no: order_no,
      expired_at: expired_at,
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

export async function updateCreditForOrder(order: Order) {
  try {
    const credit = await findCreditByOrderNo(order.order_no);
    if (credit) {
      // order already increased credit
      return;
    }

    await increaseCredits({
      user_uuid: order.user_uuid,
      trans_type: CreditsTransType.OrderPay,
      credits: order.credits,
      expired_at: order.expired_at,
      order_no: order.order_no,
    });
  } catch (e) {
    console.log("update credit for order failed: ", e);
    throw e;
  }
}
