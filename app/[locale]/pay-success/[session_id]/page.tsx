import Stripe from "stripe";
import { handleOrderSession } from "@/services/order";
import { redirect } from "next/navigation";

export default async function ({
  params,
}: {
  params: Promise<{ session_id: string }>;
}) {
  try {
    const { session_id } = await params;

    const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY || "");
    const session = await stripe.checkout.sessions.retrieve(session_id);

    await handleOrderSession(session);

    redirect(process.env.NEXT_PUBLIC_PAY_SUCCESS_URL || "/");
  } catch (e) {
    redirect(process.env.NEXT_PUBLIC_PAY_FAIL_URL || "/");
  }
}
