import { CreditsTransType, increaseCredits } from "./credit";
import { OrderStatus, findOrderByOrderNo, updateOrder } from "@/models/order";
import { getIsoTimestr, getTime } from "@/lib/time";

import Stripe from "stripe";

export async function handleOrderSession(session: Stripe.Checkout.Session) {
  try {
    if (
      !session ||
      !session.metadata ||
      !session.metadata.order_no ||
      session.payment_status !== "paid"
    ) {
      throw new Error("invalid session");
    }

    const order_no = session.metadata.order_no;
    const paid_email =
      session.customer_details?.email || session.customer_email || "";
    const paid_detail = JSON.stringify(session);

    const order = await findOrderByOrderNo(order_no);
    if (!order || order.status !== "created") {
      throw new Error("invalid order");
    }

    const paid_at = getIsoTimestr();
    await updateOrder(order_no, {
      status: OrderStatus.Paid,
      paid_at,
      paid_email,
      paid_detail,
    });

    if (order.user_uuid && order.credits > 0) {
      // increase credits for paied order
      await increaseCredits({
        user_uuid: order.user_uuid,
        trans_type: CreditsTransType.OrderPay,
        credits: order.credits,
        expired_at: order.expired_at || undefined,
        order_no: order_no,
      });
    }

    console.log(
      "handle order session successed: ",
      order_no,
      paid_at,
      paid_email,
      paid_detail
    );
  } catch (e) {
    console.log("handle order session failed: ", e);
    throw e;
  }
}
